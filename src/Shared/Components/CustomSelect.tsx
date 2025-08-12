"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormGroup, Label, Spinner, Button } from "reactstrap";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { useAppDispatch } from "@/Redux/Hooks";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { RefreshCw, XCircle } from "react-feather";
import { useTranslation } from "react-i18next";
type OptionType = { value: string | number; label: string };
interface CustomSelectProps {
  name: string;
  label?: string;
  options?: OptionType[] | null;
  endpointId?: string;
  parameters?: string;
  dataSetId?: number | string;
  dashboardDatasetId?: number | string;
  isRequired?: boolean;
  showRefresh?: boolean;
  loadingText?: string;
  defaultIndex?: number;
  valueKey?: string;
  labelKey?: string;
  value?: string | number | null;
  onChange?: (value: string | number | null) => void;
  readOnly?: boolean;
  clearable?: boolean;
  placeholder?: string;
}
const CustomSelectInlineIcons: React.FC<CustomSelectProps> = ({
  name,
  label = "",
  options = null,
  endpointId,
  parameters,
  dataSetId,
  dashboardDatasetId,
  isRequired = false,
  showRefresh = true,
  loadingText = "Loading…",
  defaultIndex,
  valueKey = "key",
  labelKey = "value",
  value,
  onChange,
  readOnly = false,
  clearable = true,
  placeholder = "Select…",
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const reduxLangId = useSelector((s: RootState) => s.authSlice.languageId);
  const langId =
    reduxLangId || parseInt(localStorage.getItem("languageId") || "1", 10);
  const [selectOptions, setSelectOptions] = useState<OptionType[]>(
    options || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    if (options) setSelectOptions(options);
  }, [options]);
  const fetchOptions = async (preserveSelected = true) => {
    if (readOnly) return;
    let url = "";
    let params = "";
    if (dashboardDatasetId) {
      url = "/api/KVS/Dashboard/getAllKVS";
      params = `_dataset=${dashboardDatasetId}&_language=${langId}`;
    } else if (dataSetId) {
      url = "/api/KVS/getAllKVS";
      params = `_dataset=${dataSetId}&_language=${langId}`;
    } else if (endpointId) {
      url = endpointId;
      params = parameters
        ? endpointId.includes("?")
          ? parameters
          : `?${parameters}`
        : "";
    }
    if (!url) return;
    setIsLoading(true);
    const action = await withRequestTracking(dispatch, () =>
      dispatch(getMobileRequest({ extension: url, parameters: params }))
    );
    const data = action.payload?.data ?? [];
    const mapped: OptionType[] = data.map((item: any) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));
    setSelectOptions(mapped);
    if (preserveSelected || (value !== null && value !== undefined)) {
      setIsLoading(false);
      return;
    }
    if (typeof defaultIndex === "number" && mapped[defaultIndex]) {
      onChange?.(mapped[defaultIndex].value);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if ((dashboardDatasetId || dataSetId || endpointId) && !readOnly) {
      fetchOptions(true);
    }
  }, [dashboardDatasetId, dataSetId, endpointId, parameters, langId]);
  useEffect(() => {
    const selected = selectOptions.find(
      (o) => String(o.value) === String(value ?? "")
    );
    setQuery(selected?.label ?? "");
  }, [value, selectOptions]);
  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return selectOptions;
    return selectOptions.filter((o) => o.label.toLowerCase().includes(q));
  }, [query, selectOptions]);
  const isFieldFilled =
    value !== "" && value !== null && typeof value !== "undefined";
  const validationClass = isRequired && !isFieldFilled ? "is-invalid" : "";
  const selectOption = (opt: OptionType) => {
    if (readOnly) return;
    onChange?.(opt.value);
    setQuery(opt.label);
    setOpen(false);
    setActiveIndex(-1);
  };
  const clearSelection = () => {
    if (readOnly) return;
    onChange?.(null);
    setQuery("");
    setActiveIndex(-1);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (readOnly) return;
    if (!open && (e.key.length === 1 || e.key === "Backspace")) {
      setOpen(true);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open) {
        if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          selectOption(filteredOptions[activeIndex]);
        } else if (filteredOptions[0]) {
          selectOption(filteredOptions[0]);
        }
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      const t = ev.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(t) &&
        !listRef.current?.contains(t)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  return (
    <FormGroup>
      {label && (
        <Label className="mb-1 d-block">
          {t(label)} {isRequired && <span className="text-danger">*</span>}
        </Label>
      )}
      <div style={{ position: "relative" }}>
        <input type="hidden" name={name} value={value ?? ""} />
        {isLoading ? (
          <div className="form-control d-flex align-items-center">
            <Spinner size="sm" /> <span className="ms-2">{t(loadingText)}</span>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              type="text"
              className={`form-control ${validationClass} ${
                readOnly ? "bg-light text-muted" : ""
              }`}
              value={query}
              onChange={(e) => {
                if (readOnly) return;
                setQuery(e.target.value);
                setOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => {
                if (!readOnly) setOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={t(placeholder)}
              readOnly={readOnly}
              aria-autocomplete="list"
              aria-expanded={!readOnly && open}
              aria-controls={`${name}-listbox`}
              aria-activedescendant={
                activeIndex >= 0 ? `${name}-option-${activeIndex}` : undefined
              }
            />
            {!readOnly && (
              <>
                {(dashboardDatasetId || dataSetId || endpointId) &&
                  showRefresh && (
                    <Button
                      type="button"
                      color="link"
                      size="sm"
                      onClick={() => fetchOptions(true)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        insetInlineEnd: clearable ? "3.5rem" : "2rem",
                        transform: "translateY(-50%)",
                        padding: 0,
                      }}
                      title={t("Refresh")}
                    >
                      <RefreshCw size={16} />
                    </Button>
                  )}
                {clearable && (
                  <Button
                    type="button"
                    color="link"
                    size="sm"
                    onClick={clearSelection}
                    className="text-danger"
                    style={{
                      position: "absolute",
                      top: "50%",
                      insetInlineEnd: "2rem",
                      transform: "translateY(-50%)",
                      padding: 0,
                    }}
                    title={t("Clear")}
                  >
                    <XCircle size={16} />
                  </Button>
                )}
              </>
            )}
            {!readOnly && open && (
              <ul
                ref={listRef}
                id={`${name}-listbox`}
                role="listbox"
                className="list-group"
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  width: "100%",
                  maxHeight: 240,
                  overflowY: "auto",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                }}
              >
                {filteredOptions.length === 0 ? (
                  <li className="list-group-item text-muted">
                    {t("No results")}
                  </li>
                ) : (
                  filteredOptions.map((opt, idx) => {
                    const isActive = idx === activeIndex;
                    const isSelected =
                      String(value ?? "") === String(opt.value);
                    return (
                      <li
                        key={String(opt.value)}
                        id={`${name}-option-${idx}`}
                        role="option"
                        aria-selected={isSelected}
                        className={`list-group-item ${
                          isActive ? "active" : ""
                        } d-flex justify-content-between align-items-center`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectOption(opt);
                        }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        style={{ cursor: "pointer" }}
                      >
                        <span>{opt.label}</span>
                      </li>
                    );
                  })
                )}
              </ul>
            )}
          </>
        )}
      </div>
    </FormGroup>
  );
};
export default CustomSelectInlineIcons;