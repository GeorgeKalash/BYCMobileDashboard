"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col, Row, Button, Form, FormGroup } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { FormikProps, Formik } from "formik";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { NotificationMobileRepository } from "@/Repositories/NotificationMobileRepository";
import NotificationForm from "./Form/NotificationForm";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomSelect from "@/Shared/Components/CustomSelect";

const Notification_Alert = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit" | null>(null);
  const formikRef = useRef<FormikProps<any>>(null);

  const [nationalities, setNationalities] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);

  const fetchData = async () => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: `${NotificationMobileRepository.Notification.getAll}`,
          parameters: "",
        })
      )
    );

    const keyValuePairs = result?.payload?.data?.keyValuePairs;
    if (keyValuePairs && typeof keyValuePairs === "object") {
      const transformed = Object.entries(keyValuePairs).map(([key, value]) => ({
        key,
        value: String(value ?? ""),
      }));
      setData(transformed);
    } else {
      setData([]);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setModalAction(null);
    fetchData();
  };

  const handleSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const onAdd = () => {
    setSelectedRow(null);
    setModalAction("add");
    setModalOpen(true);
  };

  const handleFilterSubmit = (values: any) => {
    console.log("🔍 Filter Values:", values);
    // You can apply API filtering logic here
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Create Notification")} />
        <CardBody>
          <Formik
            initialValues={{
              idNumber: "",
              fullName: "",
              birthDateFrom: "",
              birthDateTo: "",
              mobile: "",
              nationality: "",
              sponsors: [],
            }}
            onSubmit={handleFilterSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="4">
                    <CustomInput name="idNumber" label="ID Number" />
                  </Col>
                  <Col md="4">
                    <CustomInput name="fullName" label="Full Name" />
                  </Col>
                  <Col md="4">
                    <CustomInput name="mobile" label="Mobile Number" />
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
