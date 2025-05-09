"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import { FormikProps } from "formik";
import CustomSelect from "@/Shared/Components/CustomSelect";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import formatDate from "@/utils/DateFormatter";
import RequestsForm from "./Form/RequestsForm";

const Requests = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventType, setEventType] = useState<1 | 2 | null>(1);
  const [totalRows, setTotalRows] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const formikRef = useRef<FormikProps<any>>(null);
  const pageSize = 30

  const fetchData = async (count = pageCount) => {
    if (eventType === null) return;

    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: `${DashboardMobileRepository.Requests.get}`,
          parameters: `_eventType=${eventType}&_startAt=${count}&_pageSize=${pageSize}`,
        })
      )
    );

    const rows = result?.payload?.data?.list;
    setTotalRows(result?.payload?.data?.count)
    setData(Array.isArray(rows) ? rows : []);
  };

  useEffect(() => {
    fetchData();
  }, [eventType, pageCount]);

  const handleModalOpen = (row: any, action: "edit") => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
    fetchData();
  };

  const columns = [
    {
      name: t("accountId"),
      selector: (row: any) => row.accountId?.toString() || "-",
      sortable: true,
      id: "accountId",
    },
    {
      name: t("clientId"),
      selector: (row: any) => row.clientId?.toString() || "-",
      sortable: true,
      id: "clientId",
    },
    {
      name: t("clockStamp"),
      selector: (row: any) => row.clockStamp,
      cell: (row: any) =>
        row.clockStamp ? formatDate(row.clockStamp, "dd/MM/yyyy HH:mm:ss") : "-",
      sortable: true,
      id: "clockStamp",
    },
    {
      name: t("recordId"),
      selector: (row: any) => row.recordId?.toString() || "-",
      sortable: true,
      id: "recordId",
    },
    {
      name: t("requestBody"),
      selector: (row: any) => row.requestBody?.toString() || "-",
      sortable: true,
      id: "requestBody",
    },
    {
      name: t("requestType"),
      selector: (row: any) => row.requestType?.toString() || "-",
      sortable: true,
      id: "requestType",
    },
    {
      name: t("url"),
      selector: (row: any) => row.url?.toString() || "-",
      sortable: true,
      id: "url",
    },
    {
      name: t("userId"),
      selector: (row: any) => row.userId?.toString() || "-",
      sortable: true,
      id: "userId",
    },
  ];

  const handleLanguageChange = (e: string | number | null) => {
    const num = Number(e);
    setEventType([1, 2].includes(num) ? (num as 1 | 2) : null);
  };

  const handlePageChange = (count: number) => {
    setPageCount(count);
    fetchData(count);
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Requests")}>
          <CustomSelect
            name="eventType"
            dataSetId={159}
            valueKey="key"
            labelKey="value"
            value={eventType ?? ""}
            onChange={handleLanguageChange}
          />
        </CommonCardHeader>
        <CardBody>
          <DataTable
            title="requests_table"
            data={data}
            columns={columns}
            pagination
            Search={true}
            serverPagination={true}
            showActions={true}
            onEdit={(row) => handleModalOpen(row, "edit")}
            onPageChange={handlePageChange}
            totalRows={totalRows}
            pageSize={pageSize}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalOpen}
        onClose={handleModalClose}
        title={ t("Read Request")}
        width="800px"
        height="80vh"
      >
        <RequestsForm
          rowData={selectedRow}
          formikRef={formikRef}
        />
      </SharedModal>
     
    </Col>
  );
};

export default Requests;
