"use client";

import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import CustomInput from "./CustomInput";
import SharedButton from "./SharedButton";

type CustomPdfDisplayInputProps = {
  name: string;
  label?: string;
  isRequired?: boolean;
  fileName: string;
  clientId: number;
  extraRowId: number;
  ar?: boolean;
};

const CustomPdfDisplayInput: React.FC<CustomPdfDisplayInputProps> = ({
  name,
  label = "",
  fileName,
  clientId,
  extraRowId,
  ar = false,
}) => {
  const dispatch = useAppDispatch();
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const [loading, setLoading] = useState(false);

 const handleOpenPdf = async () => {
  if (loading) return;
  setLoading(true);
    const res = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.ExtraInfo.getPdf,
          parameters: `_clientId=${clientId}&_extraRowId=${extraRowId}`,
        })
      )
    );

    const base64Pdf = res?.payload?.data;

    const pdfDataUrl = base64Pdf.startsWith("data:application/pdf;base64,")
      ? base64Pdf
      : `data:application/pdf;base64,${base64Pdf}`;

    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe width='100%' height='100%' src='${pdfDataUrl}'></iframe>`
      );
      newWindow.document.title = fileName;
    } 
    setLoading(false);
};


  return (
    <Row>
      <Col xs="9">
        <CustomInput
          name={name}
          label={label}
          type="text"
          value={loading ? t("Loading...") : fileName || t("No file selected")}
          readOnly={!fileName}
        />
        </Col>
        <Col xs="3" style={{ marginTop: "23px"}}>
        <SharedButton
          title={ t("Preview") }
          onClick={() => handleOpenPdf()}
          disabled={!fileName}
          color="secondary"
        />
      </Col>
    </Row>
  );
};

export default CustomPdfDisplayInput;
