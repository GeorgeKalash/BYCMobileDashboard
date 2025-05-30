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
import { NotificationAlertRepository } from "@/Repositories/NotificationAlert";

import NotificationTemplateForm from "./Form/NotificationTemplateForm";

const NotificationTemplatePage = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<
    "add" | "edit" | "delete" | null
  >(null);
  const formikRef = useRef<FormikProps<any>>(null);

  const [fromDate, setFromDate] = useState("05-20-2025");
  const [toDate, setToDate] = useState("06-20-2025");

  const [pageSize] = useState(5);
  const [pageCount, setPageCount] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = async (page = pageCount) => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: NotificationAlertRepository.NotificationTemplate.getAll,
          parameters: `_fromDate=${fromDate}&_toDate=${toDate}&_startAt=${page}&_pageSize=${pageSize}`,
        })
      )
    );

    const list = result?.payload?.data?.list;
    const total = result?.payload?.data?.count;

    setData(Array.isArray(list) ? list : []);
    if (typeof total === "number") {
      setTotalRows(total);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageCount]);

  const columns = [
    {
      name: t("ID"),
      selector: (row: any) => row.recordId,
      sortable: true,
    },
    {
      name: t("Date"),
      selector: (row: any) => new Date(row.date).toLocaleString(),
      sortable: true,
    },
    {
      name: t("Title"),
      selector: (row: any) => row.title,
      sortable: true,
    },
    {
      name: t("Description"),
      selector: (row: any) => row.description,
      sortable: true,
    },
    {
      name: t("Type"),
      selector: (row: any) => row.type,
      sortable: true,
    },
    {
      name: t("Push Notification"),
      selector: (row: any) => (row.isPushNotification ? t("Yes") : t("No")),
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

  const handlePageChange = (startAt: number) => {
    const newPage = Math.ceil(startAt / pageSize);
    setPageCount(newPage);
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Notification Template")} onAdd={onAdd} />
        <CardBody>
          <DataTable
            title={t("New Message")}
            data={data}
            columns={columns}
            highlightOnHover
            pagination
            serverPagination={true}
            totalRows={totalRows}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showActions={true}
            onEdit={(row) => handleModalOpen(row, "edit")}
            onDelete={(row) => handleModalOpen(row, "delete")}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalOpen}
        onClose={handleModalClose}
        title={
          modalAction === "add"
            ? t("Add Notification Template")
            : modalAction === "edit"
            ? t("Edit Notification Template")
            : t("Delete Notification Template")
        }
        width="600px"
        height="60vh"
        onSubmit={handleSubmit}
      >
        <NotificationTemplateForm
          rowData={selectedRow}
          formikRef={formikRef}
          modalAction={modalAction}
          onSuccessSubmit={handleModalClose}
        />
      </SharedModal>
    </Col>
  );
};

export default NotificationTemplatePage;
