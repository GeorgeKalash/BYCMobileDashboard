"use client";

import React, { KeyboardEvent } from "react";
import { Formik, Form, FormikProps } from "formik";
import { Col, Row, Card, CardBody } from "reactstrap";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";

interface NotificationRowData {
  title?: string;
  body?: string;
}

interface NotificationFormProps {
  rowData: NotificationRowData | null;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
  modalAction: "add" | "edit" | null;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  rowData,
  formikRef,
  modalAction,
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  const isReadOnly = true;

  const initialValues = {
    title: rowData?.title || "",
    body: rowData?.body || "",
  };

  return (
    <Formik initialValues={initialValues} innerRef={formikRef}>
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
                    readOnly={isReadOnly}
                  />
                  <CustomInput
                    name="body"
                    label={t("Body")}
                    type="text"
                    readOnly={isReadOnly}
                  />
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
