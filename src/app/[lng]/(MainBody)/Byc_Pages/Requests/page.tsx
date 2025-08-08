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
import { withRequestTracking } from "@/utils/withRequestTracking";

import formatDate from "@/utils/DateFormatter";
import RequestsForm from "./Form/RequestsForm";

const Requests = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [paginationState, setPaginationState] = useState({
    pageCount: 0,       
    totalRows: 0,
    searchTerm: "",
    eventType: 1 as 1 | 2 | null,
  });

  const [data, setData] = useState<any[]>([]);
  const [modalState, setModalState] = useState({
    open: false,
    row: null as any,
  });

  const formikRef = useRef<FormikProps<any>>(null);
  const pageSize = 30;

  const fetchData = async () => {
    const { pageCount, searchTerm, eventType } = paginationState;
    if (eventType === null) return;

    const startAt = pageCount + 1;

    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.Requests.get,
          parameters: `_eventType=${eventType}&_startAt=${startAt}&_pageSize=${pageSize}&_search=${encodeURIComponent(searchTerm)}`,
        })
      )
    );

    const rows = result?.payload?.data?.list;
    const total = result?.payload?.data?.count;

    setData(Array.isArray(rows) ? rows : []);
    if (typeof total === "number") {
      setPaginationState((prev) => ({ ...prev, totalRows: total }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationState.pageCount, paginationState.searchTerm, paginationState.eventType]);

  const columns = [
    {
      name: t("accountId"),
      selector: (row: any) => row.accountId?.toString() || "",
      sortable: true,
      id: "accountId",
      width: "120px",
    },
    {
      name: t("clientId"),
      selector: (row: any) => row.clientId?.toString() || "",
      sortable: true,
      id: "clientId",
      width: "130px",
    },
    {
      name: t("clockStamp"),
      selector: (row: any) => row.clockStamp,
      cell: (row: any) =>
        row.clockStamp ? formatDate(row.clockStamp, "dd/MM/yyyy HH:mm:ss") : "",
      sortable: true,
      id: "clockStamp",
    },
    {
      name: t("recordId"),
      selector: (row: any) => row.recordId?.toString() || "",
      sortable: true,
      id: "recordId",
      width: "130px",
    },
    {
      name: t("requestBody"),
      selector: (row: any) => row.requestBody?.toString() || "",
      sortable: true,
      id: "requestBody",
    },
    {
      name: t("requestType"),
      selector: (row: any) => row.requestType?.toString() || "",
      sortable: true,
      id: "requestType",
      width: "130px",
    },
    {
      name: t("url"),
      selector: (row: any) => row.url?.toString() || "",
      sortable: true,
      id: "url",
    },
    {
      name: t("userId"),
      selector: (row: any) => row.userId?.toString() || "",
      sortable: true,
      id: "userId",
      width: "130px",
    },
  ];

  const handleEventChange = (val: string | number | null) => {
    const num = Number(val);
    setPaginationState((prev) => ({
      ...prev,
      eventType: [1, 2].includes(num) ? (num as 1 | 2) : null,
      pageCount: 0,
    }));
  };

  const handlePageChange = (startAt: number) => {
    const newPage = Math.floor(startAt / pageSize);
    setPaginationState((prev) => ({
      ...prev,
      pageCount: newPage,
    }));
  };

  const handleSearchChange = (val: string) => {
    setPaginationState((prev) => ({
      ...prev,
      searchTerm: val,
      pageCount: 0, 
    }));
  };

  const openModal = (row: any = null) => {
    setModalState({
      open: true,
      row,
    });
  };

  const handleModalClose = () => {
    setModalState({
      open: false,
      row: null,
    });
    fetchData();
  };

  const handleSubmit = () => {
    formikRef.current?.submitForm();
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Requests")}>
          <div style={{ minWidth: 250, maxWidth: 400, width: "100%" }}>
            <CustomSelect
              name="eventType"
              dataSetId={159}
              valueKey="key"
              labelKey="value"
              value={paginationState.eventType ?? ""}
              onChange={handleEventChange}
            />
          </div>
        </CommonCardHeader>
        <CardBody>
          <DataTable
            data={data}
            columns={columns}
            pagination
            serverPagination={true}
            totalRows={paginationState.totalRows}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            Search={true}
            searchType="server"
            searchableColumns={["requestBody", "url", "requestType"]}
            onSearchChange={handleSearchChange}
            showActions={true}
            onEdit={openModal}
          />
        </CardBody>
      </Card>

      <SharedModal
        visible={modalState.open}
        onClose={handleModalClose}
        title={t("Read Request")}
        width="800px"
        height="80vh"
        onSubmit={handleSubmit}
      >
        <RequestsForm rowData={modalState.row} formikRef={formikRef} />
      </SharedModal>
    </Col>
  );
};

export default Requests;
