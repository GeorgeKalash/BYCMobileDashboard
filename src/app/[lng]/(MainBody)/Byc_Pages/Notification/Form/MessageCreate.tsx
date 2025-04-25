"use client";

import React from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import SharedButton from "@/Shared/Components/SharedButton";
import { Col, Row } from "reactstrap";
import * as Yup from "yup";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { NotificationMobileRepository } from "@/Repositories/NotificationMobileRepository";
import { showToast } from "@/Shared/Components/showToast";

const MessageCreate = ({
  rowData,
  formikRef,
  onSuccessSubmit,
}: {
  rowData?: any;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const initialValues = {
    message_en: rowData?.message_en || "",
    message_ar: rowData?.message_ar || "",
  };

  const validationSchema = Yup.object().shape({
    message_en: Yup.string().required(t("Message in English is required")),
    message_ar: Yup.string().required(t("Message in Arabic is required")),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    const payload = {
      message_en: values.message_en,
      message_ar: values.message_ar,
    };

    try {
      await withRequestTracking(dispatch, () =>
        dispatch(
          postMobileRequest({
            extension: NotificationMobileRepository.Notification.create, // adjust if needed
            body: payload,
            rawBody: true,
          })
        ).unwrap()
      );

      showToast("success", t("Message saved successfully"));
      if (onSuccessSubmit) onSuccessSubmit();
    } catch (err) {
      showToast("error", t("Failed to save message"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      {({ isSubmitting }) => (
        <Form>
          <Row className="gy-4">
            <Col xs="12">
              <CustomInput
                name="message_en"
                label={t("Message (English)")}
                type="text"
                placeholder={t("Enter the message in English")}
              />
            </Col>
            <Col xs="12">
              <CustomInput
                name="message_ar"
                label={t("Message (Arabic)")}
                type="text"
                placeholder={t("Enter the message in Arabic")}
              />
            </Col>
            <Col xs="12" className="text-center mt-3">
              <SharedButton
                color="primary"
                type="submit"
                title={t("Save")}
                disabled={isSubmitting}
              />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default MessageCreate;
