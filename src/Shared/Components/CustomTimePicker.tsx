import React, { useEffect, useState, forwardRef } from "react";
import { FormGroup, Label } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "react-feather";
import SharedButton from "@/Shared/Components/SharedButton";

interface CustomTimePickerProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (value: string | null) => void;
  readOnly?: boolean;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  showNowButton?: boolean;
  datePickerDisabled?: boolean;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  name,
  label = "",
  isRequired = false,
  value,
  onChange,
  readOnly = false,
  placeholder = "Select date and time...",
  minDate,
  maxDate,
  showNowButton = false,
  datePickerDisabled = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  useEffect(() => {
    setSelectedDate(value ? new Date(value) : null);
  }, [value]);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange?.(date ? date.toISOString() : null);
  };

  const setNow = () => {
    const now = new Date();
    handleChange(now);
  };

  const CustomInput = forwardRef<HTMLDivElement, any>(({ onClick }, ref) => (
    <div
      ref={ref}
      onClick={!readOnly && !datePickerDisabled ? onClick : undefined}
      className={`form-control d-flex align-items-center justify-content-between ${
        !readOnly && !datePickerDisabled ? "form-select" : ""
      }`}
      style={{
        cursor: readOnly || datePickerDisabled ? "default" : "pointer",
        width: "100%",
        opacity: readOnly || datePickerDisabled ? 0.7 : 1,
        appearance: readOnly || datePickerDisabled ? "none" : undefined,
        WebkitAppearance: readOnly || datePickerDisabled ? "none" : undefined,
        backgroundImage: readOnly || datePickerDisabled ? "none" : undefined,
      }}
    >
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
        {selectedDate
          ? selectedDate.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : placeholder}
      </span>

      {!readOnly && !datePickerDisabled && <Calendar size={16} />}
    </div>
  ));
  CustomInput.displayName = "CustomDateInput";

  return (
    <FormGroup className="w-100">
      {label && (
        <Label>
          {label} {isRequired && <span className="text-danger">*</span>}
        </Label>
      )}
      <div
        className="d-flex align-items-center"
        style={{ gap: "0.5rem", flexWrap: "nowrap" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            showTimeSelect
            timeIntervals={15}
            dateFormat="dd/MM/yyyy h:mm aa"
            placeholderText={placeholder}
            readOnly={readOnly}
            disabled={datePickerDisabled}
            minDate={minDate}
            maxDate={maxDate}
            name={name}
            customInput={<CustomInput />}
            showPopperArrow={false}
            popperPlacement="bottom-start"
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
        </div>
        {showNowButton && (
          <SharedButton
            title="Now"
            size="sm"
            type="button"
            color="secondary"
            onClick={setNow}
          />
        )}
      </div>
    </FormGroup>
  );
};

export default CustomTimePicker;
