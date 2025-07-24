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
import { withRequestTracking } from "@/utils/withRequestTracking";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import formatDate from "@/utils/DateFormatter";
import UsersForm from "./Forms/UsersForm";
import { PaymentGatewayRepository } from "@/Repositories/PaymentGatewayRepository";
import CustomDatePicker from "@/Shared/Components/CustomDatePicker";
import SharedButton from "@/Shared/Components/SharedButton";
import { format } from "date-fns";

const PaymentsHistoryPage = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const formikRef = useRef<FormikProps<any>>(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [modalState, setModalState] = useState({
    open: false,
    row: null as any,
  });

  const [paginationState, setPaginationState] = useState({
    pageCount: 0,
    totalRows: 0,
  });

  const pageSize = 30;

  const fetchData = async (page = 0) => {
    let query = `_startAt=${page}&_pageSize=${pageSize}`;

    if (filters.fromDate) {
      query += `&_fromTrxDate=${filters.fromDate}`;
    }
    if (filters.toDate) {
      query += `&_toTrxDate=${filters.toDate}`;
    }

    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: PaymentGatewayRepository.Transactions.GetAll,
          parameters: query,
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
    fetchData(paginationState.pageCount);
  }, [paginationState.pageCount]);

  const handlePageChange = (startAt: number) => {
    setPaginationState((prev) => ({
      ...prev,
      pageCount: startAt,
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
    fetchData(paginationState.pageCount);
  };

  const handleSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const columns = [
    {
      name: t("Client Name"),
      selector: (row: any) => row.clientName,
      sortable: true,
      id: "clientName",
    },
    {
      name: t("Phone Number"),
      selector: (row: any) => row.cellPhone,
      sortable: true,
      id: "cellPhone",
    },
    {
      name: t("Amount"),
      selector: (row: any) => `${(row.amount / 100).toFixed(2)} SAR`,
      sortable: true,
      id: "amount",
    },
    {
      name: t("Bank Name"),
      selector: (row: any) => row.bankName,
      sortable: true,
      id: "bankName",
    },
    {
      name: t("IBAN"),
      selector: (row: any) => row.iban,
      sortable: true,
      id: "iban",
    },
    {
      name: t("Payment Status"),
      selector: (row: any) =>
        row.paymentStatus === 1 ? t("Success") : t("Pending"),
      sortable: true,
      id: "paymentStatus",
    },
    {
      name: t("Gateway Type"),
      selector: (row: any) =>
        row.paymentGatewayType === 1
          ? "HyperPay"
          : row.paymentGatewayType === 2
          ? "Moyasar"
          : "Unknown",
      sortable: true,
      id: "paymentGatewayType",
    },
    {
      name: t("Transaction ID"),
      selector: (row: any) => row.transactionId ?? "",
      sortable: true,
      id: "transactionId",
    },
    {
      name: t("Transaction Date"),
      selector: (row: any) =>
        row.transactionDate
          ? formatDate(row.transactionDate, "dd/MM/yyyy")
          : "",
      sortable: true,
      id: "transactionDate",
    },
  ];

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Payments History")} />
        <Row className="w-100 px-3 py-2">
          <Col md="2">
            <CustomDatePicker
              name="fromDate"
              label={t("From Date")}
              value={filters.fromDate}
              onChange={(val) =>
                val && setFilters((prev) => ({ ...prev, fromDate: val }))
              }
            />
          </Col>
          <Col md="2">
            <CustomDatePicker
              name="toDate"
              label={t("To Date")}
              value={filters.toDate}
              onChange={(val) =>
                val && setFilters((prev) => ({ ...prev, toDate: val }))
              }
            />
          </Col>
          <Col md="2" className="d-flex align-items-center">
            <SharedButton title={t("Filter")} onClick={() => fetchData(0)} />
          </Col>
        </Row>
        <CardBody>
          <DataTable
            title={t("Payments History")}
            data={data}
            columns={columns}
            pagination
            serverPagination={true}
            totalRows={paginationState.totalRows}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showActions={true}
            onEdit={(row) => openModal(row)}
          />
        </CardBody>
      </Card>

      <SharedModal
        visible={modalState.open}
        onClose={handleModalClose}
        title={t("User")}
        width="30vw"
        height="70vh"
        onSubmit={handleSubmit}
      >
        {modalState.row && (
          <UsersForm
            userId={modalState.row.username.replace(/\+/g, "%2B")}
            formikRef={formikRef}
            onSuccessSubmit={handleModalClose}
          />
        )}
      </SharedModal>
    </Col>
  );
};

export default PaymentsHistoryPage;
