"use client";

import React from "react";
import { Formik, Form, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomTextarea from "@/Shared/Components/CustomTextarea";
import { Col, Row } from "reactstrap";
import formatDate from "@/utils/DateFormatter";
import CustomSelect from "@/Shared/Components/CustomSelect";

const RequestsForm = ({
  rowData,
  formikRef,
}: {
  rowData: any;
  formikRef?: React.Ref<FormikProps<any>>;
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  const initialValues = {
    accountId: rowData?.accountId?.toString() || "",
    clientId: rowData?.clientId?.toString() || "",
    clockStamp: rowData?.clockStamp ? formatDate(rowData?.clockStamp, "dd/MM/yyyy HH:mm:ss") : "",
    curl: rowData?.curl || "",
    eventType: rowData?.eventType || "",
    recordId: rowData?.recordId || "",
    requestBody: rowData?.requestBody || "",
    requestType: rowData?.requestType || "",
    token: rowData?.token || "",
    url: rowData?.url || "",
    userId: rowData?.userId?.toString() || "",
  };

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}} innerRef={formikRef}>
      {(formik) => (
        <Form>
          <Row>
            <Col md={6}>
              <CustomInput name="accountId" label={t("accountId")} readOnly />
              <CustomInput name="clientId" label={t("clientId")} readOnly />
              <CustomSelect
                name="eventType"
                dataSetId={159}
                valueKey="key"
                labelKey="value"
                label={t("eventType")}
                value={formik.values.eventType}
                readOnly
              />
              <CustomInput name="recordId" label={t("recordId")} readOnly />
              <CustomTextarea name="token" label={t("token")} readOnly rows={3} />
              <CustomTextarea name="requestBody" label={t("requestBody")} readOnly rows={3} />
            </Col>
            <Col md={6}>
              <CustomInput name="userId" label={t("userId")} readOnly />
              <CustomInput name="requestType" label={t("requestType")} readOnly />
              <CustomInput name="url" label={t("url")} readOnly />
              <CustomInput name="clockStamp" label={t("clockStamp")} readOnly />
              <CustomTextarea name="curl" label={t("curl")} readOnly rows={8} />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default RequestsForm;
