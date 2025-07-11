"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col } from "reactstrap";
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
import UsersForm, { UsersFormHandle } from "./Forms/UsersForm";

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

  const pageSize = 30;
  const formikRef = useRef<FormikProps<any>>(null);

  const fetchData = async (page = 0) => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.MobileUser.page,
          parameters: `&_startAt=${page}&_pageSize=${pageSize}`,
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

  const columns = [
    {
      name: t("Username"),
      selector: (row: any) => row.username,
      sortable: true,
      id: "username",
    },
    {
      name: t("Active"),
      cell: (row: any) => (
        <span
          style={{
            color: row.isInactive ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {row.isInactive ? t("Inactive") : t("Active")}
        </span>
      ),
      sortable: true,
      id: "isInactive",
    },
    {
      name: t("emailValidTo"),
      selector: (row: any) =>
        row.emailValidTo ? formatDate(row.emailValidTo, "dd/MM/yyyy") : "",
      sortable: true,
      id: "emailValidTo",
    },
    {
      name: t("deviceIMEI"),
      selector: (row: any) => row.deviceIMEI,
      sortable: true,
      id: "deviceIMEI",
    },
  ];

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

  const formLogicRef = useRef<UsersFormHandle>(null);

  const handleInfoClick = () => {
    formLogicRef.current?.logFormValues();
  };

  const handleSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const handlePageChange = (startAt: number) => {
    setPaginationState((prev) => ({
      ...prev,
      pageCount: startAt,
    }));
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Users")} />
        <CardBody>
          <DataTable
            title={t("Users")}
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
        width="50vw"
        height="70vh"
        onSubmit={handleSubmit}
        onInfoClick={handleInfoClick}
      >
        {modalState.row && (
          <UsersForm
            ref={formLogicRef}
            userId={modalState.row.username.replace(/\+/g, "%2B")}
            formikRef={formikRef}
            onSuccessSubmit={handleModalClose}
          />
        )}
      </SharedModal>
    </Col>
  );
};

export default UsersPage;
