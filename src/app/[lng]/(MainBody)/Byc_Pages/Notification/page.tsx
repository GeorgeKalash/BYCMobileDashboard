"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { FormikProps } from "formik";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { NotificationMobileRepository } from "@/Repositories/NotificationMobileRepository";
import NotificationForm from "./Form/NotificationForm";

const Notification = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit" | null>(null);
  const formikRef = useRef<FormikProps<any>>(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: t("ID"),
      selector: (row: any) => row.id,
      sortable: true,
    },
    {
      name: t("Message In English"),
      selector: (row: any) => row.message_en || "-",
      sortable: true,
    },
    {
      name: t("Message In Arabic"),
      selector: (row: any) => row.message_ar || "-",
      sortable: true,
    },
  ];

  const handleModalOpen = (row: any, action: "edit") => {
    setSelectedRow(row);
    setModalAction(action);
    setModalOpen(true);
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

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Notifications")} onAdd={onAdd}/>
        <CardBody>
          <DataTable
            title={t("New Message")}
            data={data}
            columns={columns}
            highlightOnHover
            pagination
            showActions={true}
            onEdit={(row) => handleModalOpen(row, "edit")}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalOpen}
        onClose={handleModalClose}
        title={modalAction === "add" ? t("Add Notification") : t("Edit Notification")}
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

export default Notification;
