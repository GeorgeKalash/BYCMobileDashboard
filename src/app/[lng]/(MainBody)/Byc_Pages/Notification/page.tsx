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
import CustomInput from "@/Shared/Components/CustomInput";
import CustomSelect from "@/Shared/Components/CustomSelect";
import { NotificationAlertRepository } from "@/Repositories/NotificationAlert";

const Notification = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const formikRef = useRef<FormikProps<any>>(null);

  type Filters = {
    fromDate: string;
    toDate: string;
    title: string;
    phoneNumber: string;
    templateId: string | number | null;
  };

  const [filters, setFilters] = useState<Filters>({
    fromDate: "01-01-2025",
    toDate: "01-01-2026",
    title: "",
    phoneNumber: "",
    templateId: "",
  });

  const [tableData, setTableData] = useState({
    data: [],
    pagination: {
      pageCount: 0,
      totalRows: 0,
      pageSize: 100,
    },
  });

  const [modal, setModal] = useState({
    open: false,
    action: null as "edit" | null,
    row: null as any,
  });

  const fetchData = async (page = tableData.pagination.pageCount) => {
    const query =
      `_fromDate=${filters.fromDate}&_toDate=${filters.toDate}` +
      `&_startAt=${page}&_pageSize=${tableData.pagination.pageSize}` +
      `&_title=${filters.title}&_templateId=${filters.templateId}` +
      `&_destination=${filters.phoneNumber}`;

    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: NotificationMobileRepository.Notification.getAll,
          parameters: query,
        })
      )
    );

    const list = result?.payload?.data?.list ?? [];
    const total = result?.payload?.data?.count ?? 0;

    setTableData((prev) => ({
      ...prev,
      data: list,
      pagination: {
        ...prev.pagination,
        totalRows: total,
      },
    }));
  };

  const handlePageChange = (startAt: number) => {
    const newPage = Math.ceil(startAt / tableData.pagination.pageSize);
    setTableData((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageCount: newPage,
      },
    }));
  };

  useEffect(() => {
    fetchData();
  }, [
    tableData.pagination.pageCount,
    filters.fromDate,
    filters.toDate,
    filters.templateId,
  ]);

  const columns = [
    {
      name: t("Client Name"),
      selector: (row: any) => row.clientName,
      sortable: true,
      id: "ClientName",
    },
    {
      name: t("Client Number"),
      selector: (row: any) => row.cellPhone,
      sortable: true,
      id: "ClientNumber",
    },
    {
      name: t("Type"),
      selector: (row: any) => row.typeName,

      sortable: true,
      id: "Type",
    },
    {
      name: t("Template Name"),
      selector: (row: any) => row.templateName,
      sortable: true,
      id: "TemplateName",
    },
    {
      name: t("Language"),
      selector: (row: any) => row.languageName,
      sortable: true,
      id: "Language",
    },
    {
      name: t("Date"),
      selector: (row: any) =>
        row.date ? formatDate(row.date, "dd/MM/yyyy") : "-",
      sortable: true,
      id: "Date",
    },
    {
      name: t("Is Read"),
      selector: (row: any) => (row.isRead ? t("Yes") : t("No")),
      sortable: true,
      id: "IsRead",
    },
  ];

  const handleModalOpen = (row: any, action: "edit") => {
    setModal({ open: true, action, row });
  };

  const handleModalClose = () => {
    setModal({ open: false, action: null, row: null });
    fetchData();
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilterBlur = () => {
    fetchData();
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Notifications")}>
          <Row className="w-100">
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
              <CustomInput
                name="title"
                label={t("Title")}
                placeholder={t("Search by title")}
                value={filters.title}
                onChange={(e) => handleFilterChange("title", e.target.value)}
                onBlur={handleFilterBlur}
              />
            </Col>
            <Col md="2">
              <CustomInput
                name="phoneNumber"
                type="number"
                label={t("Phone Number")}
                placeholder={t("Search by phone")}
                value={filters.phoneNumber}
                onChange={(e) =>
                  handleFilterChange("phoneNumber", e.target.value)
                }
                onBlur={handleFilterBlur}
              />
            </Col>
            <Col md="2">
              <CustomSelect
                name="templateId"
                label={t("Template Name")}
                value={filters.templateId}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, templateId: val }))
                }
                endpointId={
                  NotificationAlertRepository.NotificationTypes.getAll
                }
                valueKey="key"
                labelKey="value"
              />
            </Col>
          </Row>
        </CommonCardHeader>

        <CardBody>
          <DataTable
            title={t("Notifications")}
            data={tableData.data}
            columns={columns}
            highlightOnHover
            pagination
            serverPagination
            totalRows={tableData.pagination.totalRows}
            pageSize={tableData.pagination.pageSize}
            onPageChange={handlePageChange}
            showActions
            onEdit={(row) => handleModalOpen(row, "edit")}
          />
        </CardBody>
      </Card>

      <SharedModal
        visible={modal.open}
        onClose={handleModalClose}
        title={t("Notification")}
        width="600px"
        height="60vh"
      >
        <NotificationForm
          rowData={modal.row}
          formikRef={formikRef}
          modalAction={modal.action}
          onSuccessSubmit={handleModalClose}
        />
      </SharedModal>
    </Col>
  );
};

export default Notification;
