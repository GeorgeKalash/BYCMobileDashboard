import { Card, CardBody, Col } from "reactstrap";
import {
  Dropzone,
  ExtFile,
  FileMosaic,
  FileMosaicProps,
  FullScreen,
  ImagePreview,
} from "@dropzone-ui/react";
import { useState } from "react";

interface CommonFileUploadProp {
  maxFiles?: number;
  multiple?: boolean;
  body?: boolean;
  title?: string;
  onChange?: (files: File[]) => void;
}

const CommonFileUpload: React.FC<CommonFileUploadProp> = ({
  maxFiles,
  multiple,
  body,
  title,
  onChange,
}) => {
  const [extFiles, setExtFiles] = useState<ExtFile[]>([]);
  const [imageSrc, setImageSrc] = useState<File | string | undefined>(
    undefined
  );

  const updateFiles = (incomingFiles: ExtFile[]) => {
    const filteredFiles = multiple ? incomingFiles : incomingFiles.slice(-1);
    setExtFiles(filteredFiles);

    // Convert ExtFile[] to File[] and pass to parent
    if (onChange) {
      const files = filteredFiles
        .map((f) => f.file)
        .filter((f): f is File => f !== undefined);
      onChange(files);
    }
  };

  const onDelete = (id: FileMosaicProps["id"]) => {
    const newFiles = extFiles.filter((x) => x.id !== id);
    setExtFiles(newFiles);
    if (onChange) {
      onChange(
        newFiles.map((f) => f.file).filter((f): f is File => f !== undefined)
      );
    }
  };

  const handleSee = (imageSource: File | string | undefined) =>
    setImageSrc(imageSource);

  const handleAbort = (id: FileMosaicProps["id"]) => {
    setExtFiles(
      extFiles.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: "aborted" };
        }
        return ef;
      })
    );
  };

  const handleCancel = (id: FileMosaicProps["id"]) => {
    setExtFiles(
      extFiles.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: undefined };
        }
        return ef;
      })
    );
  };

  return (
    <Col sm="12">
      <Card>
        <CardBody>
          {title && <h6 className="sub-title mb-3">{title}</h6>}
          <Dropzone
            onChange={updateFiles}
            value={extFiles}
            maxFiles={maxFiles}
            multiple={multiple}
            header={false}
            footer={false}
            minHeight={body ? "180px" : "80px"}
          >
            {extFiles.map((file) => (
              <FileMosaic
                {...file}
                key={file.id}
                onDelete={onDelete}
                onSee={handleSee}
                onAbort={handleAbort}
                onCancel={handleCancel}
                resultOnTooltip
                alwaysActive
                preview
              />
            ))}
            {extFiles.length === 0 && (
              <div className="dz-message needsclick">
                <i className="icon-cloud-up fs-1 txt-primary"></i>
                <h6 className="note needsclick">
                  (This is just a demo dropzone. Selected files are{" "}
                  <strong>not</strong> actually uploaded.)
                </h6>
              </div>
            )}
          </Dropzone>

          <FullScreen
            open={imageSrc !== undefined}
            onClose={() => setImageSrc(undefined)}
          >
            <ImagePreview src={imageSrc} />
          </FullScreen>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CommonFileUpload;
