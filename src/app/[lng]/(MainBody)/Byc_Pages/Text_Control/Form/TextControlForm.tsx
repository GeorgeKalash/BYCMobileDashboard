"use client";

import React, { KeyboardEvent } from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import { Col, Row } from "reactstrap";
import { postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { SystemMobileRepository } from "@/Repositories/SystemMobileRepository";
import * as Yup from "yup";
import { showToast } from "@/Shared/Components/showToast";
import { withRequestTracking } from "@/utils/withRequestTracking ";

const TextControlForm = ({
  rowData,
  formikRef,
  onSuccessSubmit,
  modalAction,
  langId,
}: {
  rowData: any;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
  modalAction: "add" | "edit" | null;
  langId: 1 | 2 | null;
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  if (!rowData && modalAction === "edit") return null;

  const initialValues = {
    key: modalAction === "add" ? "" : rowData?.key || "",
    value: modalAction === "add" ? "" : rowData?.value || "",
  };

  const validationSchema = Yup.object().shape({
    key: Yup.string().required(t("Key is required")),
    value: Yup.string().required(t("Value is required")),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    const transformedData = {
      [values.key]: String(values.value),
    };

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: SystemMobileRepository.Languages.updateKeyValuePairs,
          parameters: `_languageId=${langId}`,
          body: transformedData,
          rawBody: true,
        })
      ).unwrap()
    );

    setSubmitting(false);
    if (onSuccessSubmit) {
      showToast("success");
      onSuccessSubmit();
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLFormElement>,
    submitForm: () => void
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitForm();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      {({ submitForm }) => (
        <Form onKeyDown={(e) => handleKeyDown(e, submitForm)}>
          <Row>
            <Col>
              <CustomInput
                name="key"
                label={t("Key")}
                placeholder={t("Enter Key")}
                readOnly={modalAction === "edit"}
              />
              <CustomInput
                name="value"
                label={t("Value")}
                placeholder={t("Enter value")}
              />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default TextControlForm;
