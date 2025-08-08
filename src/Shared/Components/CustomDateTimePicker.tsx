import React, { useEffect, useState, forwardRef } from "react";
import { FormGroup, Label } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, XCircle } from "react-feather";

interface CustomDateTimePickerProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (value: string | null) => void;
  readOnly?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  mode?: "dateTime" | "monthYear";
}

const formatToMMDDYYYYHHmm = (date: Date): string =>
  `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}-${date.getFullYear()} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const formatToMMYYYY = (date: Date): string =>
  `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

const parseDateTime = (
  value?: string,
  mode: "dateTime" | "monthYear" = "dateTime"
): Date | null => {
  if (!value) return null;
  if (mode === "monthYear") {
    const [month, year] = value.split("-").map(Number);
    if (!month || !year) return null;
    return new Date(year, month - 1, 1);
  }
  const [datePart, timePart] = value.split(" ");
  if (!datePart) return null;
  const [month, day, year] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart ? timePart.split(":").map(Number) : [0, 0];
  return new Date(year, month - 1, day, hours, minutes);
};

const renderMonthContent = (month: number) => (
  <span>{(month + 1).toString().padStart(2, "0")}</span>
);

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  name,
  label = "",
  isRequired = false,
  value,
  onChange,
  readOnly = false,
  minDate,
  maxDate,
  placeholder = "Select date & time...",
  mode = "dateTime",
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    parseDateTime(value, mode)
  );

  useEffect(() => {
    setSelectedDate(parseDateTime(value, mode));
  }, [value, mode]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    let formatted: string | null = null;
    if (date) {
      formatted =
        mode === "monthYear" ? formatToMMYYYY(date) : formatToMMDDYYYYHHmm(date);
    }
    onChange?.(formatted);
  };

  const CustomInput = forwardRef<HTMLDivElement, any>(({ onClick }, ref) => (
    <div
      className="form-control form-select d-flex align-items-center justify-content-between"
      onClick={!readOnly ? onClick : undefined}
      ref={ref}
      style={{
        width: "100%",
        minHeight: "38px",
        paddingRight: "3rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        cursor: readOnly ? "not-allowed" : "pointer",
      }}
    >
      <span className="text-truncate">
        {selectedDate
          ? selectedDate.toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              ...(mode === "dateTime" && { day: "2-digit" }),
              ...(mode === "dateTime" && {
                hour: "2-digit",
                minute: "2-digit",
              }),
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
            right: "2rem",
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
          right: "0.75rem",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
    </div>
  ));

  return (
    <FormGroup style={{ display: "flex", flexDirection: "column" }}>
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
        dateFormat={mode === "monthYear" ? "MM/yyyy" : "dd/MM/yyyy HH:mm"}
        showTimeSelect={mode === "dateTime"}
        timeFormat="HH:mm"
        timeIntervals={15}
        showMonthYearPicker={mode === "monthYear"}
        showMonthDropdown={mode === "dateTime"}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        renderMonthContent={renderMonthContent}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        customInput={<CustomInput />}
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
    </FormGroup>
  );
};

export default CustomDateTimePicker;
export { parseDateTime };
