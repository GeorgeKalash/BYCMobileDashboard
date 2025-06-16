"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table } from "reactstrap";
import { DragEndEvent } from "@dnd-kit/core";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";

type FileItem = { file: File; Link: string };

type SortableFileTableProps = {
  files: FileItem[];
  onChange: (updatedFiles: FileItem[]) => void;
};

const SortableFileTable = ({ files, onChange }: SortableFileTableProps) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((f) => f.file.name === active.id);
      const newIndex = files.findIndex((f) => f.file.name === over?.id);
      onChange(arrayMove(files, oldIndex, newIndex));
    }
  };

  const handleRemoveFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, newDesc: string) => {
    const updated = [...files];
    updated[index].Link = newDesc;
    onChange(updated);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={files.map((f) => f.file.name)}
        strategy={verticalListSortingStrategy}
      >
        <div
          style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
        >
          <Table bordered hover responsive>
            <thead
              style={{
                background: "#f7f7f7",
                position: "sticky",
                top: "0",
                zIndex: 1,
              }}
            >
              <tr>
                <th>{t("Index")}</th>
                <th style={{ width: "50px", textAlign: "center" }}>
                  {t("Drag")}
                </th>
                <th>{t("Image")}</th>
                <th>{t("Image Link")}</th>
                <th>{t("File Name")}</th>
                <th style={{ width: "100px", textAlign: "center" }}>
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map(({ file, Link }, index) => (
                <SortableRow
                  key={file.name}
                  id={file.name}
                  index={index}
                  file={file}
                  Link={Link}
                  t={t}
                  onRemove={() => handleRemoveFile(index)}
                  onLinkChange={(newDesc) => handleLinkChange(index, newDesc)}
                />
              ))}
            </tbody>
          </Table>
        </div>
      </SortableContext>
    </DndContext>
  );
};

const SortableRow = ({
  id,
  index,
  file,
  Link,
  onRemove,
  onLinkChange,
  t,
}: {
  id: string;
  index: number;
  file: File;
  Link: string;
  onRemove: () => void;
  onLinkChange: (newDesc: string) => void;
  t: (key: string) => string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <tr ref={setNodeRef} style={style}>
      <td>{index + 1}</td>
      <td style={{ textAlign: "center" }}>
        <span
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            fontSize: "20px",
            color: "#555",
            userSelect: "none",
          }}
          title={t("Drag to reorder")}
        >
          ⠿
        </span>
      </td>
      <td>
        <img
          src={previewUrl}
          alt={`Preview ${index + 1}`}
          style={{
            width: "160px",
            height: "60px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            transition: "transform 0.2s ease-in-out",
            cursor: "pointer",
          }}
          title={file.name}
          onClick={() => window.open(previewUrl, "_blank")}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <input
          type="text"
          value={Link}
          onChange={(e) => onLinkChange(e.target.value)}
          placeholder={t("Add Link")}
          style={{
            width: "100%",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "14px",
          }}
        />
      </td>
      <td style={{ verticalAlign: "middle" }}>{file.name}</td>
      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={onRemove}
          type="button"
        >
          {t("Remove")}
        </button>
      </td>
    </tr>
  );
};

export default SortableFileTable;
