import React, { useEffect, useState, forwardRef } from "react";
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
  placeholder = "Select a date",
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
        className="form-control d-flex align-items-center justify-content-between"
        style={{
          height: "38px",
          padding: "6px 12px",
          borderRadius: ".25rem",
          fontSize: "0.875rem",
          cursor: readOnly ? "not-allowed" : "pointer",
        }}
        onClick={onClick}
        ref={ref}
      >
        <span style={{ fontSize: 15 }}>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-GB")
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
    )
  );

  return (
    <FormGroup style={{ display: "flex", flexDirection: "column" }}>
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
