"use client";

import React, { useState, useEffect, useRef } from "react";
import { CardBody, Card, Col, Row } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedButton from "@/Shared/Components/SharedButton";
import SortableFileTable from "@/Shared/Components/FileTable";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { useAppDispatch } from "@/Redux/Hooks";
import {
  getMobileRequest,
  postMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";

const SliderImageAttachment = () => {
  const [selectedFiles, setSelectedFiles] = useState<
    { file: File; Link: string }[]
  >([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const base64ToFile = (
    base64String: string,
    filename: string,
    mimeType = "image/png"
  ): File => {
    const byteString = atob(base64String);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  };

  const fetchImages = async () => {
    setIsLoading(true);
    const response = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.CarouselImages.get,
          parameters: "",
        })
      )
    );

    const list = response?.payload?.data || [];

    const filesFromApi = list.map(
      (
        item: { image: string; directLink: string },
        index: number
      ): { file: File; Link: string } => {
        const file = base64ToFile(item.image, `image_api_${index + 1}.png`);
        return { file, Link: item.directLink };
      }
    );

    setSelectedFiles(filesFromApi);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const files = Array.from(e.dataTransfer.files) as File[];

    if (files.length > 0) {
      const filesWithLink = files.map((file) => ({
        file,
        Link: "",
      }));

      setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithLink]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];

    if (files.length > 0) {
      const filesWithLink = files.map((file) => ({
        file,
        Link: "",
      }));

      setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithLink]);
    }

    e.target.value = "";
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(({ file, Link }) => {
      formData.append("_files", file);
      formData.append("_directLinks", Link);
    });

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: DashboardMobileRepository.CarouselImages.add,
          body: formData,
          rawBody: false,
        })
      ).unwrap()
    );

    await fetchImages();
    setIsUploading(false);
  };
  type Column = {
    key: string;
    title: string;
    style?: React.CSSProperties;
  };

  const columns: Column[] = [
    { key: "index", title: t("Index") ?? "Index" },
    {
      key: "drag",
      title: t("Drag") ?? "Drag",
      style: { width: "50px", textAlign: "center" },
    },
    { key: "image", title: t("Image") ?? "Image" },
    { key: "link", title: t("Image Link") ?? "Image Link" },
    { key: "name", title: t("File Name") ?? "File Name" },
    {
      key: "actions",
      title: t("Actions") ?? "Actions",
      style: { width: "100px", textAlign: "center" },
    },
  ];

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Image Attachments")} />
        <Row className="gy-3">
          <CardBody
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDropFiles}
            style={{
              borderRadius: "8px",
              padding: "20px",
              transition: "border 0.3s",

              backgroundColor: isDraggingOver ? "#f9f9f9" : "transparent",
            }}
          >
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                {t("Loading images...")}
              </div>
            ) : selectedFiles.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                {t(
                  "Drag & drop images here, or click 'Open Files' button to select images, or wait for API to load images."
                )}
              </p>
            ) : (
              <SortableFileTable
                files={selectedFiles}
                onChange={setSelectedFiles}
                columns={columns}
              />
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </CardBody>
        </Row>
        <Row className="justify-content-end mb-3">
          <Col xs="auto" className="d-flex gap-2">
            <SharedButton
              color="secondary"
              title={t("Open Files")}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            />
            <SharedButton
              color="primary"
              title={isUploading ? t("Uploading...") : t("Submit")}
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
            />
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default SliderImageAttachment;
