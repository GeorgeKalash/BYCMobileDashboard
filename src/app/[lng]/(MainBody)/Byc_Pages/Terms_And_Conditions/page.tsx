"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { deleteMobileRequest, getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { FormikProps } from "formik";
import { withRequestTracking } from "@/utils/withRequestTracking";
import TermsAndConditionsForm from "./Forms/TermsAndConditionsForm";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import CustomInput from "@/Shared/Components/CustomInput";
import formatDate from "@/utils/DateFormatter";
import { showToast } from "@/Shared/Components/showToast";

const TermsAndConditions = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit" | null>(null);
  const [version, setVersion] = useState<string>(""); 
  const [pageCount, setPageCount] = useState(0);
  const formikRef = useRef<FormikProps<any>>(null);

  const pageSize = 30;

  const fetchData = async (count: number) => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.TermsAndConditions.page,
          parameters: `_version=${version || ""}&_startAt=${count}&_pageSize=${pageSize}`,
        })
      )
    );

    const rows = result?.payload?.data?.list;
    setData(Array.isArray(rows) ? rows : []);
  };

  useEffect(() => {
    fetchData(pageCount);
  }, [pageCount]);

  useEffect(() => {
    setPageCount(0);
    fetchData(0);
  }, [version]);

  const handleModalOpen = (row: any, action: "edit") => {
    setSelectedRow(row);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setModalAction(null);
    fetchData(pageCount);
  };

  const handleSubmit = () => {
    formikRef.current?.submitForm();
  };

  const columns = [
    {
      name: t("version"),
      selector: (row: any) => row.version || "",
      sortable: true,
    },
    {
      name: t("publishingDate"),
      selector: (row: any) =>
        row.publishingDate ? formatDate(row.publishingDate, "dd/MM/yyyy") : "",
      sortable: true,
      id: "publishingDate",
    },
  ];

  const onAdd = () => {
    setSelectedRow(null);
    setModalAction("add");
    setModalOpen(true);
  };

    const handleDelete = async (row: any) => {
      if (!row?.recordId) return;
  
      await withRequestTracking(dispatch, () =>
        dispatch(
          deleteMobileRequest({
            extension: DashboardMobileRepository.TermsAndConditions.delete,
            parameters:`_recordId=${row.recordId}`,
            rawBody: false,
          })
        ).unwrap()
      );
      showToast("success", t("Deleted successfully"));
      fetchData(pageCount);
    };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("TermsAndConditions")} onAdd={onAdd}>
          <div style={{ minWidth: 250, maxWidth: 400, width: "100%" }}>
            <CustomInput
              name="header.version"
              value={version}
              label={t("version")}
              type="text"
              onChange={(e) => {
                const val = e.target.value;
                let cleaned = val.replace(/[^0-9.]/g, "");
                setVersion(cleaned);
              }}
            />
          </div>
        </CommonCardHeader>
        <CardBody>
          <DataTable
            title="Terms_And_Conditions_Table"
            data={data}
            columns={columns}
            highlightOnHover
            onDelete={handleDelete}
            pagination
            showActions
            onEdit={(row) => handleModalOpen(row, "edit")}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalOpen}
        onClose={handleModalClose}
        title={modalAction === "add" ? t("Add Text") : t("Edit Text")}
        width="600px"
        height="40vh"
        onSubmit={handleSubmit}
      >
        <TermsAndConditionsForm
          recordId={selectedRow?.recordId ?? 0}
          formikRef={formikRef}
          modalAction={modalAction}
          onSuccessSubmit={handleModalClose}
        />
      </SharedModal>
    </Col>
  );
};

export default TermsAndConditions;
