"use client";

import React, { useMemo, useState } from "react";
import { Button, Card, CardBody, Col } from "reactstrap";
import DataTable from "../../../../../Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedModal from "../../../../../Shared/Components/SharedModal";
import { useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";

const LanguageSelection = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"edit" | "delete" | null>(
    null
  );

  const [languages, setLanguages] = useState([
    { id: "en", name: "English", active: true },
    { id: "ar", name: "العربية", active: true },
    { id: "fr", name: "Français", active: false },
    { id: "es", name: "Español", active: true },
    { id: "de", name: "Deutsch", active: true },
    { id: "ru", name: "Русский", active: false },
    { id: "zh", name: "中文", active: true },
    { id: "ja", name: "日本語", active: true },
    { id: "tr", name: "Türkçe", active: false },
    { id: "it", name: "Italiano", active: true },
    { id: "pt", name: "Português", active: false },
    { id: "ko", name: "한국어", active: true },
    { id: "hi", name: "हिन्दी", active: false },
    { id: "sw", name: "Kiswahili", active: true },
    { id: "fa", name: "فارسی", active: true },
  ]);

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

  const filteredLanguages = useMemo(() => {
    return languages.filter((lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [languages, searchQuery]);

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
            data={filteredLanguages}
            columns={columns}
            localStorageKey="language_table"
            highlightOnHover
            direction="rtl"
            pagination
            showActions
            showEdit={true}
            showDelete={true}
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
        footer={
          <>
            <Button color="secondary" onClick={handleModalClose}>
              {t("Cancel")}
            </Button>
            <Button color="primary">{t("Save Changes")}</Button>
          </>
        }
      >
        <p>{t("You are editing")}:</p>
        <pre>{JSON.stringify(selectedRow, null, 2)}</pre>
      </SharedModal>

      <SharedModal
        visible={modalOpen && modalAction === "delete"}
        onClose={handleModalClose}
        title={t("Delete Language")}
        width="900px"
        height="60vh"
        footer={
          <>
            <Button color="secondary" onClick={handleModalClose}>
              {t("Cancel")}
            </Button>
            <Button color="danger">{t("Confirm Delete")}</Button>
          </>
        }
      >
        <p>{t("Are you sure you want to delete")}:</p>
        <pre>{JSON.stringify(selectedRow, null, 2)}</pre>
      </SharedModal>
    </Col>
  );
};

export default LanguageSelection;
