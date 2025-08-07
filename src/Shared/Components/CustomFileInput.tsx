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
console.log(fileUrl)
  const getPdfDataUrl = () => {
    if (!fileUrl) return null;
    if (fileUrl.startsWith("data:application/pdf;base64,")) {
      return fileUrl;
    }
    return `data:application/pdf;base64,${fileUrl}`;
  };

  const handleOpenPdf = () => {
    const pdfUrl = getPdfDataUrl();
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <FormGroup>
      <Label htmlFor={name}>
        {label} {isRequired && <span className="text-danger">*</span>}
      </Label>
      <div
        id={name}
        className="form-control"
        style={{ cursor: fileUrl ? "pointer" : "not-allowed" }}
        dir={ar ? "rtl" : "ltr"}
        onClick={handleOpenPdf}
      >
        {fileName || "No file selected"}
      </div>
    </FormGroup>
  );
};

export default CustomPdfDisplayInput;
