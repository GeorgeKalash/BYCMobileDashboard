import React, { useEffect, useState, useCallback } from "react";
import { FormGroup, Label, Spinner, Button } from "reactstrap";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { useAppDispatch } from "@/Redux/Hooks";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { RefreshCw, XCircle } from "react-feather";

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
  isRequired?: boolean;
  showRefresh?: boolean;
  loadingText?: string;
  defaultIndex?: number;
  valueKey?: string;
  labelKey?: string;
  value?: string | number | null;
  onChange?: (value: string | number | null) => void;
  readOnly?: boolean;
}

const CustomSelectInlineIcons: React.FC<CustomSelectProps> = ({
  name,
  label = "",
  options = null,
  endpointId,
  dataSetId,
  isRequired = false,
  showRefresh = true,
  loadingText = "Loading...",
  defaultIndex,
  valueKey = "key",
  labelKey = "value",
  value,
  onChange,
  readOnly = false,
}) => {
  const [selectOptions, setSelectOptions] = useState<OptionType[]>(
    options || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [localValue, setLocalValue] = useState<string | number | "">(
    value ?? ""
  );

  const dispatch = useAppDispatch();
  const reduxLangId = useSelector(
    (state: RootState) => state.authSlice.languageId
  );
  const langId =
    reduxLangId || parseInt(localStorage.getItem("languageId") || "1", 10);

  const loadOptions = useCallback(async () => {
    const url = dataSetId ? `/api/KVS/getAllKVS` : endpointId;
    if (!url) return;

    setIsLoading(true);
    const action = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: url,
          parameters: dataSetId
            ? `_dataset=${dataSetId}&_language=${langId}`
            : "",
        })
      )
    );

    const data = action.payload?.data ?? [];
    const mapped: OptionType[] = data.map((item: any) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));

    setSelectOptions(mapped);

    if (typeof value !== "undefined" && value !== null) {
      setLocalValue(value);
      onChange?.(value);
    } else if (typeof defaultIndex === "number" && mapped[defaultIndex]) {
      const initialValue = mapped[defaultIndex].value;
      setLocalValue(initialValue);
      onChange?.(initialValue);
    } else {
      setLocalValue("");
    }

    setIsLoading(false);
  }, [
    dataSetId,
    endpointId,
    dispatch,
    langId,
    valueKey,
    labelKey,
    defaultIndex,
    value,
    onChange,
  ]);

  useEffect(() => {
    if ((dataSetId || endpointId) && selectOptions.length === 0) {
      loadOptions();
    }
  }, [dataSetId, endpointId, selectOptions.length, loadOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const finalValue = newValue === "" ? null : newValue;
    setLocalValue(newValue);
    onChange?.(finalValue);
  };

  const clearSelection = () => {
    setLocalValue("");
    onChange?.(null);
  };

  const isFieldFilled = localValue !== "";
  const validationClass = isRequired && !isFieldFilled ? "is-invalid" : "";

  return (
    <FormGroup>
      {label && (
        <Label className="mb-1 d-block">
          {label} {isRequired && <span className="text-danger">*</span>}
        </Label>
      )}

      <div style={{ position: "relative" }}>
        {isLoading ? (
          <div className="form-control d-flex align-items-center">
            <Spinner size="sm" /> <span className="ms-2">{loadingText}</span>
          </div>
        ) : (
          <>
            <select
              name={name}
              className={`form-control form-select ${validationClass}`}
              value={localValue}
              onChange={handleChange}
              disabled={readOnly}
            >
              <option value="" disabled hidden>
                Select...
              </option>
              {selectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {!readOnly && (
              <>
                {(dataSetId || endpointId) && showRefresh && (
                  <Button
                    type="button"
                    color="link"
                    size="sm"
                    onClick={loadOptions}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "3.5rem",
                      transform: "translateY(-50%)",
                      padding: 0,
                    }}
                    title="Refresh"
                  >
                    <RefreshCw size={16} />
                  </Button>
                )}

                <Button
                  type="button"
                  color="link"
                  size="sm"
                  onClick={clearSelection}
                  className="text-danger"
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "2rem",
                    transform: "translateY(-50%)",
                    padding: 0,
                  }}
                  title="Clear"
                >
                  <XCircle size={16} />
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </FormGroup>
  );
};

export default CustomSelectInlineIcons;
