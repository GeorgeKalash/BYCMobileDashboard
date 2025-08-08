import { useFormikContext, useField } from "formik";
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
  value?: string | number | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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
      <input
        id={name}
        name={name}
        type={type}
        autoComplete="off"
        className={`form-control ${validationClass}`}
        placeholder={placeholder}
        readOnly={readOnly}
        min={min}
        dir={ar ? "rtl" : "ltr"}
        value={isControlled ? value ?? "" : field.value}
        onChange={isControlled ? onChange : field.onChange}
        onBlur={isControlled ? onBlur : field.onBlur}
      />
    </FormGroup>
  );
};

export default CustomInput;
