"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { FormikProps } from "formik";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import UsersForm, { UsersFormHandle } from "./Forms/UsersForm";
import SharedButton from "@/Shared/Components/SharedButton";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomDatePicker from "@/Shared/Components/CustomDatePicker";
import CustomSelect from "@/Shared/Components/CustomSelect";
import { format } from "date-fns";
import CustomDateTimePicker, { parseDateTime } from "@/Shared/Components/CustomDateTimePicker";

const UsersPage = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [modalState, setModalState] = useState({
    open: false,
    row: null as any,
  });

  const [paginationState, setPaginationState] = useState({
    pageCount: 0,
    totalRows: 0,
  });
  const [filters, setFilters] = useState({
    fromDate: format(new Date(), "MM-dd-yyyy"),
    toDate: format(new Date(), "MM-dd-yyyy"),
    name: "",
    phoneNumber: "",
    idNumber: "",
    nationality: "",
    cityId: null,
    street: "",
    lastLogin: format(new Date(), "MM-dd-yyyy HH:mm"),
    countryId: null
  });

  const pageSize = 30;
  const formikRef = useRef<FormikProps<any>>(null);
  const formLogicRef = useRef<UsersFormHandle>(null);

  const fetchData = async (page = 0) => {
    const payload = {
      startAt: page,
      pageSize,
      filters: {
        fromDate: filters.fromDate ? new Date(filters?.fromDate).toISOString() : null,
        toDate: filters?.toDate? new Date(filters?.toDate).toISOString() : null,
        username: filters.phoneNumber || null,
        nationalityId: filters.nationality ? Number(filters?.nationality) : null,
        idNo: filters.idNumber || null,
        cityId: filters.cityId || null,
        street: filters.street || "",
        lastLogin: parseDateTime(filters?.lastLogin)?.toISOString() ?? null,
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

  const handleFilterChange = (field: string, value: string | number | null) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (startAt: number) => {
    setPaginationState((prev) => ({
      ...prev,
      pageCount: startAt,
    }));
  };

  const openModal = (row: any = null) => {
    setModalState({ open: true, row });
  };

  const handleModalClose = () => {
    setModalState({ open: false, row: null });
    fetchData(paginationState.pageCount);
  };

  const handleOTPPress = () => {
    formLogicRef.current?.openOtpModal();
  };

  const handleInfoClick = () => {
    formLogicRef.current?.logFormValues();
  };

  const handleUserInfoPress = () => {
    formLogicRef.current?.openUserInfoModal();
  };

  const handleUserControlPress = () => {
    formLogicRef.current?.openUserControlModal();
  };

  const columns = [
    { name: t("Name"), selector: (row: any) => row.clientMaster?.name ?? "", sortable: true },
    { name: t("PhoneNumber"), selector: (row: any) => row.clientMaster?.cellPhone ?? "" },
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
        <CommonCardHeader title={t("Users")}>
          <Row className="w-100">
            <Col md="2">
              <CustomDatePicker
                name="fromDate"
                label={t("From Date")}
                value={filters.fromDate}
                onChange={(val) => setFilters((p) => ({ ...p, fromDate: val || "" }))}
              />
            </Col>
            <Col md="2">
              <CustomDatePicker
                name="toDate"
                label={t("To Date")}
                value={filters.toDate}
                onChange={(val) => setFilters((p) => ({ ...p, toDate: val || "" }))}
              />
            </Col>
            <Col md="2">
              <CustomInput
                name="phoneNumber"
                label={t("Phone Number")}
                placeholder={t("Search by Phone Number")}
                value={filters.phoneNumber}
                onChange={(e) =>
                  handleFilterChange("phoneNumber", e.target.value.replace(/\D/g, ""))
                }
              />
            </Col>
            <Col md="2">
              <CustomInput
                name="idNumber"
                label={t("ID Number")}
                placeholder={t("Search by ID Number")}
                value={filters.idNumber}
                onChange={(e) =>
                  handleFilterChange("idNumber", e.target.value.replace(/\D/g, ""))
                }
              />
            </Col>
             <Col md="2">
              <CustomInput
                name="street"
                label={t("street")}
                placeholder={t("Search by Street")}
                value={filters.street}
                onChange={(e) =>
                  handleFilterChange("street", e.target.value)
                }
              />
            </Col>
            <Col md="2">
              <CustomDateTimePicker
                name="lastLogin"
                label={t("Last Login")}
                value={filters.lastLogin}
                onChange={(val) => setFilters((p) => ({ ...p, lastLogin: val || "" }))}
              />
            </Col>
            <Col md="2">
              <CustomSelect
                name="nationality"
                label={t("Nationality")}
                value={filters.nationality}
                onChange={(val) => handleFilterChange("nationality", val ?? "")}
                endpointId={DashboardMobileRepository.country.getall}
                labelKey="name"
                valueKey="recordId"
              />
            </Col>
            <Col md="2">
              <CustomSelect
                name="country"
                label={t("Country Of Residence")}
                value={filters.countryId}
                onChange={(val) => {
                  handleFilterChange("countryId", val || null);
                  handleFilterChange("cityId", null);
                }}
                endpointId={DashboardMobileRepository.country.getall}
                labelKey="name"
                valueKey="recordId"
              />
            </Col>
            <Col md="2">
              <CustomSelect
                name="city"
                label={t("city")}
                value={filters.cityId}
                onChange={(val) => handleFilterChange("cityId", val ?? "")}
                endpointId={DashboardMobileRepository.city.getall}
                parameters={`_countryId=${filters.countryId}`}
                readOnly={!filters.countryId}
                labelKey="name"
                valueKey="recordId"
              />
            </Col>
            <Col md="2" className="d-flex align-items-center">
              <SharedButton title={t("Filter")} onClick={() => fetchData(0)} />
            </Col>
          </Row>
        </CommonCardHeader>
        <CardBody>
          <DataTable
            title={t("Users")}
            data={data}
            columns={columns}
            pagination
            serverPagination
            totalRows={paginationState.totalRows}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showActions
            onEdit={(row) => openModal(row)}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalState.open}
        onClose={handleModalClose}
        title={t("User")}
        width="50vw"
        height="70vh"
        onInfoClick={handleInfoClick}
        footerActions={
          <>
            <SharedButton
              logo="/assets/images/icons/userControl.png"
              color="primary"
              title={t("UserControl")}
              onClick={handleUserControlPress}
              tooltip={t("UserControl")}
            />
            <SharedButton
              logo="/assets/images/icons/user.png"
              color="tertiary"
              title={t("AdditionalInfo")}
              onClick={handleUserInfoPress}
              tooltip={t("AdditionalInfo")}
            />
            <SharedButton
              logo="/assets/images/icons/lock.png"
              color="warning"
              title={t("OTP")}
              onClick={handleOTPPress}
              tooltip={t("OTP")}
            />
          </>
        }
      >
        {modalState.row && (
          <UsersForm
            ref={formLogicRef}
            user={modalState.row}
            formikRef={formikRef}
            onSuccessSubmit={handleModalClose}
          />
        )}
      </SharedModal>
    </Col>
  );
};

export default UsersPage;
