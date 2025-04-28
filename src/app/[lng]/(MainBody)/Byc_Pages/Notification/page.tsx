"use client";

import React, { useEffect, useState, useRef } from "react";
import { CardBody, Card, Col } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import SharedModal from "@/Shared/Components/SharedModal";
import MessageView from "./Form/MessageView";
import MessageCreate from "./Form/MessageCreate";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { NotificationMobileRepository } from "@/Repositories/NotificationMobileRepository";

import { FormikProps } from "formik";
import SharedButton from "@/Shared/Components/SharedButton";
const Notification = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const formikRef = useRef<FormikProps<any>>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"edit" | "delete" | null>(
    null
  );

  const [data, setData] = useState<any[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const handleCreate = () => {
    setCreateModalOpen(true);
  };
  const handleCreateClose = () => {
    setCreateModalOpen(false);
  };
  const fetchData = async () => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: `${NotificationMobileRepository.Notification.get}`,
          parameters: "",
        })
      )
    );

    if (result?.payload?.data && Array.isArray(result.payload.data)) {
      setData(result.payload.data);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   const mockMessages = [
  //     {
  //       id: 1,
  //       message_en: "System update will occur at midnight.",
  //       message_ar: "سيتم تحديث النظام عند منتصف الليل.",
  //     },
  //     {
  //       id: 2,
  //       message_en: "New features have been released!",
  //       message_ar: "تم إصدار ميزات جديدة!",
  //     },
  //     {
  //       id: 3,
  //       message_en: "Reminder: Maintenance on Friday.",
  //       message_ar: "تذكير: صيانة يوم الجمعة.",
  //     },
  //   ];
  //   setData(mockMessages);
  // }, []);

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
  const handleModalOpen = (row: any, action: "edit" | "delete") => {
    setSelectedRow(row);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setModalAction(null);
  };

  const handleSubmit = () => {};

  const handleEdit = (row: any) => {
    handleModalOpen(row, "edit");
  };
  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Languages Page")} />
        <CardBody>
          <Col className="d-flex justify-content-end">
            <SharedButton
              title={t("Create New Message")}
              onClick={handleCreate}
              className="mb-3"
            />
          </Col>
          <DataTable
            title={t("New Message")}
            data={data}
            columns={columns}
            localStorageKey="notifications_table"
            highlightOnHover
            pagination
            showActions
            onEdit={handleEdit}
          />
        </CardBody>
      </Card>

      <SharedModal
        visible={createModalOpen}
        onClose={handleCreateClose}
        title={t("Create New Message")}
        width="900px"
        height="60vh"
        onSubmit={() => {
          if (formikRef.current) {
            formikRef.current.submitForm();
          }
        }}
      >
        <MessageCreate
          formikRef={formikRef}
          onSuccessSubmit={handleCreateClose}
        />
      </SharedModal>

      <SharedModal
        visible={modalOpen && modalAction === "edit"}
        onClose={handleModalClose}
        title={t("Edit Message")}
        width="600px"
        height="60vh"
        onSubmit={handleSubmit}
      >
        <MessageView rowData={selectedRow} />
      </SharedModal>
    </Col>
  );
};

export default Notification;
