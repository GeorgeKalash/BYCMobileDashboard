"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Label, Input } from "reactstrap";

const DataTableComponent = ({
  title,
  data,
  columns,
  localStorageKey = "genericDataTable",
  defaultSortColumn = "field",
  highlightOnHover = false,
  direction = "ltr",
  pagination = true,
  showActions = false,
  showEdit = true,
  showDelete = true,
  onEdit,
  onDelete,
}: {
  title?: string;
  data: any[];
  columns: any[];
  localStorageKey?: string;
  defaultSortColumn?: string;
  highlightOnHover?: boolean;
  direction?: "ltr" | "rtl";
  pagination?: boolean;
  showActions?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}) => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const storedFilter = localStorage.getItem(`${localStorageKey}Filter`);
    const storedPage = localStorage.getItem(`${localStorageKey}Page`);
    const storedSort = localStorage.getItem(`${localStorageKey}Sort`);

    if (storedFilter) setFilterText(storedFilter);
    if (storedPage) setCurrentPage(Number(storedPage));
    if (storedSort) {
      const { column, direction } = JSON.parse(storedSort);
      setSortColumn(column);
      setSortDirection(direction);
    }
  }, [localStorageKey]);

  useEffect(() => {
    localStorage.setItem(`${localStorageKey}Filter`, filterText);
    localStorage.setItem(`${localStorageKey}Page`, currentPage.toString());
    localStorage.setItem(
      `${localStorageKey}Sort`,
      JSON.stringify({ column: sortColumn, direction: sortDirection })
    );
  }, [filterText, currentPage, sortColumn, sortDirection, localStorageKey]);

  const filteredItems = useMemo(
    () =>
      data.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(filterText.toLowerCase())
      ),
    [data, filterText]
  );

  const sortedData = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aVal = a[sortColumn]?.toString() ?? "";
      const bVal = b[sortColumn]?.toString() ?? "";
      const result = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredItems, sortColumn, sortDirection]);

  const actionColumn = {
    name: "Actions",
    cell: (row: any) => (
      <div className="d-flex gap-2">
        {showEdit && (
          <i
            className="fa fa-edit text-primary cursor-pointer"
            style={{ fontSize: "20px" }}
            onClick={() => onEdit?.(row)}
            title="Edit"
          />
        )}
        {showDelete && (
          <i
            className="fa fa-trash text-danger cursor-pointer"
            style={{ fontSize: "20px" }}
            onClick={() => onDelete?.(row)}
            title="Delete"
          />
        )}
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    id: "actions",
  };

  const finalColumns = useMemo(
    () => (showActions ? [...columns, actionColumn] : columns),
    [columns, showActions, showEdit, showDelete]
  );

  return (
    <>
      <div
        className="dataTables_filter d-flex justify-content-end align-items-center mb-3"
        style={{ maxWidth: "250px", marginLeft: "auto" }}
      >
        <Label className="me-2 mb-0">Search:</Label>
        <Input
          type="search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ width: "150px" }}
        />
      </div>
      <div
        className="theme-scrollbar border rounded shadow-sm"
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <DataTable
          columns={finalColumns}
          data={sortedData}
          striped
          highlightOnHover={highlightOnHover}
          paginationDefaultPage={currentPage}
          paginationPerPage={5}
          persistTableHead
          onChangePage={(page) => setCurrentPage(page)}
          sortServer
          pagination={pagination}
          onSort={(column, direction) => {
            setSortColumn(column.id);
            setSortDirection(direction);
          }}
          noHeader
          className="theme-scrollbar"
        />
      </div>
    </>
  );
};

export default DataTableComponent;
