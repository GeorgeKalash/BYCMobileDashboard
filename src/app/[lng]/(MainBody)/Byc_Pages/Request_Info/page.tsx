"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import SharedButton from "@/Shared/Components/SharedButton";
import CustomDatePicker from "@/Shared/Components/CustomDatePicker";
import CustomSelect from "@/Shared/Components/CustomSelect";
import RequestInfoForm from "./Form/RequestInfoForm";

const UsersPage = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [modalState, setModalState] = useState({ open: false, row: null as any });
  const [paginationState, setPaginationState] = useState({ pageCount: 0, totalRows: 0 });

  const [filters, setFilters] = useState({
    fromBirthDate: "",
    toBirthDate: "",
    nationalityId: null as number | null,
  });

  const pageSize = 30;

  const fetchData = async (page = 0) => {
    const payload = {
      startAt: page,
      pageSize,
      filters: {
        fromBirthDate: filters.fromBirthDate ? new Date(filters.fromBirthDate).toISOString() : null,
        toBirthDate: filters.toBirthDate ? new Date(filters.toBirthDate).toISOString() : null,
        nationalityId: filters.nationalityId ?? null,
      },
    };

    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: DashboardMobileRepository.MobileUser.SearchEngine,
          body: payload,
          rawBody: true,
        })
      ).unwrap()
    );

    const list = result?.data;
    setData(Array.isArray(list) ? list : []);
    setPaginationState((prev) => ({
      ...prev,
      totalRows: Array.isArray(list) ? list.length : 0,
    }));
  };

  useEffect(() => {
    fetchData(paginationState.pageCount);
  }, [paginationState.pageCount]);

  useEffect(() => {
    const refreshHandler = () => fetchData(paginationState.pageCount);
    window.addEventListener("refreshUsersTable", refreshHandler);
    return () => window.removeEventListener("refreshUsersTable", refreshHandler);
  }, [paginationState.pageCount]);

  const handleFilterChange = (field: string, value: string | number | null) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (startAt: number) => {
    setPaginationState((prev) => ({ ...prev, pageCount: startAt }));
  };

  const openModal = (row: any = null) => {
    setModalState({ open: true, row });
  };

  const handleModalClose = () => {
    setModalState({ open: false, row: null });
    fetchData(paginationState.pageCount);
  };

  const columns = [
    { name: t("username"), selector: (row: any) => row.user?.username ?? "" },
    { name: t("Name"), selector: (row: any) => row.clientMaster?.name ?? "", sortable: true },
    { name: t("Phone Number"), selector: (row: any) => row.clientMaster?.cellPhone ?? "" },
    { name: t("Nationality"), selector: (row: any) => row.clientMaster?.nationalityName ?? "" },
    { name: t("ID Number"), selector: (row: any) => row.clientRemittance?.idNo ?? "" },
    { name: t("City"), selector: (row: any) => row.address?.city ?? "" },
    { name: t("District"), selector: (row: any) => row.address?.cityDistrict ?? "" },
    { name: t("Street"), selector: (row: any) => row.address?.street1 ?? "" },
    {
      name: t("Active"),
      cell: (row: any) => (
        <span style={{ color: row.user?.isInactive ? "red" : "green", fontWeight: "bold" }}>
          {row.user?.isInactive ? t("InActive") : t("Active")}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("RequestInfo")}>
          <Row className="w-100">
            <Col>
              <CustomDatePicker
                name="fromBirthDate"
                label={t("From Birth Date")}
                value={filters.fromBirthDate}
                onChange={(val) => handleFilterChange("fromBirthDate", val || "")}
              />
            </Col>
            <Col>
              <CustomDatePicker
                name="toBirthDate"
                label={t("To Birth Date")}
                value={filters.toBirthDate}
                onChange={(val) => handleFilterChange("toBirthDate", val || "")}
              />
            </Col>
            <Col>
              <CustomSelect
                name="nationality"
                label={t("Nationality")}
                value={filters.nationalityId ?? ""}
                onChange={(val) => handleFilterChange("nationalityId", val ?? null)}
                endpointId={DashboardMobileRepository.country.getall}
                labelKey="name"
                valueKey="recordId"
              />
            </Col>
            <Col md="1" className="d-flex align-items-center">
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
            totalRows={paginationState.totalRows}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
          <div className="mt-3 d-flex justify-content-end">
            <SharedButton title={t("RequestInfo")} onClick={() => openModal(null)} />
          </div>
        </CardBody>
      </Card>
      <SharedModal
        visible={modalState.open}
        onClose={handleModalClose}
        title={t("RequestInfo")}
        width="50vw"
        height="60vh"
      >
        <RequestInfoForm visible={true} filters={filters} />
      </SharedModal>
    </Col>
  );
};

export default UsersPage;
