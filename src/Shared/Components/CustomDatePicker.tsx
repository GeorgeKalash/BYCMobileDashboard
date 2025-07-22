import React, { useEffect, useState, forwardRef } from "react";
import { FormGroup, Label } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "react-feather";

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
  selectYear?: boolean;
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
    const [m, y] = parts.map(Number);
    return new Date(y, m - 1, 1);
  } else if (parts.length === 3) {
    const [m, d, y] = parts.map(Number);
    return new Date(y, m - 1, d);
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
  placeholder = "Select...",
  mode = "date",
  selectYear = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    parseDate(value)
  );

  useEffect(() => {
    setSelectedDate(parseDate(value));
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (!date) return onChange?.(null);

    const formatted =
      mode === "monthYear" ? formatToMMYYYY(date) : formatToMMDDYYYY(date);
    onChange?.(formatted);
  };

  const CustomInput = forwardRef<HTMLDivElement, any>(
    ({ value: displayValue, onClick }, ref) => (
      <div
        className="form-control form-select d-flex align-items-center justify-content-between"
        onClick={onClick}
        ref={ref}
        style={{ cursor: readOnly ? "not-allowed" : "pointer" }}
      >
        <span>{selectedDate ? displayValue : placeholder}</span>
        <Calendar size={16} />
      </div>
    )
  );

  return (
    <FormGroup>
      {label && (
        <Label>
          {label} {isRequired && <span className="text-danger">*</span>}
        </Label>
      )}
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        name={name}
        readOnly={readOnly}
        minDate={new Date(1950, 0, 1)}
        maxDate={new Date()}
        placeholderText={placeholder}
        dateFormat={mode === "monthYear" ? "MM/yyyy" : "dd/MM/yyyy"}
        customInput={<CustomInput />}
        showMonthDropdown={mode === "date"}
        showYearDropdown={mode === "date" && selectYear}
        dropdownMode="select"
        showMonthYearPicker={mode === "monthYear"}
        scrollableYearDropdown={selectYear || mode === "monthYear"}
        yearDropdownItemNumber={new Date().getFullYear() - 1950 + 1}
        renderMonthContent={renderMonthContent}
        popperModifiers={[
          {
            name: "zIndex",
            enabled: true,
            phase: "write",
            fn: ({ state }) => {
              Object.assign(state.styles.popper, { zIndex: 1055 });
            },
          },
        ]}
      />
    </FormGroup>
  );
};

export default CustomDatePicker;
