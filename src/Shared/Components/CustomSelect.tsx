import React, { useEffect, useState, useCallback } from "react";
import { FormGroup, Label, Spinner, Button } from "reactstrap";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { useAppDispatch } from "@/Redux/Hooks";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { withRequestTracking } from "@/utils/withRequestTracking ";

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
  value?: string | number | null | undefined;
  onChange?: (value: string | number | null) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
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
}) => {
  const [selectOptions, setSelectOptions] = useState<OptionType[]>(options || []);
  const [isLoading, setIsLoading] = useState(false);
  const [localValue, setLocalValue] = useState<string | number | "">(
    value ?? ""
  );

  const dispatch = useAppDispatch();
  const reduxLangId = useSelector((state: RootState) => state.authSlice.languageId);
  const langId = reduxLangId || parseInt(localStorage.getItem("languageId") || "1", 10);

  const loadOptions = useCallback(async () => {
    const url = dataSetId ? `/api/KVS/getAllKVS` : endpointId;
    if (!url) return;

    setIsLoading(true);
    const action = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: url,
          parameters: dataSetId ? `_dataset=${dataSetId}&_language=${langId}` : '',
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
  }, [dataSetId, endpointId, dispatch, langId, valueKey, labelKey, defaultIndex, value, onChange]);

  useEffect(() => {
    if ((dataSetId || endpointId) && selectOptions.length === 0) {
      loadOptions();
    }
  }, [dataSetId, endpointId, selectOptions.length, loadOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const finalValue = newValue === "" ? null : newValue; // empty means null
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
        <Label>
          {label} {isRequired && <span className="text-danger">*</span>}
          {(dataSetId || endpointId) && showRefresh && (
            <Button
              type="button"
              color="link"
              size="sm"
              onClick={loadOptions}
              className="ms-2 p-0 align-baseline"
              title="Refresh options"
            >
              🔄
            </Button>
          )}
          <Button
            type="button"
            color="link"
            size="sm"
            onClick={clearSelection}
            className="p-0 align-baseline text-danger"
            title="Clear selection"
          >
            ❌
          </Button>
        </Label>
      )}
      {isLoading ? (
        <div className="form-control">
          <Spinner size="sm" /> {loadingText}
        </div>
      ) : (
        <select
          name={name}
          className={`form-control form-select ${validationClass}`}
          value={localValue}
          onChange={handleChange}
        >
          <option value="" disabled hidden>
            {"Select..."}
          </option>
          {selectOptions.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </FormGroup>
  );
};

export default CustomSelect;
