"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { SystemMobileRepository } from "@/Repositories/SystemMobileRepository";
import ActivateLanguageForm from "./Form/ActivateLanguageForm";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { FormikProps } from "formik";

const LanguageSelection = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"edit" | "delete" | null>(null);

  const formikRef = useRef<FormikProps<any>>(null); 

  const fetchData = async () => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: `${SystemMobileRepository.Languages.get}`,
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

  const handleModalOpen = (row: any, action: "edit" | "delete") => {
    setSelectedRow(row);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setModalAction(null);
    fetchData();
  };

  const handleSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const columns = [
    {
      name: t("Translation Name"),
      selector: (row: any) => row.name || "-",
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
        <CommonCardHeader title={t("Languages Page")} />
        <CardBody>
          <DataTable
            title="language_table"
            data={data}
            columns={columns}
            highlightOnHover
            pagination
            showActions
            onEdit={(row) => handleModalOpen(row, "edit")}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalOpen && modalAction === "edit"}
        onClose={handleModalClose}
        title={t("Languages Page")}
        width="600px"
        height="60vh"
        onSubmit={handleSubmit} 
      >
        <ActivateLanguageForm
          rowData={selectedRow}
          formikRef={formikRef}
          onSuccessSubmit={handleModalClose} 
        />
      </SharedModal>
    </Col>
  );
};

export default LanguageSelection;
