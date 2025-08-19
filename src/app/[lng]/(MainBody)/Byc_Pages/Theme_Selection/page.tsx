"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col } from "reactstrap";
import DataTable from "@/Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "@/Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import ActivateThemeForm from "./Form/ActivateThemeForm";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { FormikProps } from "formik";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";

const ThemeSelection = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const formikRef = useRef<FormikProps<any>>(null);

  const fetchData = async () => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: `${DashboardMobileRepository.Templates.get}`,
          parameters: "",
        })
      )
    );

    if (result?.payload?.data && Array.isArray(result.payload.data)) {
      setData(result.payload.data);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModalOpen = (row: any) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
    fetchData();
  };

  const handleSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const columns = [
    {
      name: t("Theme Name"),
      selector: (row: any) => row.name || "",
      sortable: true,
      id: "name",
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
      id: "activeStatus",
    },
  ];

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Activate Theme")} />
        <CardBody>
          <DataTable
            data={data}
            columns={columns}
            highlightOnHover
            pagination
            showActions
            onEdit={(row) => handleModalOpen(row)}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalOpen}
        onClose={handleModalClose}
        title={t("Theme Page")}
        width="60vw"
        height="80vh"
        onSubmit={handleSubmit}
      >
        <ActivateThemeForm
          rowData={selectedRow}
          formikRef={formikRef}
          allData={data}
          onSuccessSubmit={handleModalClose}
        />
      </SharedModal>
    </Col>
  );
};

export default ThemeSelection;
