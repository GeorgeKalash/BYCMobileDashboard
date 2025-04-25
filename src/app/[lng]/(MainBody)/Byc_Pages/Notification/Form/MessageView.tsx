"use client";

import React from "react";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import { Col, Row } from "reactstrap";
import { Formik, Form } from "formik";

const MessageView = ({
  rowData,
  onSuccessSubmit,
}: {
  rowData: any;
  onSuccessSubmit?: () => void;
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  if (!rowData) return null;

  return (
    <Formik
      initialValues={{
        message_en: rowData.message_en || "",
        message_ar: rowData.message_ar || "",
      }}
      onSubmit={(values) => {
        console.log("Submitted values", values);
        onSuccessSubmit?.();
      }}
    >
      {() => (
        <Form>
          <Row>
            <Col md={12} className="mb-3">
              <CustomInput name="message_en" label={t("Message In English")} />
            </Col>
            <Col md={12}>
              <CustomInput name="message_ar" label={t("Message In Arabic")} />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default MessageView;
