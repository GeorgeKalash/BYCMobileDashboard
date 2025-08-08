"use client";

import React, { useState } from "react";
import { FormGroup, Label } from "reactstrap";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";

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
  isRequired = false,
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
    <FormGroup>
      <Label htmlFor={name}>
        {label} {isRequired && <span className="text-danger">*</span>}
      </Label>
      <div
        id={name}
        className="form-control"
        style={{ cursor: "pointer", opacity: loading ? 0.6 : 1 }}
        dir={ar ? "rtl" : "ltr"}
        onClick={handleOpenPdf}
      >
        {loading ? t("Loading...") : fileName || t("No file selected")}
      </div>
    </FormGroup>
  );
};

export default CustomPdfDisplayInput;
