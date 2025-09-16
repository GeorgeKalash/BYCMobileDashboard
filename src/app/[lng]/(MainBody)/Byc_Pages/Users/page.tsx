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
import CustomDateTimePicker, {
  parseDateTime,
} from "@/Shared/Components/CustomDateTimePicker";

const UsersPage = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [modalState, setModalState] = useState({
    open: false,
    row: null as any,
  });
  const [paginationState, setPaginationState] = useState({
    pageCount: 0,
    totalRows: 0,
  });

  const [filters, setFilters] = useState({
    fromCreationDate: "",
    toCreationDate: "",
    fromBirthDate: "",
    toBirthDate: "",
    username: "",
    phoneNumber: "",
    nationalityId: null as number | null,
    idNo: "",
    sponsors: "",
    cityId: null as number | null,
    street: "",
    lastLogin: "",
    userMode: null as number | null,
    countryId: null as number | null,
  });

  const pageSize = 30;
  const formikRef = useRef<FormikProps<any>>(null);
  const formLogicRef = useRef<UsersFormHandle>(null);

  const fetchData = async (page = 0) => {
    const payload = {
      startAt: page,
      pageSize,
      filters: {
        fromBirthDate: filters.fromBirthDate
          ? new Date(filters.fromBirthDate).toISOString()
          : null,
        toBirthDate: filters.toBirthDate
          ? new Date(filters.toBirthDate).toISOString()
          : null,
        username: filters.username || null,
        nationalityId: filters.nationalityId ?? null,
        idNo: filters.idNo || null,
        sponsors: filters.sponsors ? [filters.sponsors] : [],
        cityId: filters.cityId ?? null,
        street: filters.street || "",
        lastLogin: filters.lastLogin
          ? parseDateTime(filters.lastLogin)?.toISOString()
          : null,
        fromCreationDate: filters.fromCreationDate
          ? new Date(filters.fromCreationDate).toISOString()
          : null,
        toCreationDate: filters.toCreationDate
          ? new Date(filters.toCreationDate).toISOString()
          : null,
        userMode: filters.userMode ?? null,
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
    return () =>
      window.removeEventListener("refreshUsersTable", refreshHandler);
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

  const handleOTPPress = () => formLogicRef.current?.openOtpModal();
  const handleInfoClick = () => formLogicRef.current?.logFormValues();
  const handleUserInfoPress = () => formLogicRef.current?.openUserInfoModal();
  const handleUserControlPress = () =>
    formLogicRef.current?.openUserControlModal();

  const columns = [
    { name: t("username"), selector: (row: any) => row.user?.username ?? "" },
    {
      name: t("Name"),
      selector: (row: any) => row.clientMaster?.name ?? "",
    },
    {
      name: t("Phone Number"),
      selector: (row: any) => row.clientMaster?.cellPhone ?? "",
    },
    {
      name: t("Nationality"),
      selector: (row: any) => row.clientMaster?.nationalityName ?? "",
    },
    {
      name: t("ID Number"),
      selector: (row: any) => row.clientRemittance?.idNo ?? "",
    },
    { name: t("City"), selector: (row: any) => row.address?.city ?? "" },
    {
      name: t("District"),
      selector: (row: any) => row.address?.cityDistrict ?? "",
    },
    { name: t("Street"), selector: (row: any) => row.address?.street1 ?? "" },
    {
      name: t("Active"),
      cell: (row: any) => (
        <span
          style={{
            color: row.user?.isInactive ? "red" : "green",
            fontWeight: "bold",
          }}
        >
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
          <Row className="g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            <Col>
              <CustomDatePicker
                name="fromCreationDate"
                label={t("From Creation Date")}
                value={filters.fromCreationDate}
                onChange={(v) =>
                  handleFilterChange("fromCreationDate", v || "")
                }
              />
            </Col>

            <Col>
              <CustomDatePicker
                name="toCreationDate"
                label={t("To Creation Date")}
                value={filters.toCreationDate}
                onChange={(v) => handleFilterChange("toCreationDate", v || "")}
              />
            </Col>

            <Col>
              <CustomInput
                name="phoneNumber"
                label={t("Phone Number")}
                placeholder={t("Search by Phone Number")}
                value={filters.phoneNumber}
                onChange={(e) =>
                  handleFilterChange(
                    "phoneNumber",
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            </Col>

            <Col>
              <CustomInput
                name="idNumber"
                label={t("ID Number")}
                placeholder={t("Search by ID Number")}
                value={filters.idNo}
                onChange={(e) =>
                  handleFilterChange("idNo", e.target.value.replace(/\D/g, ""))
                }
              />
            </Col>

            <Col>
              <CustomInput
                name="street"
                label={t("Street")}
                placeholder={t("Search by Street")}
                value={filters.street}
                onChange={(e) => handleFilterChange("street", e.target.value)}
              />
            </Col>

            <Col>
              <CustomDateTimePicker
                name="lastLogin"
                label={t("Last Login")}
                value={filters.lastLogin}
                onChange={(v) => handleFilterChange("lastLogin", v || "")}
              />
            </Col>

            <Col>
              <CustomSelect
                name="nationality"
                label={t("Nationality")}
                value={filters.nationalityId ?? ""}
                onChange={(val) =>
                  handleFilterChange("nationalityId", val ?? null)
                }
                endpointId={DashboardMobileRepository.country.getall}
                labelKey="name"
                valueKey="recordId"
              />
            </Col>

            <Col>
              <CustomSelect
                name="country"
                label={t("Country Of Residence")}
                value={filters.countryId ?? ""}
                onChange={(val) => {
                  handleFilterChange("countryId", val ?? null);
                  handleFilterChange("cityId", null);
                }}
                endpointId={DashboardMobileRepository.country.getall}
                labelKey="name"
                valueKey="recordId"
              />
            </Col>

            <Col>
              <CustomSelect
                name="city"
                label={t("City")}
                value={filters.cityId ?? ""}
                onChange={(val) => handleFilterChange("cityId", val ?? null)}
                endpointId={DashboardMobileRepository.city.getall}
                parameters={`_countryId=${filters.countryId}`}
                readOnly={!filters.countryId}
                labelKey="name"
                valueKey="recordId"
              />
            </Col>

            <Col>
              <CustomSelect
                name="userMode"
                label={t("User Mode")}
                dashboardDatasetId={3}
                valueKey="key"
                labelKey="value"
                value={filters.userMode ?? undefined}
                onChange={(val) => handleFilterChange("userMode", val ?? null)}
              />
            </Col>
            <Col className="d-flex align-items-center gap-2">
              <SharedButton
                className="ms-auto"
                title={t("Filter")}
                onClick={() => fetchData(0)}
              />
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
            showActions
            onEdit={openModal}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalState.open}
        onClose={handleModalClose}
        title={t("User")}
        width="50vw"
        height="47vh"
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
