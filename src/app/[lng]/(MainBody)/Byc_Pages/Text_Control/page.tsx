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
import { FormikProps } from "formik";
import TextControlForm from "./Form/TextControlForm";
import CustomSelect from "@/Shared/Components/CustomSelect";
import { withRequestTracking } from "@/utils/withRequestTracking ";

const TextControl = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ key: string; value: string }[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [languageId, setLanguageId] = useState<1 | 2 | null>(1);
  const [modalAction, setModalAction] = useState<"add" | "edit" | null>(null);

  const formikRef = useRef<FormikProps<any>>(null);

  const fetchData = async () => {
    if (languageId === null) return;

    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: `${SystemMobileRepository.Languages.getAllKeyValuePairs}`,
          parameters: `_languageId=${languageId}`,
        })
      )
    );

    const keyValuePairs = result?.payload?.data?.keyValuePairs;

    if (keyValuePairs && typeof keyValuePairs === "object") {
      const transformed = Object.entries(keyValuePairs).map(([key, value]) => ({
        key,
        value: String(value ?? ""),
      }));
      setData(transformed);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [languageId]);

  const handleModalOpen = (row: any, action: "edit") => {
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
      name: t("Key"),
      selector: (row: any) => row.key || "-",
      sortable: true,
      id: "key",
    },
    {
      name: t("Value"),
      selector: (row: any) => row.value || "-",
      sortable: true,
      id: "value",
    },
  ];

  const onAdd = () => {
    setSelectedRow(null);
    setModalAction("add");
    setModalOpen(true);
  };

  const handleLanguageChange = (e: string | number | null) => {
    if (e === null || e === "") {
      setLanguageId(null);
      return;
    }
  
    const num = Number(e);
    if (num === 1 || num === 2) {
      setLanguageId(num);
    } else {
      setLanguageId(null);
    }
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Text Control")} onAdd={onAdd}>
          <CustomSelect
            name="languageId"
            endpointId={`${SystemMobileRepository.Languages.get}`}
            valueKey="languageId"
            labelKey="name"
            value={languageId ?? ""}
            onChange={handleLanguageChange}
          />
        </CommonCardHeader>
        <CardBody>
          <DataTable
            title="textControl_table"
            data={data}
            columns={columns}
            highlightOnHover
            pagination
            Search={true}
            showActions={true}
            searchableColumns={["key", "value"]}
            onEdit={(row) => handleModalOpen(row, "edit")}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalOpen}
        onClose={handleModalClose}
        title={modalAction === "add" ? t("Add Text") : t("Edit Text")}
        width="600px"
        height="60vh"
        onSubmit={handleSubmit}
      >
        <TextControlForm
          rowData={selectedRow}
          formikRef={formikRef}
          modalAction={modalAction}
          onSuccessSubmit={handleModalClose}
          langId={languageId}
        />
      </SharedModal>
    </Col>
  );
};

export default TextControl;
