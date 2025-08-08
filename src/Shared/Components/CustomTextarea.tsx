import React from "react";
import { useField, useFormikContext } from "formik";
import { FormGroup, Label } from "reactstrap";

type CustomTextareaProps = {
  name: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  ar?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
};

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  name,
  label = "",
  isRequired = false,
  placeholder = "",
  readOnly = false,
  rows = 4,
  ar = false,
  value,
  onChange,
  onBlur,
}) => {
  const formik = useFormikContext();
  const isControlled =
    typeof value !== "undefined" || typeof onChange !== "undefined";

  const [field, meta] = isControlled
    ? [{ name, value, onChange, onBlur }, {}]
    : useField(name);

  const isEmpty = isRequired && !(isControlled ? value : field.value);
  const validationClass =
    formik && meta.touched ? (meta.error || isEmpty ? "is-invalid" : "") : "";

  return (
    <FormGroup>
      <Label htmlFor={name}>
        {label} {isRequired && <span className="text-danger">*</span>}
      </Label>
      <textarea
        id={name}
        name={name}
        className={`form-control ${validationClass}`}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        dir={ar ? "rtl" : "ltr"}
        value={isControlled ? value ?? "" : field.value}
        onChange={isControlled ? onChange : field.onChange}
        onBlur={isControlled ? onBlur : field.onBlur}
      />
    </FormGroup>
  );
};

export default CustomTextarea;
