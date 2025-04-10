"use client";
import React, {
  useState,
  useEffect,
  forwardRef,
  useId,
  useCallback,
} from "react";
import { Card, CardBody, Col, FormGroup, Row } from "reactstrap";
import { ChooseActivities } from "@/Constant";

// ----------------------------------------------
//   SharedCheckbox (single)
// ----------------------------------------------
type SharedCheckboxProps = {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
  name?: string;
};

export const SharedCheckbox = forwardRef<HTMLInputElement, SharedCheckboxProps>(
  (
    {
      label,
      checked = false,
      disabled = false,
      id,
      onChange,
      className = "",
      "aria-label": ariaLabel,
      "data-testid": testId,
      name,
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = useState(checked);
    const generatedId = useId();
    const inputId = id || generatedId;

    useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    const handleChange = () => {
      const newVal = !isChecked;
      setIsChecked(newVal);
      onChange?.(newVal);
    };

    return (
      <div className={`form-check ${className}`}>
        <input
          type="checkbox"
          id={inputId}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="form-check-input"
          aria-label={ariaLabel || label}
          data-testid={testId}
          ref={ref}
          name={name}
        />
        {label && (
          <label htmlFor={inputId} className="form-check-label">
            {label}
          </label>
        )}
      </div>
    );
  }
);
SharedCheckbox.displayName = "SharedCheckbox";

// ----------------------------------------------
//   SharedCheckboxGroup (multi)
// ----------------------------------------------
type CheckboxOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SharedCheckboxGroupProps = {
  options: CheckboxOption[];
  selectedValues?: string[];
  onChange?: (values: string[]) => void;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
};

export const SharedCheckboxGroup: React.FC<SharedCheckboxGroupProps> = ({
  options,
  selectedValues = [],
  onChange,
  className = "",
  "aria-label": ariaLabel,
  "data-testid": testId,
}) => {
  const [selected, setSelected] = useState<string[]>(selectedValues);

  useEffect(() => {
    if (
      selectedValues.length !== selected.length ||
      !selectedValues.every((v) => selected.includes(v))
    ) {
      setSelected(selectedValues);
    }
  }, [selectedValues]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const updated = checked
      ? [...selected, value]
      : selected.filter((v) => v !== value);
    setSelected(updated);
    onChange?.(updated);
  };

  return (
    <div className={className} aria-label={ariaLabel} data-testid={testId}>
      {options.map((option) => (
        <SharedCheckbox
          key={option.value}
          label={option.label}
          checked={selected.includes(option.value)}
          disabled={option.disabled}
          onChange={(checked) => handleCheckboxChange(option.value, checked)}
        />
      ))}
    </div>
  );
};

// ----------------------------------------------
//  VariationCheckbox
// ----------------------------------------------

type VariationCheckboxItem = {
  id: number;
  color: string;
  labelText: string;
  check?: boolean;
};

type VariationCheckboxProps = {
  data: VariationCheckboxItem[];
  onChange?: (id: number, checked: boolean) => void;
};

export const VariationCheckbox: React.FC<VariationCheckboxProps> = ({
  data,
  onChange,
}) => {
  const renderCheckbox = useCallback(
    ({ id, color, labelText, check }: VariationCheckboxItem) => (
      <div className="payment-wrapper" key={id}>
        <SharedCheckbox
          id={`check-${id}`}
          label={labelText}
          checked={check}
          className={`checkbox checkbox-${color}`}
          onChange={(checked) => onChange?.(id, checked)}
        />
      </div>
    ),
    [onChange]
  );

  return (
    <Col sm="12">
      <Card>
        <CardBody>
          <Row className="g-3">
            <Col xl="4" md="5">
              <div className="card-wrapper border rounded-3 h-100 checkbox-checked">
                <h6 className="sub-title">{ChooseActivities}</h6>
                {data.map(renderCheckbox)}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};
