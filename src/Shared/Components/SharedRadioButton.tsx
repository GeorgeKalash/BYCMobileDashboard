"use client";
import React, { useState, useEffect, forwardRef } from "react";
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SVG from "@/CommonComponent/SVG";
import { ImagePath, VariationRadios } from "@/Constant";
import { VariationRadioProp } from "@/Types/FormType";

// ----------------------------------------------
//  SharedRadioButton
// ----------------------------------------------
type SharedRadioButtonProps = {
  label?: string;
  name: string;
  value: string;
  selectedValue?: string;
  disabled?: boolean;
  id?: string;
  onChange?: (value: string) => void;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
};

export const SharedRadioButton = forwardRef<
  HTMLInputElement,
  SharedRadioButtonProps
>(
  (
    {
      label,
      name,
      value,
      selectedValue,
      disabled = false,
      id,
      onChange,
      className = "",
      "aria-label": ariaLabel,
      "data-testid": testId,
    },
    ref
  ) => {
    const [inputId, setInputId] = useState<string>("");

    useEffect(() => {
      const generatedId =
        id || `radio-${Math.random().toString(36).substring(2, 9)}`;
      setInputId(generatedId);
    }, [id]);

    const handleChange = () => {
      onChange?.(value);
    };

    return (
      <div className={`form-check ${className}`}>
        <Input
          type="radio"
          name={name}
          value={value}
          id={inputId}
          checked={selectedValue === value}
          disabled={disabled}
          onChange={handleChange}
          className="form-check-input"
          aria-label={ariaLabel || label}
          data-testid={testId}
          innerRef={ref}
        />
        {label && (
          <Label for={inputId} className="form-check-label">
            {label}
          </Label>
        )}
      </div>
    );
  }
);
SharedRadioButton.displayName = "SharedRadioButton";

// ----------------------------------------------
//  SharedRadioGroup
// ----------------------------------------------
type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SharedRadioGroupProps = {
  name: string;
  options: RadioOption[];
  selectedValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
};

export const SharedRadioGroup: React.FC<SharedRadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  className = "",
  "aria-label": ariaLabel,
  "data-testid": testId,
}) => {
  return (
    <div className={className} aria-label={ariaLabel} data-testid={testId}>
      {options.map((option) => (
        <SharedRadioButton
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          selectedValue={selectedValue}
          disabled={option.disabled}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

// ----------------------------------------------
//  VariationRadioGroup
// ----------------------------------------------
type VariationRadioPropList = {
  colClass?: string;
  title: string;
  child: VariationRadioProp[];
};

type VariationRadioProps = {
  data: VariationRadioPropList[];
};

export const VariationRadio: React.FC<VariationRadioProps> = ({ data }) => {
  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={VariationRadios} />
        <CardBody>
          <Row className="g-3">
            {data.map(({ colClass, title, child }, index) => (
              <Col xl="4" className={colClass || ""} key={index}>
                <div className="card-wrapper border rounded-3 h-100 checkbox-checked">
                  <h6 className="sub-title">{title}</h6>
                  {child.map(
                    ({
                      id,
                      labelText,
                      image,
                      icon,
                      name,
                      defaultChecked,
                      iconColor,
                    }: VariationRadioProp) => (
                      <div className="payment-wrapper" key={id}>
                        <div className="payment-first">
                          <FormGroup className="radio radio-primary" check>
                            <Input
                              id={`ptm-${id}`}
                              type="radio"
                              name={name}
                              value={`option-${id}`}
                              defaultChecked={defaultChecked}
                            />
                            <Label className="mb-0" htmlFor={`ptm-${id}`}>
                              {labelText}
                            </Label>
                          </FormGroup>
                        </div>
                        {(image || icon) && (
                          <div className="payment-second">
                            {image && (
                              <img
                                className="img-fluid"
                                src={`${ImagePath}/${image}`}
                                alt={labelText}
                              />
                            )}
                            {icon && (
                              <SVG
                                className={`mega-icons stroke-${iconColor}`}
                                iconId={icon}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};
