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
}

const formatToMMDDYYYY = (date: Date): string =>
  `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}-${date.getFullYear()}`;

const parseDate = (value?: string): Date | null => {
  if (!value) return null;
  const [month, day, year] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  name,
  label = "",
  isRequired = false,
  value,
  onChange,
  readOnly = false,
  minDate,
  maxDate,
  placeholder = "Select a date...",
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    parseDate(value)
  );

  useEffect(() => {
    setSelectedDate(parseDate(value));
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const formatted = date ? formatToMMDDYYYY(date) : null;
    onChange?.(formatted);
  };

  const CustomInput = forwardRef<HTMLDivElement, any>(
    ({ value, onClick }, ref) => (
      <div
        className="form-control form-select d-flex align-items-center justify-content-between"
        onClick={onClick}
        ref={ref}
        style={{ cursor: readOnly ? "not-allowed" : "pointer" }}
      >
        <span>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-GB")
            : placeholder}
        </span>
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
        minDate={minDate}
        maxDate={maxDate}
        name={name}
        readOnly={readOnly}
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy"
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

export default CustomDatePicker;
