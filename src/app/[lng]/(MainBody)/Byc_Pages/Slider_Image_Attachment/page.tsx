"use client";

import React, { useState } from "react";
import { CardBody, Card, Col } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import CommonFileUpload from "@/Shared/Components/SharedFileUpload";
import { SystemMobileRepository } from "@/Repositories/SystemMobileRepository";
import { useAppDispatch } from "@/Redux/Hooks";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import SharedButton from "@/Shared/Components/SharedButton";

const SliderImageAttachment = () => {
  const dispatch = useAppDispatch();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleUpload = async () => {
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      await withRequestTracking(dispatch, () =>
        dispatch(
          postMobileRequest({
            extension: SystemMobileRepository.CarouselImages.add,
            body: formData,
            rawBody: true,
          })
        ).unwrap()
      );
    }
    setSelectedFiles([]);
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title="Slider Image Attachments" />
        <CardBody>
          <CommonFileUpload
            multiple
            onChange={(files) => setSelectedFiles(files)}
          />
          <SharedButton
            color="primary"
            title="Submit"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default SliderImageAttachment;
