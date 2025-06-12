"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "@/Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { FormikProps } from "formik";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { NotificationMobileRepository } from "@/Repositories/NotificationMobileRepository";
import NotificationForm from "./Form/NotificationForm";
import formatDate from "@/utils/DateFormatter";
import CustomDatePicker from "@/Shared/Components/CustomDatePicker";
const Notification = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);

  const [modalState, setModalState] = useState({
    open: false,
    action: null as "edit" | null,
    row: null as any,
  });

  const [paginationState, setPaginationState] = useState({
    pageCount: 0,
    totalRows: 0,
    searchTerm: "",
  });

  const [filterState, setFilterState] = useState({
    fromDate: "01-01-2025",
    toDate: "01-01-2026",
  });

  const pageSize = 100;

  const formikRef = useRef<FormikProps<any>>(null);

  const fetchData = async (page = paginationState.pageCount) => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: `${NotificationMobileRepository.Notification.getAll}`,
          parameters: `_fromDate=${filterState.fromDate}&_toDate=${filterState.toDate}&_startAt=${page}&_pageSize=${pageSize}`,
        })
      )
    );

    const list = result?.payload?.data?.list;
    const total = result?.payload?.data?.count;

    setData(Array.isArray(list) ? list : []);
    if (typeof total === "number") {
      setPaginationState((prev) => ({
        ...prev,
        totalRows: total,
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    paginationState.pageCount,
    // paginationState.searchTerm,
    filterState.fromDate,
    filterState.toDate,
  ]);

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
    setModalState({
      open: true,
      action,
      row,
    });
  };

  const handleModalClose = () => {
    setModalState({
      open: false,
      action: null,
      row: null,
    });
    fetchData();
  };

  const handlePageChange = (startAt: number) => {
    const newPage = Math.ceil(startAt / pageSize);
    setPaginationState((prev) => ({
      ...prev,
      pageCount: newPage,
    }));
  };

  const handleFromDateChange = (val: string) => {
    setFilterState((prev) => ({
      ...prev,
      fromDate: val,
    }));
  };

  const handleToDateChange = (val: string) => {
    setFilterState((prev) => ({
      ...prev,
      toDate: val,
    }));
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Notifications")}>
          <Row className="w-100">
            <Col>
              <CustomDatePicker
                name="fromDate"
                label={t("From Date")}
                value={filterState.fromDate}
                onChange={(val) => val && handleFromDateChange(val)}
              />
            </Col>
            <Col>
              <CustomDatePicker
                name="toDate"
                label={t("To Date")}
                value={filterState.toDate}
                onChange={(val) => val && handleToDateChange(val)}
              />
            </Col>
          </Row>
        </CommonCardHeader>
        <CardBody>
          <DataTable
            title={t("Notifications")}
            data={data}
            columns={columns}
            highlightOnHover
            pagination
            serverPagination
            totalRows={paginationState.totalRows}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showActions
            onEdit={(row) => handleModalOpen(row, "edit")}
            // Search={true}
            // searchType="server"
            // onSearchChange={(val) =>
            //   setPaginationState((prev) => ({
            //     ...prev,
            //     searchTerm: val,
            //     pageCount: 0,
            //   }))
            // }
            searchableColumns={["title", "body"]}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalState.open}
        onClose={handleModalClose}
        title={t("Notification")}
        width="600px"
        height="60vh"
      >
        <NotificationForm
          rowData={modalState.row}
          formikRef={formikRef}
          modalAction={modalState.action}
          onSuccessSubmit={handleModalClose}
        />
      </SharedModal>
    </Col>
  );
};

export default Notification;
