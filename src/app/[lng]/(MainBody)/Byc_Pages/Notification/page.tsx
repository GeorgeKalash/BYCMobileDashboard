"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
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
import formatDate from "@/utils/DateFormatter";
// import CustomDatePicker from "@/Shared/Components/CustomDatePicker";

const Notification = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit" | null>(null);
  const formikRef = useRef<FormikProps<any>>(null);

  const [fromDate, setFromDate] = useState("01-01-2025");
  const [toDate, setToDate] = useState("01-01-2026");

  const [pageSize] = useState(100);
  const [pageCount, setPageCount] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (page = pageCount) => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: `${NotificationMobileRepository.Notification.getAll}`,
          parameters: `_fromDate=${fromDate}&_toDate=${toDate}&_startAt=${page}&_pageSize=${pageSize}&_title=${searchTerm}&_body=${searchTerm}`,
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
    fetchData(0);
  }, [fromDate, toDate]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(0);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const columns = [
    {
      name: t("Client Name"),
      selector: (row: any) => row.clientName || "-",
      sortable: true,
    },

    {
      name: t("Client Number"),
      selector: (row: any) => row.cellPhone || "-",
      sortable: true,
    },
    {
      name: t("Template Name"),
      selector: (row: any) => row.templateName || "-",
      sortable: true,
    },

    {
      name: t("Language"),
      selector: (row: any) => row.languageName || "-",
      sortable: true,
    },
    {
      name: t("Date"),
      selector: (row: any) =>
        row.date ? formatDate(row.date, "dd/MM/yyyy") : "-",
      sortable: true,
    },

    {
      name: t("Is Read"),
      selector: (row: any) => (row.isRead ? t("Yes") : t("No")),
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

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Notifications")}>
          {/* <Row className="w-100">
            <Col>
              <CustomDatePicker
                name="fromDate"
                label={t("From Date")}
                value={fromDate}
                onChange={(val) => val && setFromDate(val)}
              />
            </Col>
            <Col>
              <CustomDatePicker
                name="toDate"
                label={t("To Date")}
                value={toDate}
                onChange={(val) => val && setToDate(val)}
              />
            </Col>
          </Row> */}
        </CommonCardHeader>
        <CardBody>
          <DataTable
            title={t("Notifications")}
            data={data}
            columns={columns}
            highlightOnHover
            pagination
            serverPagination
            totalRows={totalRows}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showActions
            onEdit={(row) => handleModalOpen(row, "edit")}
            Search={true}
            // searchType="server"
            // onSearchChange={(val) => setSearchTerm(val)}
            searchableColumns={["title", "body"]}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalOpen}
        onClose={handleModalClose}
        title={t(" Notification")}
        width="600px"
        height="60vh"
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
