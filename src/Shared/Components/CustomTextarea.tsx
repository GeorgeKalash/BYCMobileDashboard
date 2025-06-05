import React from "react";
import { Field, ErrorMessage, useField } from "formik";
import { FormGroup, Label } from "reactstrap";

type CustomTextareaProps = {
  name: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  ar?: boolean;
};

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  name,
  label = "",
  isRequired = false,
  placeholder = "",
  readOnly = false,
  rows = 4,
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
        as="textarea"
        className={`form-control ${validationClass}`}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        {...field}
        dir={ar ? "rtl" : "ltr"}
      />
      <ErrorMessage name={name} component="div" className="invalid-feedback" />
    </FormGroup>
  );
};

export default CustomTextarea;
