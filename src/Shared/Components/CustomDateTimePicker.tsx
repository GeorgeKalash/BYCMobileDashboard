import React, { useEffect, useState, forwardRef } from "react";
import { FormGroup, Label } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, XCircle } from "react-feather";

interface CustomDateTimePickerProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  value?: string; // Format: MM-DD-YYYY HH:mm
  onChange?: (value: string | null) => void;
  readOnly?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

const formatToMMDDYYYYHHmm = (date: Date): string =>
  `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}-${date.getFullYear()} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const parseDateTime = (value?: string): Date | null => {
  if (!value) return null;
  const [datePart, timePart] = value.split(" ");
  if (!datePart) return null;
  const [month, day, year] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart
    ? timePart.split(":").map(Number)
    : [0, 0];
  return new Date(year, month - 1, day, hours, minutes);
};

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
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
    parseDateTime(value)
  );

  useEffect(() => {
    setSelectedDateTime(parseDateTime(value));
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDateTime(date);
    const formatted = date ? formatToMMDDYYYYHHmm(date) : null;
    onChange?.(formatted);
  };

  const CustomInput = forwardRef<HTMLDivElement, any>(
    ({ value, onClick }, ref) => (
      <div
        className="form-control form-select d-flex align-items-center justify-content-between"
        onClick={!readOnly ? onClick : undefined}
        ref={ref}
        style={{
          width: "100%",
          minWidth: "200px",
          paddingRight: "3rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          position: "relative",
        }}
      >
        <span className="text-truncate">
          {selectedDateTime
            ? selectedDateTime.toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : placeholder}
        </span>

        {!readOnly && selectedDateTime && (
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
    <FormGroup>
      {label && (
        <Label>
          {label} {isRequired && <span className="text-danger">*</span>}
        </Label>
      )}
      <DatePicker
        selected={selectedDateTime}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        name={name}
        readOnly={readOnly}
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy HH:mm"
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
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
export { parseDateTime }; // Export for UsersPage to use
