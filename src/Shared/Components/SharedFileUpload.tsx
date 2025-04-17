import { Card, CardBody, Col, FormGroup, Row } from "reactstrap";
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
}

const CommonFileUpload: React.FC<CommonFileUploadProp> = ({
  maxFiles,
  multiple,
  body,
  title,
}) => {
  const BASE_URL = "https://www.myserver.com";
  const [extFiles, setExtFiles] = useState<ExtFile[]>([]);
  const [imageSrc, setImageSrc] = useState<File | string | undefined>(
    undefined
  );

  const updateFiles = (incomingFiles: ExtFile[]) => {
    if (multiple) {
      setExtFiles(incomingFiles);
    } else {
      // only keep the latest file if multiple is false
      const latestFile = incomingFiles[incomingFiles.length - 1];
      setExtFiles(latestFile ? [latestFile] : []);
    }
  };

  const onDelete = (id: FileMosaicProps["id"]) => {
    setExtFiles(extFiles.filter((x) => x.id !== id));
  };
  const handleSee = (imageSource: File | string | undefined) =>
    setImageSrc(imageSource);
  const handleAbort = (id: FileMosaicProps["id"]) => {
    setExtFiles(
      extFiles.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: "aborted" };
        } else return { ...ef };
      })
    );
  };
  const handleCancel = (id: FileMosaicProps["id"]) => {
    setExtFiles(
      extFiles.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: undefined };
        } else return { ...ef };
      })
    );
  };
  return (
    <Col sm="12">
      <Card>
        <CardBody>
          <h6 className="sub-title mb-3">{title}</h6>
          <Dropzone
            onChange={updateFiles}
            value={extFiles}
            maxFiles={maxFiles}
            multiple={multiple}
            uploadConfig={{ url: BASE_URL + "/file" }}
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
