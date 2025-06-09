"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col, Row, Form } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { Formik, FormikProps } from "formik";
import { NotificationAlertRepository } from "@/Repositories/NotificatioAlert";
import NotificationForm from "./Form/NotificationForm";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomSelect from "@/Shared/Components/CustomSelect";
import SharedButton from "@/Shared/Components/SharedButton";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { withRequestTracking } from "@/utils/withRequestTracking ";

const Notification_Alert = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const formikModalRef = useRef<FormikProps<any>>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const formikRef = useRef<FormikProps<any>>(null);
  const [selectedRow, setSelectedRow] = useState<any>({
    template: "",
  });

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handleSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("View Notification")} />
        <CardBody>
          <Formik
            initialValues={{
              idNumber: selectedRow?.idNumber || "",
              fullName: selectedRow?.fullName || "",
              mobile: selectedRow?.mobile || "",
              template: selectedRow?.template || "",
            }}
            enableReinitialize
            onSubmit={() => {}}
            innerRef={formikRef}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Row>
                  <Col md="4">
                    <CustomSelect
                      name="template"
                      label={t("Template")}
                      value={values.template}
                      onChange={(val) => setFieldValue("template", val)}
                      endpointId={
                        NotificationAlertRepository.NotificationTemplate.get
                      }
                      labelKey="name"
                      valueKey="recordId"
                      isRequired
                    />
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
          <div className="d-flex justify-content-end mb-3">
            <SharedButton
              title={t("Preview Template")}
              color="primary"
              size="sm"
              onClick={() => {
                setSelectedRow(() => ({
                  template: formikRef.current?.values.template,
                }));
                setModalOpen(true);
              }}
            />
          </div>
        </CardBody>
      </Card>

      <SharedModal
        visible={modalOpen}
        onClose={handleModalClose}
        title={t("Send Notification")}
        width="600px"
        height="60vh"
        onSubmit={() => formikModalRef.current?.submitForm()}
      >
        <NotificationForm
          templateId={formikRef.current?.values.template || null}
          formikRef={formikModalRef}
          onSuccessSubmit={handleModalClose}
        />{" "}
      </SharedModal>
    </Col>
  );
};

export default Notification_Alert;
