import React from "react";
import { Field, ErrorMessage, useField } from "formik";
import { FormGroup, Label } from "reactstrap";

type CustomInputProps = {
  name: string;
  label?: string;
  type?: string;
  isRequired?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  min?: number | string;
  ar?: boolean;
};

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  label = "",
  type = "text",
  isRequired = false,
  placeholder = "",
  readOnly = false,
  min,
  ar = false,
}) => {
  const [field, meta] = useField(name);

  const isEmpty = isRequired && !field.value;

  const validationClass = meta.touched
    ? meta.error || isEmpty
      ? "is-invalid"
      : ""
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
        min={min}
        dir={ar ? "rtl" : "ltr"}
        {...field}
      />
      <ErrorMessage name={name} component="div" className="invalid-feedback" />
    </FormGroup>
  );
};

export default CustomInput;
