import React, { useEffect, useState, forwardRef } from "react";
import { useFormikContext, useField } from "formik";
import { FormGroup, Label } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, XCircle } from "react-feather";

interface CustomDatePickerProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (value: string | null) => void;
  readOnly?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  mode?: "date" | "monthYear";
}

const formatToMMDDYYYY = (date: Date): string =>
  `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}-${date.getFullYear()}`;

const formatToMMYYYY = (date: Date): string =>
  `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

const parseDate = (value?: string): Date | null => {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length === 2) {
    const [month, year] = parts.map(Number);
    return new Date(year, month - 1, 1);
  } else if (parts.length === 3) {
    const [month, day, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  }
  return null;
};

const renderMonthContent = (month: number) => (
  <span>{(month + 1).toString().padStart(2, "0")}</span>
);

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  name,
  label = "",
  isRequired = false,
  value,
  onChange,
  readOnly = false,
  minDate,
  maxDate,
  placeholder = "Select a date",
  mode = "date",
}) => {
  const formik = useFormikContext();
  const isControlled =
    typeof value !== "undefined" || typeof onChange !== "undefined";

  const [field, meta] = isControlled
    ? [{ name, value, onChange, onBlur: undefined }, {}]
    : useField(name);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    parseDate(isControlled ? (value as string) : field.value)
  );

  const isRtl =
    typeof window !== "undefined" && localStorage.getItem("dir") === "rtl";

  useEffect(() => {
    setSelectedDate(
      parseDate(isControlled ? (value as string) : field.value)
    );
  }, [value, field.value]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);

    const formatted =
      date && mode === "monthYear"
        ? formatToMMYYYY(date)
        : date
        ? formatToMMDDYYYY(date)
        : null;

    if (isControlled) {
      onChange?.(formatted);
    } else {
      formik.setFieldValue(name, formatted);
    }
  };

  const isEmpty = isRequired && !selectedDate;
  const validationClass =
    formik && meta.touched
      ? meta.error || isEmpty
        ? "is-invalid"
        : ""
      : "";

  const CustomInput = forwardRef<HTMLDivElement, any>(
    ({ value, onClick }, ref) => (
      <div
        className={`form-control d-flex align-items-center justify-content-between ${validationClass}`}
        onClick={!readOnly ? onClick : undefined}
        style={{
          height: "38px",
          padding: "6px 12px",
          borderRadius: ".25rem",
          fontSize: "0.875rem",
          cursor: readOnly ? "not-allowed" : "pointer",
          position: "relative",
          direction: isRtl ? "rtl" : "ltr",
        }}
        ref={ref}
      >
        <span className="text-truncate">
          {selectedDate
            ? selectedDate.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                ...(mode === "date" && { day: "2-digit" }),
              })
            : placeholder}
        </span>

        {!readOnly && selectedDate && (
          <XCircle
            size={16}
            className="text-danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDateChange(null);
            }}
            style={{
              position: "absolute",
              [isRtl ? "left" : "right"]: "2rem",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          />
        )}

        <Calendar
          size={16}
          style={{
            position: "absolute",
            [isRtl ? "left" : "right"]: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </div>
    )
  );

  return (
    <FormGroup
      style={{ display: "flex", flexDirection: "column" }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {label && (
        <Label
          htmlFor={name}
          style={{ display: "block", marginBottom: "0.25rem" }}
        >
          {label} {isRequired && <span className="text-danger">*</span>}
        </Label>
      )}
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        name={name}
        readOnly={readOnly}
        placeholderText={placeholder}
        dateFormat={mode === "monthYear" ? "MM/yyyy" : "dd/MM/yyyy"}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        customInput={<CustomInput />}
        showMonthYearPicker={mode === "monthYear"}
        showMonthDropdown={mode === "date"}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        renderMonthContent={renderMonthContent}
        popperModifiers={[
          {
            name: "zIndex",
            enabled: true,
            phase: "write",
            fn: ({ state }) => {
              Object.assign(state.styles.popper, {
                zIndex: 1055,
              });
            },
          },
        ]}
      />
      {formik && meta.touched && meta.error && (
        <div className="invalid-feedback d-block">{meta.error}</div>
      )}
    </FormGroup>
  );
};

export default CustomDatePicker;
