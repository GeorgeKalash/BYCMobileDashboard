"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Col } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { SystemMobileRepository } from "@/Repositories/SystemMobileRepository";

const LanguageSelection = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const [data, setData] = useState([])
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"edit" | "delete" | null>(
    null
  );
    const dispatch = useAppDispatch()
  
    const fetchData = async () => {
      const result = await withRequestTracking(dispatch, () =>
        dispatch(getMobileRequest({
          extension: `${SystemMobileRepository.Languages.get}`,
          parameters: ''
        }))
      )
      setData(result.payload.data)
    }
  
    useEffect(() => {
      fetchData()
    }, [])


  const handleModalOpen = (row: any, action: "edit" | "delete") => {
    setSelectedRow(row);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setModalAction(null);
  };

  const columns = [
    {
      name: t("Translation Name"),
      selector: (row: any) => row.name,
      sortable: true,
      id: "name",
    },
    {
      name: t("Active?"),
      cell: (row: any) => (
        <span
          style={{ color: row.active ? "green" : "red", fontWeight: "bold" }}
        >
          {row.active ? t("Active") : t("Inactive")}
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
            title=""
            data={data}
            columns={columns}
            localStorageKey="language_table"
            highlightOnHover
            pagination
            showActions
            showDelete={false}
            onEdit={(row) => handleModalOpen(row, "edit")}
            onDelete={(row) => handleModalOpen(row, "delete")}
          />
        </CardBody>
      </Card>

      <SharedModal
        visible={modalOpen && modalAction === "edit"}
        onClose={handleModalClose}
        title={t("Edit Language")}
        width="600px"
        height="60vh"
        onSubmit={handleModalClose}
      >
        <p>{t("You are editing")}:</p>
        <pre>{JSON.stringify(selectedRow, null, 2)}</pre>
      </SharedModal>
    </Col>
  );
};

export default LanguageSelection;
