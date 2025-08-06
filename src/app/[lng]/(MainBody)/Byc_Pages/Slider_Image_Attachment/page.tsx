"use client";

import React, { useEffect, useRef, useState } from "react";
import { CardBody, Card, Col, Row } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedButton from "@/Shared/Components/SharedButton";
import SortableFileTable from "@/Shared/Components/FileTable";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  getMobileRequest,
  postMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import { useTranslation } from "@/app/i18n/client";

const SliderImageAttachment = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState({
    selectedFiles: [] as { file: File; Link: string }[],
    isDraggingOver: false,
    isLoading: false,
    isUploading: false,
  });

  const updateState = (partial: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...partial }));

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
    updateState({ isLoading: true });
    const response = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.CarouselImages.get,
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

    updateState({ selectedFiles: filesFromApi, isLoading: false });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    updateState({ isDraggingOver: false });

    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      const filesWithLink = files.map((file) => ({ file, Link: "" }));
      updateState({
        selectedFiles: [...state.selectedFiles, ...filesWithLink],
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      const filesWithLink = files.map((file) => ({ file, Link: "" }));
      updateState({
        selectedFiles: [...state.selectedFiles, ...filesWithLink],
      });
    }
    e.target.value = "";
  };

  const handleUpload = async () => {
    updateState({ isUploading: true });
    const formData = new FormData();
    state.selectedFiles.forEach(({ file, Link }) => {
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
    updateState({ isUploading: false });
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
      title: t("Drag"),
      style: { width: "50px", textAlign: "center" },
    },
    { key: "image", title: t("Image") ?? "Image" },
    { key: "link", title: t("Image Link") ?? "Image Link" },
    { key: "name", title: t("File Name") ?? "File Name" },
    {
      key: "actions",
      title: t("Actions"),
    },
  ];

  return (
    <Col xs="12">
      <Card style={{ flex: 1, overflow: "hidden" }}>
        <CommonCardHeader title={t("Image Attachments")} />
        <CardBody
          onDragOver={(e) => {
            e.preventDefault();
            updateState({ isDraggingOver: true });
          }}
          onDragLeave={() => updateState({ isDraggingOver: false })}
          onDrop={handleDropFiles}
          className="flex-grow-1"
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            borderRadius: "8px",
            padding: "20px",
            transition: "border 0.3s",
            backgroundColor: state.isDraggingOver ? "#f9f9f9" : "transparent",
          }}
        >
          {state.isLoading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              {t("Loading images...")}
            </div>
          ) : state.selectedFiles.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              {t(
                "Drag & drop images here, or click 'Open Files' button to select images, or wait for API to load images."
              )}
            </p>
          ) : (
            <SortableFileTable
              files={state.selectedFiles}
              onChange={(newFiles) => updateState({ selectedFiles: newFiles })}
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
        <Row className="m-3 justify-content-end" style={{ flexShrink: 0 }}>
          <Col xs="auto" className="d-flex gap-2">
            <SharedButton
              color="secondary"
              title={t("Upload Files")}
              onClick={() => fileInputRef.current?.click()}
              disabled={state.isUploading}
            />
            <SharedButton
              color="primary"
              title={state.isUploading ? t("Uploading...") : t("Submit")}
              onClick={handleUpload}
              disabled={state.selectedFiles.length === 0 || state.isUploading}
            />
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default SliderImageAttachment;
