"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col, Row, Form } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { Formik, FormikProps } from "formik";
import NotificationForm from "./Form/NotificationForm";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomSelect from "@/Shared/Components/CustomSelect";
import SharedButton from "@/Shared/Components/SharedButton";

const Notification_Alert = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>({
    idNumber: "123456789",
    fullName: "John Doe",
    mobile: "0555555555",
    nationality: "1",
    sponsors: ["2"],
  }); // Example fallback data to prevent errors

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit" | null>(null);
  const formikRef = useRef<FormikProps<any>>(null);

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setModalAction(null);
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
              nationality: selectedRow?.nationality || "",
              sponsors: selectedRow?.sponsors || [],
            }}
            enableReinitialize
            onSubmit={() => {}}
          >
            {() => (
              <Form>
                <Row>
                  <Col md="4">
                    <CustomInput name="idNumber" label="ID Number" readOnly />
                  </Col>
                  <Col md="4">
                    <CustomInput name="fullName" label="Full Name" readOnly />
                  </Col>
                  <Col md="4">
                    <CustomInput name="mobile" label="Mobile Number" readOnly />
                  </Col>
                  <Col md="4">
                    <CustomSelect
                      name="nationality"
                      label="Nationality"
                      endpointId="nationalities"
                      labelKey="label"
                      valueKey="value"
                    />
                  </Col>
                  <Col md="4">
                    <CustomSelect
                      name="sponsors"
                      label="Sponsor"
                      endpointId="sponsors"
                      labelKey="label"
                      valueKey="value"
                    />
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
          <div className="d-flex justify-content-end mb-3">
            <SharedButton
              title={t("Create Notification")}
              color="primary"
              size="sm"
              onClick={() => {
                setSelectedRow(null);
                setModalAction("add");
                setModalOpen(true);
              }}
            />
          </div>
        </CardBody>
      </Card>

      <SharedModal
        visible={modalOpen}
        onClose={handleModalClose}
        title={
          modalAction === "add" ? t("Add Notification") : t("Edit Notification")
        }
        width="600px"
        height="60vh"
        onSubmit={handleSubmit}
      >
        <NotificationForm
          rowData={selectedRow}
          formikRef={formikRef}
          modalAction={modalAction}
          onSuccessSubmit={handleModalClose}
        />
      </SharedModal>
    </Col>
  );
};

export default Notification_Alert;
