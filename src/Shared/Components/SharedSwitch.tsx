"use client";
import React, { useEffect, useState, forwardRef } from "react";
import { Input, Label } from "reactstrap";

type SharedSwitchProps = {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
};

export const SharedSwitch = forwardRef<HTMLInputElement, SharedSwitchProps>(
  (
    {
      label,
      checked = false,
      disabled = false,
      id,
      onChange,
      className = "",
      "aria-label": ariaLabel,
      "data-testid": testId,
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = useState(checked);
    const [inputId, setInputId] = useState("");

    useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    useEffect(() => {
      setInputId(id || `switch-${Math.random().toString(36).substring(2, 9)}`);
    }, [id]);

    const handleChange = () => {
      const newVal = !isChecked;
      setIsChecked(newVal);
      onChange?.(newVal);
    };

    return (
      <div className={`form-check form-switch ${className}`}>
        <Input
          type="switch"
          id={inputId}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          role="switch"
          aria-label={ariaLabel || label}
          data-testid={testId}
          innerRef={ref}
          className="form-check-input"
        />
        {label && (
          <Label htmlFor={inputId} className="form-check-label">
            {label}
          </Label>
        )}
      </div>
    );
  }
);

SharedSwitch.displayName = "SharedSwitch";
