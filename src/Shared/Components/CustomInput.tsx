"use client";
import React from "react";
import { Field, ErrorMessage } from "formik";
import { FormGroup, Label } from "reactstrap";

const CustomInput = ({
  name = "",
  label = "",
  type = "text",
  isRequired = false,
  placeholder = "",
  submitErrors = "",
}) => {
  const validationClass = submitErrors
    ? "is-invalid"
    : submitErrors
    ? "is-valid"
    : "";

  return (
    <FormGroup>
      <Label>
        {label} {isRequired && <span className="text-danger">*</span>}
      </Label>
      <Field
        name={name}
        type={type}
        className={`form-control ${validationClass}`}
        placeholder={placeholder}
      />
      <ErrorMessage name={name} component="div" className="invalid-feedback" />
    </FormGroup>
  );
};

export default CustomInput;
