"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody, Col } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "@/Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { FormikProps } from "formik";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { NotificationAlertRepository } from "@/Repositories/NotificationAlert";
import NotificationTypeForm from "./Form/NotificationTypeForm";

const Notification_Type = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ id: any; key: string; value: string }[]>(
    []
  );

  const [modalState, setModalState] = useState({
    open: false,
    action: null as "add" | "edit" | null,
    row: null as any,
  });

  const formikRef = useRef<FormikProps<any>>(null);

  const fetchData = async () => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: `${NotificationAlertRepository.NotificationTypes.getAll}`,
          parameters: "",
        })
      )
    );

    const keyValuePairs = result?.payload?.data;

    if (Array.isArray(keyValuePairs)) {
      const transformed = keyValuePairs.map((item: any) => ({
        id: item.key,
        key: item.key,
        value: item.value,
      }));
      setData(transformed);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: t("Type"),
      selector: (row: any) => row.value || "-",
      sortable: true,
      id: "type",
    },
  ];

  const openModal = (row: any = null, action: "add" | "edit" = "add") => {
    setModalState({
      open: true,
      action,
      row,
    });
  };

  const handleModalClose = () => {
    setModalState({
      open: false,
      action: null,
      row: null,
    });
    fetchData();
  };

  const handleSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader
          title={t("Notification Type")}
          onAdd={() => openModal()}
        />
        <CardBody>
          <DataTable
            title={t("New Message")}
            data={data}
            columns={columns}
            highlightOnHover
            pagination
            showActions={true}
            onEdit={(row) => openModal(row, "edit")}
            Search={true}
            searchableColumns={["value"]}
          />
        </CardBody>
      </Card>
      <SharedModal
        visible={modalState.open}
        onClose={handleModalClose}
        title={
          modalState.action === "add"
            ? t("Add Notification Type")
            : t("Edit Notification Type")
        }
        width="600px"
        height="60vh"
        onSubmit={handleSubmit}
      >
        <NotificationTypeForm
          rowData={modalState.row}
          formikRef={formikRef}
          modalAction={modalState.action}
          onSuccessSubmit={handleModalClose}
        />
      </SharedModal>
    </Col>
  );
};

export default Notification_Type;
