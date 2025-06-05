import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Label, Input } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";
import SharedModal from "@/Shared/Components/SharedModal";
const DataTableComponent = ({
  title,
  data,
  columns,
  defaultSortColumn = "field",
  highlightOnHover = false,
  direction = "ltr",
  pagination = true,
  showActions = false,
  Search = false,
  onEdit,
  onDelete,
  serverPagination = false,
  totalRows,
  pageSize = 50,
  onPageChange,
  searchableColumns,
  searchType,
  onSearchChange,
}: {
  title?: string;
  data: any[];
  columns: any[];
  defaultSortColumn?: string;
  highlightOnHover?: boolean;
  direction?: "ltr" | "rtl";
  pagination?: boolean;
  showActions?: boolean;
  Search?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  serverPagination?: boolean;
  totalRows?: number;
  pageSize?: number;
  onPageChange?: (count: number) => void;
  searchableColumns?: string[];
  searchType?: "local" | "server";
  onSearchChange?: (value: string) => void;
}) => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);

  const filteredItems = useMemo(() => {
    if (searchType === "server") return data;
    if (!filterText) return data;

    return data.filter((item) => {
      const valuesToSearch = searchableColumns?.length
        ? searchableColumns.map((col) => item[col])
        : Object.values(item);

      return valuesToSearch
        .join(" ")
        .toLowerCase()
        .includes(filterText.toLowerCase());
    });
  }, [data, filterText, searchableColumns, searchType]);

  const sortedData = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aVal = a[sortColumn]?.toString() ?? "";
      const bVal = b[sortColumn]?.toString() ?? "";
      const result = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredItems, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    if (serverPagination) return data;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [data, sortedData, currentPage, serverPagination]);

  const totalPages = useMemo(() => {
    return serverPagination
      ? Math.ceil((totalRows ?? 0) / pageSize)
      : Math.ceil(sortedData.length / pageSize);
  }, [serverPagination, totalRows, sortedData]);
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);

  const { t } = useTranslation(i18LangStatus);

  const actionColumn = {
    name: "Actions",
    cell: (row: any) => (
      <div className="d-flex gap-2">
        {onEdit && (
          <i
            className="fa fa-edit text-primary cursor-pointer"
            style={{ fontSize: "20px" }}
            onClick={() => onEdit(row)}
            title="Edit"
          />
        )}
        {onDelete && (
          <i
            className="fa fa-trash text-danger cursor-pointer"
            style={{ fontSize: "20px" }}
            onClick={() => {
              setRowToDelete(row);
              setShowDeleteConfirm(true);
            }}
            title="Delete"
          />
        )}
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    id: "actions",
    width: "100px",
  };

  const finalColumns = useMemo(() => {
    const styledColumns = columns.map((col) => {
      return {
        ...col,
        grow: 1,
        wrap: true,
        cell: col.cell
          ? col.cell
          : (row: any) => {
              const val = col.selector ? col.selector(row) : "";
              const text = typeof val === "string" ? val : String(val ?? "");
              return (
                <span title={text}>
                  {text.length > 70 ? text.slice(0, 70) + "..." : text}
                </span>
              );
            },
      };
    });
    return showActions ? [...styledColumns, actionColumn] : styledColumns;
  }, [columns, showActions, onEdit, onDelete]);

  const handlePageChange = (newPage: number, next: boolean) => {
    if (serverPagination && onPageChange) {
      if (next) {
        onPageChange(newPage + 1);
        setCurrentPage(currentPage + 1);
      } else {
        onPageChange(newPage - pageSize + 1);
        setCurrentPage(currentPage - 1);
      }
    } else {
      setCurrentPage((p) =>
        next ? Math.min(p + 1, totalPages) : Math.max(p - 1, 1)
      );
    }
  };
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState(false);
  return (
    <>
      {Search && (
        <div
          className="dataTables_filter d-flex justify-content-end align-items-center mb-3"
          style={{ maxWidth: "250px", marginLeft: "auto" }}
        >
          <Label className="me-2 mb-0">Search:</Label>
          <Input
            type="search"
            value={filterText}
            onChange={(e) => {
              const val = e.target.value;
              setFilterText(val);

              if (searchType === "server") {
                onSearchChange?.(val);
              }
            }}
            style={{ width: "150px" }}
          />
        </div>
      )}

      <div
        className="theme-scrollbar border rounded shadow-sm"
        style={{
          maxHeight: Search ? "60vh" : "68vh",
          overflowY: "auto",
        }}
      >
        <DataTable
          columns={finalColumns}
          data={paginatedData}
          fixedHeader
          striped
          fixedHeaderScrollHeight="67vh"
          highlightOnHover={highlightOnHover}
          persistTableHead
          sortServer
          pagination={false}
          onSort={(column, direction) => {
            const columnId =
              typeof column.id === "string"
                ? column.id
                : String(column.id ?? "");
            setSortColumn(columnId);
            setSortDirection(direction);
          }}
          className="theme-scrollbar"
          customStyles={{
            table: {
              style: {
                tableLayout: "auto",
                width: "100%",
              },
            },
          }}
        />
      </div>

      <SharedModal
        visible={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setRowToDelete(null);
        }}
        title={t("Delete")}
        onSubmit={() => {
          if (onDelete && rowToDelete) {
            onDelete(rowToDelete);
          }
          setShowDeleteConfirm(false);
          setRowToDelete(null);
        }}
        width="400px"
      >
        <p>{t("Are you sure you want to delete the selected record?")}</p>
      </SharedModal>

      {pagination && (
        <div className="d-flex justify-content-between align-items-center gap-2 mt-3 flex-wrap">
          <span className="text-muted ms-2">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="d-flex gap-2 me-2">
            <button
              onClick={() =>
                handlePageChange((currentPage - 1) * pageSize, false)
              }
              className="btn btn-outline-primary btn-sm rounded-pill shadow-sm px-3"
              disabled={currentPage === 1}
            >
              <i className="fa fa-chevron-left me-1" /> Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage * pageSize, true)}
              className="btn btn-outline-primary btn-sm rounded-pill shadow-sm px-3"
              disabled={currentPage === totalPages}
            >
              Next <i className="fa fa-chevron-right ms-1" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DataTableComponent;
