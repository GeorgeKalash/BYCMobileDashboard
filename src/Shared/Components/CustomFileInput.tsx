import { FormGroup, Label } from "reactstrap";

type CustomPdfDisplayInputProps = {
  name: string;
  label?: string;
  isRequired?: boolean;
  fileName: string;
  fileUrl: string;
  ar?: boolean;
};

const CustomPdfDisplayInput: React.FC<CustomPdfDisplayInputProps> = ({
  name,
  label = "",
  isRequired = false,
  fileName,
  fileUrl,
  ar = false,
}) => {
  return (
    <FormGroup>
      <Label htmlFor={name}>
        {label} {isRequired && <span className="text-danger">*</span>}
      </Label>
      <div
        id={name}
        className="form-control"
        style={{ cursor: "pointer" }}
        dir={ar ? "rtl" : "ltr"}
        onClick={() => {
          window.open(fileUrl, "_blank");
        }}
      >
        {fileName || "No file selected"}
      </div>
    </FormGroup>
  );
};

export default CustomPdfDisplayInput;
