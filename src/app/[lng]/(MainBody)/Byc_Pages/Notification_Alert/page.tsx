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
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import {
  getMobileRequest,
  postMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import DataTableComponent from "@/Shared/Components/DataTable";
import CustomDatePicker from "@/Shared/Components/CustomDatePicker";
import MultiValueInput from "@/Shared/Components/MultiValueInput";

const Notification_Alert = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const formikModalRef = useRef<FormikProps<any>>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const formikRef = useRef<FormikProps<any>>(null);
  const [selectedRow, setSelectedRow] = useState<any>({
    template: "",
  });
  const [templateSelected, setTemplateSelected] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [paginationState, setPaginationState] = useState({
    pageCount: 0,
    totalRows: 0,
  });
  const pageSize = 20;

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handleSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };
  const filters = {
    username:
      selectedUser?.username || formikRef.current?.values.mobile || null,
    nationalityId: formikRef.current?.values.country || null,
    idNo: formikRef.current?.values.idNumber || null,
    notificationGroupId: formikRef.current?.values.group || null,
    fromBirthDate: formikRef.current?.values.fromBirthDate
      ? new Date(formikRef.current?.values.fromBirthDate).toISOString()
      : null,
    toBirthDate: formikRef.current?.values.toBirthDate
      ? new Date(formikRef.current?.values.toBirthDate).toISOString()
      : null,
    sponsors:
      formikRef.current?.values.sponsors?.length > 0
        ? formikRef.current?.values.sponsors
        : null,
    cityId: null,
    street: null,
    lastLogin: null,
  };

  const fetchData = async (page = 0) => {
    const values = formikRef.current?.values;
    const payload = {
      startAt: page,
      pageSize: pageSize,
      filters: {
        fromBirthDate: values?.fromBirthDate
          ? new Date(values.fromBirthDate).toISOString()
          : null,
        toBirthDate: values?.toBirthDate
          ? new Date(values.toBirthDate).toISOString()
          : null,
        username: values?.mobile || null,
        nationalityId: values?.country?.toString() || null,
        idNo: values?.idNumber || null,
        sponsors: values?.sponsors?.length ? values.sponsors : null,
        cityId: null,
        street: null,
        lastLogin: null,
      },
    };
    const result = await dispatch(
      postMobileRequest({
        extension: DashboardMobileRepository.MobileUser.SearchEngine,
        body: payload,
        rawBody: true,
      })
    ).unwrap();

    const list = result?.data;
    setData(Array.isArray(list) ? list : []);
    setPaginationState((prev) => ({
      ...prev,
      totalRows: Array.isArray(list) ? list.length : 0,
    }));
  };
  const fetchDataByGroup = async (groupId: number) => {
    try {
      const result = await dispatch(
        getMobileRequest({
          extension: NotificationAlertRepository.NotificationGroup.getpack,
          parameters: `_recordId=${groupId}`,
        })
      ).unwrap();

      const clients = result?.data?.clients || [];

      const formattedData = clients.map((client: any) => ({
        clientMaster: {
          name: client?.name ?? "",
          cellPhone: client?.username ?? "",
          nationalityName: client?.nationality ?? "",
        },
        clientRemittance: {
          idNo: client?.idNo ?? "",
        },
      }));

      setData(formattedData);
      setPaginationState((prev) => ({
        ...prev,
        totalRows: formattedData.length,
      }));
    } catch (error) {
      console.error("Error fetching group data:", error);
      setData([]);
    }
  };

  const columns = [
    {
      name: t("Name"),
      selector: (row: any) => row.clientMaster?.name ?? "",
      sortable: true,
      id: "name",
    },
    {
      name: t("PhoneNumber"),
      selector: (row: any) => row.clientMaster?.cellPhone ?? "",
      sortable: true,
      id: "phone",
    },
    {
      name: t("Nationality"),
      selector: (row: any) => row.clientMaster?.nationalityName ?? "",
      sortable: true,
      id: "nationality",
    },
    {
      name: t("ID Number"),
      selector: (row: any) => row.clientRemittance?.idNo ?? "",
      sortable: true,
      id: "idNo",
    },
  ];
  useEffect(() => {
    if (formikRef.current) {
      fetchData(paginationState.pageCount);
    }
  }, [paginationState.pageCount]);

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
              fromBirthDate: "",
              toBirthDate: "",
              sponsors: [],
            }}
            enableReinitialize
            onSubmit={() => {}}
            innerRef={formikRef}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Row className="align-items-end">
                  <Col md="3">
                    <CustomDatePicker
                      name="fromBirthDate"
                      label={t("From Birth Date")}
                      value={values.fromBirthDate}
                      onChange={(val) => setFieldValue("fromBirthDate", val)}
                    />
                  </Col>

                  <Col md="3">
                    <CustomDatePicker
                      name="toBirthDate"
                      label={t("To Birth Date")}
                      value={values.toBirthDate}
                      onChange={(val) => setFieldValue("toBirthDate", val)}
                    />
                  </Col>

                  <Col md="3">
                    <CustomSelect
                      name="Nationality"
                      label={t("Nationality")}
                      value={values.country}
                      onChange={(val) => {
                        setFieldValue("country", val);
                      }}
                      endpointId={DashboardMobileRepository.country.getall}
                      labelKey="name"
                      valueKey="recordId"
                      isRequired={true}
                    />
                  </Col>
                  <Col md="3">
                    <CustomInput
                      name="mobile"
                      label={t("Phone Number")}
                      placeholder={t("Search by phone")}
                      value={values.mobile}
                      onChange={(e) => {
                        setFieldValue("mobile", e.target.value);
                      }}
                    />
                  </Col>

                  <Col md="3">
                    <CustomInput
                      name="idNumber"
                      label={t("ID Number")}
                      placeholder={t("Search by ID")}
                      value={values.idNumber}
                      onChange={(e) =>
                        setFieldValue("idNumber", e.target.value)
                      }
                    />
                  </Col>
                  <Col md="3">
                    <MultiValueInput
                      name="sponsors"
                      label={t("Sponsor Name")}
                      placeholder={t("Enter Sponsor Name")}
                    />
                  </Col>

                  <Col
                    md="3"
                    className="d-flex justify-content-end align-items-end"
                  >
                    <SharedButton
                      title={t("Filter")}
                      onClick={() => {
                        formikRef.current?.setFieldValue("group", "");
                        fetchData(0);
                      }}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md="3">
                    <CustomSelect
                      name="Group"
                      label={t("Group")}
                      value={values.group}
                      onChange={async (val) => {
                        if (val && !isNaN(Number(val))) {
                          setFieldValue("group", val);
                          setFieldValue("mobile", "");
                          setFieldValue("idNumber", "");
                          setFieldValue("country", "");
                          await fetchDataByGroup(Number(val));
                        }
                      }}
                      endpointId={
                        NotificationAlertRepository.NotificationGroup.getAll
                      }
                      labelKey="name"
                      valueKey="recordId"
                      isRequired
                    />
                  </Col>
                </Row>
                <Row className="align-items-end mb-2">
                  <Col md="3">
                    <CustomSelect
                      name="template"
                      label={t("Template")}
                      value={values.template}
                      onChange={(val) => {
                        setFieldValue("template", val);
                        setTemplateSelected(!!val);
                      }}
                      endpointId={
                        NotificationAlertRepository.NotificationTemplate.get
                      }
                      labelKey="name"
                      valueKey="recordId"
                      isRequired
                    />
                  </Col>
                  <Col
                    md="12"
                    className="d-flex justify-content-end align-items-end"
                  >
                    <SharedButton
                      title={t("Next")}
                      color="primary"
                      size="sm"
                      disabled={!templateSelected}
                      onClick={() => {
                        setSelectedRow(() => ({
                          template: formikRef.current?.values.template,
                        }));
                        setModalOpen(true);
                      }}
                    />
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>

          <DataTableComponent
            data={data}
            columns={columns}
            pagination
            serverPagination
            totalRows={paginationState.totalRows}
            pageSize={pageSize}
            onPageChange={(page) => {
              setPaginationState((prev) => ({
                ...prev,
                pageCount: page,
              }));
              fetchData(page);
            }}
          />
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
          filters={filters}
        />
      </SharedModal>
    </Col>
  );
};

export default Notification_Alert;
