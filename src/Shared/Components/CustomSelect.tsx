"use client";

import React from "react";
import { Field, ErrorMessage } from "formik";
import { FormGroup, Label } from "reactstrap";

type OptionType = {
  value: string | number;
  label: string;
};

interface CustomSelectProps {
  name?: string;
  label?: string;
  options: (OptionType | string | number)[];
  isRequired?: boolean;
  submitErrors?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  name = "",
  label = "",
  options = [],
  isRequired = false,
  submitErrors = "",
}) => {
  const validationClass =
    submitErrors === "invalid"
      ? "is-invalid"
      : submitErrors === "valid"
      ? "is-valid"
      : "";

  return (
    <FormGroup>
      <Label>
        {label} {isRequired && <span className="text-danger">*</span>}
      </Label>
      <Field
        as="select"
        name={name}
        className={`form-control form-select ${validationClass}`}
      >
        <option value="">Select {label}</option>
        {options.map((opt, i) => {
          if (
            typeof opt === "object" &&
            opt !== null &&
            "value" in opt &&
            "label" in opt
          ) {
            return (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            );
          }
          return (
            <option key={i} value={opt}>
              {opt}
            </option>
          );
        })}
      </Field>
      <ErrorMessage name={name} component="div" className="invalid-feedback" />
    </FormGroup>
  );
};

export default CustomSelect;
