"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import {
  getMobileRequest,
  deleteMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { FormikProps } from "formik";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { NotificationAlertRepository } from "@/Repositories/NotificationAlert";
import formatDate from "@/utils/DateFormatter";
import { showToast } from "@/Shared/Components/showToast";

import NotificationTemplateForm from "./Form/NotificationTemplateForm";

const NotificationTemplatePage = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit" | null>(null);
  const formikRef = useRef<FormikProps<any>>(null);
  const [pageSize] = useState(50);
  const [pageCount, setPageCount] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (page = pageCount) => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: NotificationAlertRepository.NotificationTemplate.getAll,
          parameters: `_fromDate=&_toDate=&_startAt=${page}&_pageSize=${pageSize}&_title=${searchTerm}&_description=${searchTerm}`,
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(0);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [pageCount]);

  const columns = [
    {
      name: t("Title"),
      selector: (row: any) => row.name,
      sortable: true,
    },

    {
      name: t("Date"),
      selector: (row: any) =>
        row.date ? formatDate(row.date, "dd/MM/yyyy") : "",
      sortable: true,
    },
    {
      name: t("Type"),
      selector: (row: any) => row.typeName,
      sortable: true,
    },
    {
      name: t("Push Notification"),
      selector: (row: any) => (row.isPushNotification ? t("Yes") : t("No")),
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

  const handlePageChange = (startAt: number) => {
    const newPage = Math.ceil(startAt / pageSize);
    setPageCount(newPage);
  };

  const handleDelete = async (row: any) => {
    if (!row?.recordId) return;

    try {
      await withRequestTracking(dispatch, () =>
        dispatch(
          deleteMobileRequest({
            extension: `${NotificationAlertRepository.NotificationTemplate.delete}?_recordId=${row.recordId}`,
            rawBody: false,
          })
        ).unwrap()
      );
      showToast("success", t("Deleted successfully"));
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", t("Failed to delete"));
    }
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader
          title={t("Notification Template")}
          onAdd={onAdd}
        ></CommonCardHeader>
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
            onDelete={handleDelete}
            Search={true}
            searchType="server"
            searchableColumns={["title", "description"]}
            onSearchChange={(val) => setSearchTerm(val)}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalOpen}
        onClose={handleModalClose}
        title={
          modalAction === "add"
            ? t("Add Notification Template")
            : t("Edit Notification Template")
        }
        width={"80vw"}
        height="70vh"
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
