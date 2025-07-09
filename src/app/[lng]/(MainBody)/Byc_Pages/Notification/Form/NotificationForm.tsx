"use client";

import React from "react";
import { Formik, Form, FormikProps } from "formik";
import { Col, Row, Card, CardBody } from "reactstrap";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomTextarea from "@/Shared/Components/CustomTextarea";
interface NotificationRowData {
  title?: string;
  body?: string;
}

interface NotificationFormProps {
  rowData: NotificationRowData | null;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
  modalAction: "edit" | null;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  rowData,
  formikRef,
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  const initialValues = {
    title: rowData?.title || "",
    body: rowData?.body || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      innerRef={formikRef}
      onSubmit={() => {}}
    >
      {() => (
        <Form>
          <Row className="gy-4">
            <Col>
              <Card className="h-100">
                <CardBody>
                  <CustomInput
                    name="title"
                    label={t("Title")}
                    type="text"
                    readOnly
                  />
                  <CustomTextarea name="body" label={t("Body")} readOnly />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default NotificationForm;
