"use client";

import React, { useEffect, useState } from "react";
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
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import ResourceLookup from "@/Shared/Components/ResourceLookup";

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
    paymentStatus: "",
    username: "",
  });

  const [data, setData] = useState<{ key: string; value: string }[]>([]);

  const parseBody = (body: string | null) => (body ? JSON.parse(body) : {});
  const [paginationState, setPaginationState] = useState({
    pageCount: 0,
    totalRows: 0,
  });

  const pageSize = 30;

  const paymentStatusOptions = [
    { value: 1, label: "PENDING" },
    { value: 2, label: "SUCCESS" },
    { value: -1, label: "FAILED" },
  ];

  const fetchData = async (page = 0) => {
    const params = new URLSearchParams();
    params.append("_startAt", page.toString());
    params.append("_pageSize", pageSize.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(`_${key}`, value.toString());
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
      name: t("Record ID"),
      selector: (row: any) => row.recordId,
      id: "RecordID",
    },
    {
      name: t("Card Holder Name"),
      selector: (row: any) => row.clientName,
      id: "CardHolderName",
    },
    {
      name: t("Phone Number"),
      selector: (row: any) => row.cellPhone,
      id: "cellPhone",
    },
    {
      name: t("Transaction Date"),
      selector: (row: any) =>
        row.transactionDate
          ? formatDate(row.transactionDate, "dd/MM/yyyy")
          : "",
      id: "TransactionDate",
    },
    {
      name: t("Payment Date"),
      selector: (row: any) => " ",
      id: "PaymentDate",
    },
    {
      name: t("Amount"),
      selector: (row: any) => row.amount ?? " ",
      id: "amount",
    },
    {
      name: t("Bank Name"),
      selector: (row: any) => row.bankName,
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
      id: "paymentGatewayType",
    },
    {
      name: t("IBAN"),
      selector: (row: any) => row.iban,
      id: "iban",
    },
    {
      name: t("currency"),
      selector: (row: any) => row.currency,
      id: "currency",
    },
    {
      name: t("Payment Status"),
      selector: (row: any) => row.psName,
      id: "paymentStatus",
    },
    {
      name: t("Payment Brand"),
      selector: (row: any) => row.network ?? " ",
      id: "network",
    },
    {
      name: t("Receipt Ref"),
      selector: (row: any) => row.receiptRef ?? " ",
      id: "receiptRef",
    },
    {
      name: t("owo Ref"),
      selector: (row: any) => row.owoRef ?? "",
      id: "owoRef",
    },
    {
      name: t("Transaction ID"),
      selector: (row: any) => row.transactionId ?? "",
      id: "transactionId",
    },
    {
      name: t("Transaction Ref"),
      selector: (row: any) => row.transactionRef ?? "",
      id: "transactionId",
    },
  ];

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Payments History")} />
        <Row className="w-100 px-3 py-2">
          <Col md="3">
            <CustomDatePicker
              name="fromDate"
              label={t("From Date")}
              value={filters.fromDate}
              onChange={(val) =>
                val && setFilters((prev) => ({ ...prev, fromDate: val }))
              }
            />
          </Col>
          <Col md="3">
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
          <Col md="3">
            <CustomSelect
              name="paymentStatus"
              label={t("Payment Status")}
              options={paymentStatusOptions}
              valueKey="value"
              labelKey="label"
              value={filters.paymentStatus || undefined}
              onChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  paymentStatus: val?.toString() ?? "",
                }))
              }
            />
          </Col>
          <Col md="3">
            <ResourceLookup
              name="username"
              label={t("Phone Number")}
              endpoint={DashboardMobileRepository.mobileUser.snapshot}
              searchParamKey="_username"
              columns={[{ key: "username", label: "Phone Number" }]}
              minChars={3}
              onChange={(selectedUser) => {
                if (selectedUser) {
                  setFilters((prev) => ({
                    ...prev,
                    username: selectedUser.username,
                  }));
                }
              }}
              value={filters.username}
            />
          </Col>

          <Col md="3" className="d-flex align-items-center">
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
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default PaymentsHistoryPage;
