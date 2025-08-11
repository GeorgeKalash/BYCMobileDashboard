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
import CustomSelect from "@/Shared/Components/CustomSelect";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import ResourceLookup from "@/Shared/Components/ResourceLookup";

const PaymentsHistoryPage = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [paginationState, setPaginationState] = useState({
    pageCount: 0,
    totalRows: 0,
  });
  const pageSize = 10;
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    paymentGatewayId: "",
    paymentStatus: "",
    cellphone: "",
  });

  const fetchData = async (page = paginationState.pageCount) => {
    const queryParams = new URLSearchParams({
      _startAt: page.toString(),
      _pageSize: pageSize.toString(),
    });

    if (filters.fromDate) queryParams.append("_fromDate", filters.fromDate);
    if (filters.toDate) queryParams.append("_toDate", filters.toDate);
    if (filters.paymentGatewayId)
      queryParams.append("_paymentGatewayId", filters.paymentGatewayId);
    if (filters.paymentStatus)
      queryParams.append("_paymentStatus", filters.paymentStatus);
    if (filters.cellphone) queryParams.append("_cellphone", filters.cellphone);

    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: PaymentGatewayRepository.Transactions.GetAll,
          parameters: queryParams.toString(),
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
  }, [paginationState.pageCount]);

  const columns = [
    {
      name: t("receipt ID"),
      selector: (row: any) => row.receiptId,
      id: "receiptId",
      width:"100px"
    },
    {
      name: t("Card Holder Name"),
      selector: (row: any) => row.clientName,
      id: "CardHolderName",
      width:"150px"
    },
    {
      name: t("Phone Number"),
      selector: (row: any) => row.cellPhone,
      id: "cellPhone",
      width:"150px"
    },
    {
      name: t("Transaction Date"),
      selector: (row: any) =>
        row.transactionDate
          ? formatDate(row.transactionDate, "dd/MM/yyyy")
          : "",
      id: "TransactionDate",
      width:"150px"
    },
    {
      
      name: t("Posting Date"),
      selector: (row: any) =>
        row.postingDate ? formatDate(row.postingDate, "dd/MM/yyyy") : "",
      sortable: true,
      id: "PostingDate",
      width:"175px"
    },
   {
      name: t("Amount"),
      selector: (row: any) =>
        row.amount != null
          ? Number(row.amount).toLocaleString(i18LangStatus || undefined)
          : "",
      id: "amount",
      width: "100px",
    },
    {
      name: t("Bank Name"),
      selector: (row: any) => row.bankName,
      id: "bankName",
      width:"200px"
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
      width:"130px"
    },
    {
      name: t("IBAN"),
      selector: (row: any) => row.iban,
      id: "iban",
      width:"200px"
    },
    {
      name: t("currency"),
      selector: (row: any) => row.currency,
      id: "currency",
      width:"100px"
    },
    {
      name: t("Payment Status"),
      selector: (row: any) => row.psName,
      id: "paymentStatus",
      width:"150px"
    },
    {
      name: t("Payment Code"),
      selector: (row: any) => row.paymentCode,
      id: "paymentCode",
      width:"150px"
    },
    {
      name: t("Payment Description"),
      selector: (row: any) => row.paymentDescription,
      id: "paymentDescription",
      width:"175px"
    },
    {
      name: t("Payment Brand"),
      selector: (row: any) => row.network ?? "",
      id: "network",
      width:"150px"
    },
    {
      name: t("Receipt Ref"),
      selector: (row: any) => row.receiptRef ?? "",
      id: "receiptRef",
      width:"100px"
    },
    {
      name: t("owo Ref"),
      selector: (row: any) => row.owoRef ?? "",
      id: "owoRef",
      width:"130px"
    },
    {
      name: t("Transaction ID"),
      selector: (row: any) => row.transactionId ?? "",
      id: "transactionId",
      width:"200px"
    },
    {
      name: t("Transaction Ref"),
      selector: (row: any) => row.transactionRef ?? "",
      id: "transactionId",
      width:"200px"
    },
  ];

  const handlePageChange = (startAt: number) => {
    const newPage = Math.floor(startAt / pageSize);
    setPaginationState((prev) => ({
      ...prev,
      pageCount: newPage,
    }));
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Payment History")}></CommonCardHeader>
        <Row className="w-100 px-2 ">
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
          <Col md="2">
            <CustomSelect
              name="paymentGatewayId"
              label={t("Payment Gateway")}
              dashboardDatasetId={2}
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
          <Col md="2">
            <CustomSelect
              name="paymentStatus"
              label={t("Payment Status")}
              endpointId={PaymentGatewayRepository.status.getAll}
              valueKey="key"
              labelKey="value"
              value={filters.paymentStatus || undefined}
              onChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  paymentStatus: val?.toString() ?? "",
                }))
              }
            />
          </Col>
          <Col md="2">
            <ResourceLookup
              name="username"
              label={t("Phone Number")}
              endpoint={DashboardMobileRepository.mobileUser.snapshot}
              searchParamKey="_username"
              columns={[{ key: "username", label: "Phone Number" }]}
              minChars={3}
              onChange={(selectedUser) => {
                setFilters((prev) => ({
                  ...prev,
                  cellphone: selectedUser?.username || "",
                }));
              }}
              value={filters.cellphone}
            />
          </Col>
          <Col md="2" className="d-flex align-items-center">
            <SharedButton title={t("Filter")} onClick={() => fetchData(0)} />
          </Col>
        </Row>
        <CardBody>
          <DataTable
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
