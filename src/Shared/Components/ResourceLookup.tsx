"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { FormGroup, Label, Input, Spinner } from "reactstrap";
import { useAppDispatch } from "@/Redux/Hooks";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { useTranslation } from "react-i18next";
import DataTableComponent from "@/Shared/Components/DataTable";

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface SearchableLookupProps {
  name: string;
  label?: string;
  endpoint: string;
  parameters?: Record<string, any>;
  columns: Column[];
  minChars?: number;
  isRequired?: boolean;
  value?: any;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  searchParamKey?: string;
}

const SearchableLookup: React.FC<SearchableLookupProps> = ({
  name,
  label = "",
  endpoint,
  parameters = {},
  columns,
  minChars = 2,
  isRequired = false,
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  searchParamKey = "_filter",
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState(value || "");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async (query: string) => {
    if (query.length < minChars) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    const queryParams = new URLSearchParams({
      ...parameters,
      [searchParamKey]: query,
    });

    const action = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: endpoint,
          parameters: queryParams.toString(),
        })
      )
    );

    setResults(action.payload?.data || []);
    setLoading(false);
    setShowDropdown(true);
  };

  const handleSelect = (item: any) => {
    const firstColumnKey = columns[0]?.key;
    setInputValue(item[firstColumnKey]);
    setShowDropdown(false);
    onChange(item);
  };

  const tableColumns = useMemo(() => {
    return columns.map((col) => ({
      name: col.label,
      id: col.key,
      selector: (row: any) => row[col.key],
      cell: (row: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleSelect(row)}
          title={row[col.key]}
        >
          {row[col.key]}
        </div>
      ),
      sortable: false,
      wrap: true,
      width: col.width,
    }));
  }, [columns]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <FormGroup>
        {label && (
          <Label>
            {label} {isRequired && <span className="text-danger">*</span>}
          </Label>
        )}

        <div className="position-relative">
          <Input
            name={name}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            disabled={disabled}
            className={`form-control ${
              isRequired && !inputValue ? "is-invalid" : ""
            }`}
            style={{
              paddingRight: "2rem",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
            onChange={(e) => {
              const val = e.target.value;
              setInputValue(val);
              fetchData(val);
            }}
            onClick={() => {
              if (inputValue.length >= minChars && results.length > 0) {
                setShowDropdown(true);
              }
            }}
            autoComplete="off"
          />
          <i
            className="fa fa-search position-absolute"
            style={{
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#aaa",
            }}
          />
        </div>
      </FormGroup>

      {loading && (
        <div
          className="bg-white border d-flex align-items-center"
          style={{
            position: "absolute",
            top: "100%",
            zIndex: 1050,
            width: "100%",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "0.75rem",
          }}
        >
          <Spinner size="sm" className="me-2" />
          {t("Searching")}...
        </div>
      )}
      {!loading && showDropdown && results.length === 0 && (
        <div
          className="bg-white border text-muted text-center"
          style={{
            position: "absolute",
            top: "100%",
            zIndex: 1050,
            width: "100%",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "0.75rem",
          }}
        >
          <i className="fa fa-search-minus me-2" style={{ fontSize: "16px" }} />
          {t("No data available")}
        </div>
      )}

      {showDropdown && results.length > 0 && (
        <div
          className="bg-white border"
          style={{
            position: "absolute",
            top: "100%",
            zIndex: 1050,
            width: "100%",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            maxHeight: "300px",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DataTableComponent
            data={results}
            columns={tableColumns}
            pagination={false}
            highlightOnHover
            direction="ltr"
            showActions={false}
            Search={false}
          />
        </div>
      )}
    </div>
  );
};

export default SearchableLookup;
