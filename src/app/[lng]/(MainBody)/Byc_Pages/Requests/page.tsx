"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { FormikProps } from "formik";
import { format, startOfDay, endOfDay } from "date-fns";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import CustomSelect from "@/Shared/Components/CustomSelect";
import CustomDatePicker from "@/Shared/Components/CustomDatePicker";
import SharedButton from "@/Shared/Components/SharedButton";
import ResourceLookup from "@/Shared/Components/ResourceLookup";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import { withRequestTracking } from "@/utils/withRequestTracking";
import formatDate from "@/utils/DateFormatter";
import RequestsForm from "./Form/RequestsForm";

type FilterState = {
  fromDate: string;
  toDate: string;
  eventType: 1 | 2 | null;
  clientId: string | null;
  phoneNumber: string | null;
};

type PaginationState = {
  pageCount: number;
  totalRows: number;
  searchTerm: string;
};

const PAGE_SIZE = 30;

const Requests: React.FC = () => {
  const dispatch = useAppDispatch();
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const formikRef = useRef<FormikProps<any>>(null);

  const [filters, setFilters] = useState<FilterState>({
    fromDate: format(new Date(), "MM-dd-yyyy"),
    toDate: format(new Date(), "MM-dd-yyyy"),
    eventType: 1,
    clientId: null,
    phoneNumber: null,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageCount: 0,
    totalRows: 0,
    searchTerm: "",
  });

  const [data, setData] = useState<any[]>([]);
  const [modalState, setModalState] = useState<{
    open: boolean;
    row: any | null;
  }>({
    open: false,
    row: null,
  });

  const toUtcString = useCallback((dateStr: string, isEndOfDay = false) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const utcDate = isEndOfDay ? endOfDay(date) : startOfDay(date);
    return new Date(
      Date.UTC(
        utcDate.getFullYear(),
        utcDate.getMonth(),
        utcDate.getDate(),
        utcDate.getHours(),
        utcDate.getMinutes(),
        utcDate.getSeconds(),
        utcDate.getMilliseconds()
      )
    ).toISOString();
  }, []);

  const fetchData = useCallback(
    async (page = pagination.pageCount) => {
      if (!filters.eventType) return;

      const startAt = page * PAGE_SIZE;
      const fromDateUtc = toUtcString(filters.fromDate);
      const toDateUtc = toUtcString(filters.toDate, true);

      const query =
        `_eventType=${filters?.eventType || ""}&_clientId=${
          filters?.clientId || ""
        }&_startAt=${startAt}&_pageSize=${PAGE_SIZE}` +
        `&_fromDate=${fromDateUtc}&_toDate=${toDateUtc}` +
        `&_url=${encodeURIComponent(pagination.searchTerm)}`;

      const result = await withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: DashboardMobileRepository.Requests.get,
            parameters: query,
          })
        )
      );

      const rows = result?.payload?.data?.list ?? [];
      const total = result?.payload?.data?.count ?? 0;

      setData(rows);
      setPagination((prev) => ({ ...prev, totalRows: total }));
    },
    [dispatch, pagination.searchTerm, pagination.pageCount, toUtcString]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo(
    () => [
      {
        name: t("accountId"),
        selector: (row: any) => row.accountId?.toString() ?? "",
        sortable: true,
        id: "accountId",
        width: "120px",
      },
      {
        name: t("clientId"),
        selector: (row: any) => row.clientId?.toString() ?? "",
        sortable: true,
        id: "clientId",
        width: "130px",
      },
      {
        name: t("clockStamp"),
        selector: (row: any) => row.clockStamp,
        cell: (row: any) =>
          row.clockStamp
            ? formatDate(row.clockStamp, "dd/MM/yyyy HH:mm:ss")
            : "",
        sortable: true,
        id: "clockStamp",
      },
      {
        name: t("recordId"),
        selector: (row: any) => row.recordId?.toString() ?? "",
        sortable: true,
        id: "recordId",
        width: "130px",
      },
      {
        name: t("requestBody"),
        selector: (row: any) => row.requestBody?.toString() ?? "",
        sortable: true,
        id: "requestBody",
      },
      {
        name: t("requestType"),
        selector: (row: any) => row.requestType?.toString() ?? "",
        sortable: true,
        id: "requestType",
        width: "130px",
      },
      {
        name: t("url"),
        selector: (row: any) => row.url?.toString() ?? "",
        sortable: true,
        id: "url",
      },
      {
        name: t("userId"),
        selector: (row: any) => row.userId?.toString() ?? "",
        sortable: true,
        id: "userId",
        width: "130px",
      },
    ],
    [t]
  );

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, pageCount: 0 }));
  };

  const handlePageChange = (startAt: number) => {
    setPagination((prev) => ({
      ...prev,
      pageCount: Math.floor(startAt / PAGE_SIZE),
    }));
  };

  const handleSearchChange = (val: string) => {
    setPagination((prev) => ({ ...prev, searchTerm: val, pageCount: 0 }));
  };

  const openModal = (row: any = null) => setModalState({ open: true, row });
  const closeModal = () => {
    setModalState({ open: false, row: null });
    fetchData();
  };

  const handleSubmit = () => formikRef.current?.submitForm();

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Requests")}>
          <Row className="g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            <Col>
              <CustomDatePicker
                name="fromDate"
                label={t("From Date")}
                value={filters.fromDate}
                onChange={(val) => handleFilterChange("fromDate", val || null)}
              />
            </Col>
            <Col>
              <CustomDatePicker
                name="toDate"
                label={t("To Date")}
                value={filters.toDate}
                onChange={(val) => handleFilterChange("toDate", val || null)}
              />
            </Col>
            <Col>
              <CustomSelect
                name="eventType"
                label={t("eventType")}
                dataSetId={159}
                valueKey="key"
                labelKey="value"
                value={filters.eventType ?? ""}
                onChange={(val) =>
                  handleFilterChange(
                    "eventType",
                    [1, 2].includes(Number(val)) ? Number(val) : null
                  )
                }
              />
            </Col>
            <Col>
              <ResourceLookup
                name="phoneNumber"
                label={t("Phone Number")}
                endpoint={DashboardMobileRepository.mobileUser.snapshot}
                searchParamKey="_username"
                columns={[{ key: "username", label: "Phone Number" }]}
                minChars={3}
                onChange={(selectedUser) => {
                  handleFilterChange(
                    "clientId",
                    selectedUser?.clientId || null
                  );
                  handleFilterChange(
                    "phoneNumber",
                    selectedUser?.username || null
                  );
                }}
                value={filters.phoneNumber}
              />
            </Col>
            <Col className="d-flex align-items-center">
              <SharedButton title={t("Filter")} onClick={() => fetchData(0)} />
            </Col>
          </Row>
        </CommonCardHeader>
        <CardBody>
          <DataTable
            data={data}
            columns={columns}
            pagination
            serverPagination
            totalRows={pagination.totalRows}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
            Search
            searchType="server"
            searchableColumns={["requestBody", "url", "requestType"]}
            onSearchChange={handleSearchChange}
            showActions
            onEdit={openModal}
          />
        </CardBody>
      </Card>

      <SharedModal
        visible={modalState.open}
        onClose={closeModal}
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
