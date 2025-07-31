"use client";

import React, { useState } from "react";
import { Col, FormGroup, Row } from "reactstrap";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";
import CustomSelect from "@/Shared/Components/CustomSelect";
import DataTableComponent from "@/Shared/Components/DataTable";

interface TransactionLogProps {
  data: any[];
  columns: any[];
  showActions?: boolean;
  pagination?: boolean;
  searchType?: "local" | "server";
  totalRows?: number;
  pageSize?: number;
  dataSetId?: number | string;

  onPageChange?: (count: number) => void;
  onDelete?: (row: any) => void;
  onEdit?: (row: any) => void;
  onSearchChange?: (value: string) => void;
}

const TransactionLog = ({
  data,
  columns,
  dataSetId,
  showActions = false,
  pagination = false,
  searchType = "server",
  totalRows,
  pageSize = 50,
  onPageChange,
  onEdit,
  onSearchChange,
}: TransactionLogProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const { t } = useTranslation(
    useAppSelector((state) => state.langSlice.i18LangStatus)
  );
  const handleEdit = (row: any) => {
    setSelectedTransaction(row);
    onEdit?.(row);
  };
  return (
    <>
      <FormGroup>
        <Col md={6} className="mb-4">
          <CustomSelect
            name="transactionActions"
            label={t("Select Action")}
            dataSetId={dataSetId}
            value={phoneNumber}
            onChange={(val) => {
              setPhoneNumber(val?.toString() || "");
              setSelectedTransaction(null);
              onSearchChange?.(val?.toString() || "");
            }}
            isRequired={true}
            clearable={true}
          />
        </Col>
      </FormGroup>

      <DataTableComponent
        title={t("Transaction Logs")}
        data={data}
        columns={columns}
        pagination={pagination}
        serverPagination={searchType === "server"}
        totalRows={totalRows}
        pageSize={pageSize}
        onPageChange={onPageChange}
        showActions={showActions}
        onEdit={handleEdit}
      />
      {selectedTransaction?.data &&
        (() => {
          try {
            const parsed = JSON.parse(selectedTransaction.data);
            return (
              <Col md={12} className="mt-4">
                <div>
                  <Row>
                    {Object.entries(parsed).map(([key, val]) => (
                      <Col md={9} key={key}>
                        <strong>{t(key)}:</strong>{" "}
                        {Array.isArray(val)
                          ? val.length === 0
                            ? "[]"
                            : JSON.stringify(val)
                          : val === null
                          ? "null"
                          : String(val)}
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>
            );
          } catch (e) {
            return <Col md={12}>{selectedTransaction.data}</Col>;
          }
        })()}
    </>
  );
};

export default TransactionLog;
