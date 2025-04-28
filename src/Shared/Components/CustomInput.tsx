"use client";
import React from "react";
import { Field, ErrorMessage, useField } from "formik";
import { FormGroup, Label } from "reactstrap";

const CustomInput = ({
  name = "",
  label = "",
  type = "text",
  isRequired = false,
  placeholder = "",
  readOnly = false,
}) => {
  const [field, meta] = useField(name);

  const isEmpty = isRequired && !field.value;

  const validationClass = meta.touched
    ? meta.error || isEmpty
      ? "is-invalid" 
      : "is-valid"   
    : ""; 

  return (
    <FormGroup>
      <Label>
        {label} {isRequired && <span className="text-danger">*</span>}
      </Label>
      <Field
        type={type}
        autoComplete="off"
        className={`form-control ${validationClass}`}
        placeholder={placeholder}
        readOnly={readOnly}
        {...field} 
      />
      <ErrorMessage name={name} component="div" className="invalid-feedback" />
    </FormGroup>
  );
};

export default CustomInput;
