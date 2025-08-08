import React, { useEffect, useState, useCallback, useRef } from "react";
import { FormGroup, Label, Spinner, Button } from "reactstrap";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { RefreshCw, XCircle } from "react-feather";
import { useTranslation } from "@/app/i18n/client";
type OptionType = {
  value: string | number;
  label: string;
};
interface CustomSelectProps {
  name: string;
  label?: string;
  options?: OptionType[] | null;
  endpointId?: string;
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
}
const CustomSelectInlineIcons: React.FC<CustomSelectProps> = ({
  name,
  label = "",
  options = null,
  endpointId,
  dataSetId,
  dashboardDatasetId,
  isRequired = false,
  showRefresh = true,
  loadingText = "Loading...",
  defaultIndex,
  valueKey = "key",
  labelKey = "value",
  value,
  onChange,
  readOnly = false,
  clearable = true,
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const reduxLangId = useSelector(
    (state: RootState) => state.authSlice.languageId
  );
  const langId = parseInt(localStorage.getItem("languageId") || "1", 10);
  const isRtl =
    typeof window !== "undefined" && localStorage.getItem("dir") === "rtl";
  const [selectOptions, setSelectOptions] = useState<OptionType[]>(
    options || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const refreshIconStyle = {
    position: "absolute",
    top: "50%",
    [isRtl ? "left" : "right"]: clearable ? "3.5rem" : "2rem",
    transform: "translateY(-50%)",
    padding: 0,
  } as const;
  const clearIconStyle = {
    position: "absolute",
    top: "50%",
    [isRtl ? "left" : "right"]: "2rem",
    transform: "translateY(-50%)",
    padding: 0,
  } as const;
  const loadOptions = useCallback(
    async (preserveSelected = false) => {
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
      }
      if (!url) return;
      setIsLoading(true);
      const action = await withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: url,
            parameters: params,
          })
        )
      );
      const data = action.payload?.data ?? [];
      const mapped: OptionType[] = data.map((item: any) => ({
        value: item[valueKey],
        label: item[labelKey],
      }));
      setSelectOptions(mapped);
      if (!preserveSelected) {
        if (typeof value !== "undefined" && value !== null) {
          onChange?.(value);
        } else if (typeof defaultIndex === "number" && mapped[defaultIndex]) {
          onChange?.(mapped[defaultIndex].value);
        } else {
          onChange?.(null);
        }
      }
      setIsLoading(false);
    },
    [
      dashboardDatasetId,
      dataSetId,
      endpointId,
      dispatch,
      langId,
      valueKey,
      labelKey,
      defaultIndex,
      value,
      onChange,
    ]
  );
  useEffect(() => {
    if (
      (dashboardDatasetId || dataSetId || endpointId) &&
      selectOptions.length === 0
    ) {
      loadOptions(false);
    }
  }, [
    dashboardDatasetId,
    dataSetId,
    endpointId,
    selectOptions.length,
    loadOptions,
  ]);
  useEffect(() => {
    const selected = selectOptions.find((opt) => opt.value === value);
    if (selected) setSearchTerm(selected.label);
    else setSearchTerm("");
  }, [value, selectOptions]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelect = (opt: OptionType) => {
    onChange?.(opt.value);
    setSearchTerm(opt.label);
    setShowDropdown(false);
  };
  const clearSelection = () => {
    onChange?.(null);
    setSearchTerm("");
  };
  const isFieldFilled =
    value !== "" && value !== null && typeof value !== "undefined";
  const validationClass = isRequired && !isFieldFilled ? "is-invalid" : "";
  const filteredOptions = selectOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <FormGroup dir={isRtl ? "rtl" : "ltr"}>
      {label && (
        <Label className="mb-1 d-block">
          {label} {isRequired && <span className="text-danger">*</span>}
        </Label>
      )}
      <div style={{ position: "relative" }} ref={containerRef}>
        {isLoading ? (
          <div className="form-control d-flex align-items-center">
            <Spinner size="sm" /> <span className="ms-2">{loadingText}</span>
          </div>
        ) : (
          <>
            <input
              type="text"
              name={name}
              className={`form-control ${validationClass}`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              disabled={readOnly}
              placeholder={t("Select")}
              autoComplete="off"
            />
            {showDropdown && filteredOptions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 999,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  maxHeight: "200px",
                  overflowY: "auto",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                {filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt)}
                    style={{
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      backgroundColor:
                        opt.value === value
                          ? "rgba(0, 123, 255, 0.1)"
                          : "white",
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
            {!readOnly && (
              <>
                {(dashboardDatasetId || dataSetId || endpointId) &&
                  showRefresh && (
                    <Button
                      type="button"
                      color="link"
                      size="sm"
                      onClick={() => loadOptions(true)}
                      style={refreshIconStyle}
                      title="Refresh"
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
                    style={clearIconStyle}
                    title="Clear"
                  >
                    <XCircle size={16} />
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </FormGroup>
  );
};
export default CustomSelectInlineIcons;