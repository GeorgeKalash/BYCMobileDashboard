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
import SharedButton from "@/Shared/Components/SharedButton";
type FileItem = { file: File; Link: string };

type Column = {
  key: string;
  title: string;
  style?: React.CSSProperties;
};

type SortableFileTableProps = {
  files: FileItem[];
  onChange: (updatedFiles: FileItem[]) => void;
  columns: Column[];
};

const SortableFileTable = ({
  files,
  onChange,
  columns,
}: SortableFileTableProps) => {
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
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            height: "60vh",
          }}
        >
          <Table hover responsive>
            <thead
              style={{
                background: "#f7f7f7",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <tr>
                {columns.map((col) => (
                  <th key={col.key} style={col.style}>
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {files.map(({ file, Link }, index) => (
                <SortableRow
                  key={`${file.name}-${index}`}
                  id={file.name}
                  index={index}
                  file={file}
                  Link={Link}
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
}: {
  id: string;
  index: number;
  file: File;
  Link: string;
  onRemove: () => void;
  onLinkChange: (newDesc: string) => void;
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
          title="Drag to reorder"
        >
          ⠿
        </span>
      </td>
      <td>
        <img
          src={previewUrl}
          alt={`Preview ${index + 1}`}
          style={{
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
          placeholder="Add Link"
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
        <SharedButton
          title="Remove"
          onClick={onRemove}
          color="danger"
          outline={true}
          size="sm"
        />
      </td>
    </tr>
  );
};

export default SortableFileTable;
