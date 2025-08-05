import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import { FormGroup, Label, Input } from "reactstrap";
import classNames from "classnames";

interface MultiValueInputProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}

const MultiValueInput: React.FC<MultiValueInputProps> = ({
  name,
  label,
  isRequired = false,
  placeholder = "",
  readOnly = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);
  const values: string[] = field.value || [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newItem = inputValue.trim();
      if (!values.includes(newItem)) {
        setFieldValue(name, [...values, newItem]);
      }
      setInputValue("");
    }
  };

  const handleRemove = (item: string) => {
    const newValues = values.filter((v) => v !== item);
    setFieldValue(name, newValues);
  };

  const isInvalid = meta.touched && meta.error;
  const validationClass = isInvalid ? "is-invalid" : "";

  return (
    <FormGroup>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label} {isRequired && <span className="text-danger">*</span>}
        </Label>
      )}

      <div
        className={classNames("form-control p-2", validationClass)}
        id={name}
        style={{
          minHeight: 30,
          maxHeight: 120,
          overflowY: "auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {values.map((item, index) => (
          <span
            key={index}
            className="badge bg-primary d-flex align-items-center px-2 py-1"
          >
            {item}
            {!readOnly && (
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                aria-label="Remove"
                onClick={() => handleRemove(item)}
                style={{ fontSize: 10 }}
              />
            )}
          </span>
        ))}

        {!readOnly && (
          <input
            type="text"
            className="border-0 bg-transparent"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              minWidth: 120,
              outline: "none",
              flex: "1 0 auto",
            }}
            disabled={readOnly}
          />
        )}
      </div>

      {isInvalid && (
        <div className="invalid-feedback d-block">{meta.error}</div>
      )}
    </FormGroup>
  );
};

export default MultiValueInput;
