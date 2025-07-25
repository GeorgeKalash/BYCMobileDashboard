"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { withRequestTracking } from "@/utils/withRequestTracking";
import formatDate from "@/utils/DateFormatter";
import { PaymentGatewayRepository } from "@/Repositories/PaymentGatewayRepository";
import CustomDatePicker from "@/Shared/Components/CustomDatePicker";
import SharedButton from "@/Shared/Components/SharedButton";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomSelect from "@/Shared/Components/CustomSelect";
import { DashboardKVSRepository } from "@/Repositories/DashboardKVSRepository";

const PaymentsHistoryPage = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const reduxLangId = useAppSelector((state) => state.authSlice.languageId);
  const langId =
    reduxLangId || parseInt(localStorage.getItem("languageId") || "1", 10);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    paymentGatewayId: "",
    numberID: "",
  });

  const [data, setData] = useState<{ key: string; value: string }[]>([]);

  const parseBody = (body: string | null) => {
    return body ? JSON.parse(body) : {};
  };
  const [paginationState, setPaginationState] = useState({
    pageCount: 0,
    totalRows: 0,
  });

  const pageSize = 30;

  const fetchData = async (page = 0) => {
    const params = new URLSearchParams();
    params.append("_startAt", page.toString());
    params.append("_pageSize", pageSize.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(`_${key}`, value);
    });

    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: PaymentGatewayRepository.Transactions.GetAll,
          parameters: params.toString(),
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
      name: t("Transaction Date"),
      selector: (row: any) =>
        row.transactionDate
          ? formatDate(row.transactionDate, "dd/MM/yyyy")
          : "",
      sortable: true,
      id: "TransactionDate",
    },
    {
      name: t("Payment Date"),
      selector: (row: any) => parseBody(row.body)?.source?.createdAt ?? " ",
      sortable: true,
      id: "PaymentDate",
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
      name: t("IBAN"),
      selector: (row: any) => row.iban,
      sortable: true,
      id: "iban",
    },
    {
      name: t("currency"),
      selector: (row: any) => row.currency,
      sortable: true,
      id: "currency",
    },

    {
      name: t("Payment Status"),
      selector: (row: any) => row.statusName,
      sortable: true,
      id: "paymentStatus",
    },

    {
      name: t("Payment Brand"),
      selector: (row: any) => row.network ?? " ",
      sortable: true,
      id: "network",
    },
    {
      name: t("Receipt Ref"),
      selector: (row: any) => row.receiptRef ?? " ",
      sortable: true,
      id: "receiptRef",
    },
    {
      name: t("owo Ref"),
      selector: (row: any) => row.owoRef ?? "",
      sortable: true,
      id: "owoRef",
    },

    {
      name: t("Transaction ID"),
      selector: (row: any) => row.transactionId ?? "",
      sortable: true,
      id: "transactionId",
    },
    {
      name: t("Transaction Ref"),
      selector: (row: any) => row.transactionRef ?? "",
      sortable: true,
      id: "transactionId",
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

          <Col md="3">
            <CustomInput
              name="numberID"
              label={t("Number ID")}
              placeholder={t("Search by ID")}
              value={filters.numberID}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, numberID: e.target.value }))
              }
            />
          </Col>
          <Col md="3">
            <CustomSelect
              name="paymentGatewayId"
              label={t("Payment Gateway")}
              endpointId={`${DashboardKVSRepository.KVS.GetAll}?_dataset=2&_language=${langId}`}
              valueKey="key"
              labelKey="value"
              value={filters.paymentGatewayId || undefined}
              onChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  paymentGatewayId: val?.toString() ?? "",
                }))
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
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default PaymentsHistoryPage;
