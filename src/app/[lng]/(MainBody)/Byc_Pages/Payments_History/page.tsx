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
    fromTrxDate: "",
    toTrxDate: "",
    paymentGatewayId: "",
    paymentStatus: "",
    cellphone: "",
  });

  const fetchData = async (page = paginationState.pageCount) => {
    const fromTrxDateUtc = filters.fromTrxDate
      ? new Date(
          Date.UTC(
            new Date(filters.fromTrxDate).getFullYear(),
            new Date(filters.fromTrxDate).getMonth(),
            new Date(filters.fromTrxDate).getDate(),
            0,
            0,
            0,
            0
          )
        ).toISOString()
      : "";

    const toTrxDateUtc = filters.toTrxDate
      ? new Date(
          Date.UTC(
            new Date(filters.toTrxDate).getFullYear(),
            new Date(filters.toTrxDate).getMonth(),
            new Date(filters.toTrxDate).getDate(),
            23,
            59,
            59,
            999
          )
        ).toISOString()
      : "";

    const queryParams = new URLSearchParams({
      _startAt: page.toString(),
      _pageSize: pageSize.toString(),
    });

    if (fromTrxDateUtc) queryParams.append("_fromTrxDate", fromTrxDateUtc);
    if (toTrxDateUtc) queryParams.append("_toTrxDate", toTrxDateUtc);
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
      width: "100px",
    },
    {
      name: t("Receipt Ref"),
      selector: (row: any) => row.receiptRef ?? "",
      id: "receiptRef",
      width: "100px",
    },
    {
      name: t("owo Ref"),
      selector: (row: any) => row.owoRef ?? "",
      id: "owoRef",
      width: "130px",
    },
    {
      name: t("Card Holder Name"),
      selector: (row: any) => row.clientName,
      id: "CardHolderName",
      width: "150px",
    },
    {
      name: t("Phone Number"),
      selector: (row: any) => row.cellPhone,
      id: "cellPhone",
      width: "150px",
    },
    {
      name: t("Transaction Date"),
      selector: (row: any) =>
        row.transactionDate
          ? formatDate(row.transactionDate, "dd/MM/yyyy HH:mm")
          : "",
      id: "TransactionDate",
      width: "150px",
    },
    {
      name: t("Posting Date"),
      selector: (row: any) =>
        row.postingDate ? formatDate(row.postingDate, "dd/MM/yyyy HH:mm") : "",
      sortable: true,
      id: "PostingDate",
      width: "175px",
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
      width: "200px",
    },
    {
      name: t("Gateway Type"),
      selector: (row: any) => row.pgName,
      id: "paymentGatewayType",
      width: "130px",
    },
    {
      name: t("Transaction ID"),
      selector: (row: any) => row.transactionId ?? "",
      id: "transactionId",
      width: "200px",
    },
    {
      name: t("Transaction Ref"),
      selector: (row: any) => row.transactionRef ?? "",
      id: "transactionRef",
      width: "200px",
    },
    {
      name: t("Card Number"),
      selector: (row: any) => row.iban,
      id: "iban",
      width: "200px",
    },
    {
      name: t("currency"),
      selector: (row: any) => row.currency,
      id: "currency",
      width: "100px",
    },
    {
      name: t("Payment Status"),
      selector: (row: any) => row.psName,
      id: "paymentStatus",
      width: "150px",
    },
    {
      name: t("Payment Code"),
      selector: (row: any) => row.paymentCode,
      id: "paymentCode",
      width: "150px",
    },
    {
      name: t("Payment Description"),
      selector: (row: any) => row.paymentDescription,
      id: "paymentDescription",
      width: "175px",
    },
    {
      name: t("Payment Brand"),
      selector: (row: any) => row.network ?? "",
      id: "network",
      width: "150px",
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
        <CommonCardHeader title={t("Payment History")}>
          <Row className="g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
            <Col>
              <CustomDatePicker
                name="fromTrxDate"
                label={t("From Date")}
                value={filters.fromTrxDate}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, fromTrxDate: val || "" }))
                }
              />
            </Col>
            <Col>
              <CustomDatePicker
                name="toTrxDate"
                label={t("To Date")}
                value={filters.toTrxDate}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, toTrxDate: val || "" }))
                }
              />
            </Col>
            <Col>
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
                    paymentGatewayId: val?.toString() || "",
                  }))
                }
              />
            </Col>
            <Col>
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
                    paymentStatus: val?.toString() || "",
                  }))
                }
              />
            </Col>
            <Col>
              <ResourceLookup
                name="username"
                label={t("Phone Number")}
                endpoint={DashboardMobileRepository.mobileUser.snapshot}
                searchParamKey="_username"
                columns={[{ key: "username", label: "Phone Number" }]}
                minChars={3}
                onChange={(selectedUser) =>
                  setFilters((prev) => ({
                    ...prev,
                    cellphone: selectedUser?.username || "",
                  }))
                }
                value={filters.cellphone}
              />
            </Col>
            <Col className="d-flex align-items-center gap-2">
              <SharedButton title={t("Filter")} onClick={() => fetchData(0)} />
            </Col>
          </Row>
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
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default PaymentsHistoryPage;
