"use client";

import React from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import { Col, Row, Card, CardBody, CardTitle } from "reactstrap";
import * as Yup from "yup";
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
    title_en: rowData?.title_en || "",
    title_ar: rowData?.title_ar || "",
    message_en: rowData?.message_en || "",
    message_ar: rowData?.message_ar || "",
  };

  const validationSchema = Yup.object()
    .shape({
      title_en: Yup.string(),
      message_en: Yup.string(),
      title_ar: Yup.string(),
      message_ar: Yup.string(),
    })
    .test(
      "at-least-one-filled",
      t("At least one field must be filled"),
      (values) => {
        return (
          !!values.title_en?.trim() ||
          !!values.message_en?.trim() ||
          !!values.title_ar?.trim() ||
          !!values.message_ar?.trim()
        );
      }
    );

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    const payload = [];

    if (values.title_en.trim() || values.message_en.trim()) {
      payload.push({
        clientId: 0,
        seqNo: 0,
        languageId: 1,
        date: new Date().toISOString(),
        title: values.title_en,
        body: values.message_en,
        isRead: false,
      });
    }

    if (values.title_ar.trim() || values.message_ar.trim()) {
      payload.push({
        clientId: 0,
        seqNo: 0,
        languageId: 2,
        date: new Date().toISOString(),
        title: values.title_ar,
        body: values.message_ar,
        isRead: false,
      });
    }

    if (payload.length === 0) {
      showToast("error", t("You must fill at least one field"));
      setSubmitting(false);
      return;
    }

    try {
      await dispatch(
        postMobileRequest({
          extension: NotificationMobileRepository.Notification.createPack,
          body: payload,
          rawBody: true,
        })
      ).unwrap();

      showToast("success", t("Message saved successfully"));

      if (onSuccessSubmit) {
        onSuccessSubmit();
      }
    } catch (error: any) {
      console.error("❌ API Error:", error);
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
            <Col md="6">
              <Card className="h-100">
                <CardBody>
                  <CardTitle tag="h5" className="mb-4">
                    {t("English Section")}
                  </CardTitle>
                  <CustomInput
                    name="title_en"
                    label={t("Title (English)")}
                    type="text"
                    placeholder={t("Enter the title in English")}
                  />
                  <CustomInput
                    name="message_en"
                    label={t("Message (English)")}
                    type="text"
                    placeholder={t("Enter the message in English")}
                  />
                </CardBody>
              </Card>
            </Col>

            <Col md="6">
              <Card className="h-100">
                <CardBody>
                  <CardTitle tag="h5" className="mb-4">
                    {t("Arabic Section")}
                  </CardTitle>
                  <CustomInput
                    name="title_ar"
                    label={t("Title (Arabic)")}
                    type="text"
                    placeholder={t("أدخل العنوان باللغة العربية")}
                  />
                  <CustomInput
                    name="message_ar"
                    label={t("Message (Arabic)")}
                    type="text"
                    placeholder={t("أدخل الرسالة باللغة العربية")}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default MessageCreate;
