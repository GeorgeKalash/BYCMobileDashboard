"use client";

import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";
import CustomSelect from "@/Shared/Components/CustomSelect";
import CustomInput from "@/Shared/Components/CustomInput";
import { Col, Row } from "reactstrap";

const ActivateLanguage = ({
  rowData,
  onFormChange,
}: {
  rowData: any;
  onFormChange: (values: any) => void;
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  if (!rowData) return null;

  const initialValues = {
    name: rowData?.name || "",
    language: rowData?.language || "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    language: Yup.string().required("Language is required"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {}}
    >
      {({ values }) => {
        useEffect(() => {
          onFormChange(values);
        }, [values]);

        return (
          <Form>
            <Row>
              <Col md="6">
                <CustomInput
                  name="name"
                  label={t("Name")}
                  placeholder={t("Enter name")}
                  isRequired
                  readOnly={true}
                />
              </Col>
              <Col md="6">
                <CustomSelect
                  name="language"
                  label={t("Language")}
                  dataSetId={11}
                  isRequired
                  defaultIndex={0}
                />
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ActivateLanguage;
