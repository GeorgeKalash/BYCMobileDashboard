"use client";

import React, { KeyboardEvent } from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { Col, Row, Card, CardBody, CardTitle } from "reactstrap";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import { postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { NotificationMobileRepository } from "@/Repositories/NotificationMobileRepository";
import * as Yup from "yup";
import { showToast } from "@/Shared/Components/showToast";
import { withRequestTracking } from "@/utils/withRequestTracking ";

interface NotificationRowData {
  title_en?: string;
  message_en?: string;
  title_ar?: string;
  message_ar?: string;
}

interface NotificationPayloadItem {
  clientId: number;
  seqNo: number;
  languageId: number;
  date: string;
  title: string;
  body: string;
  isRead: boolean;
}

interface NotificationFormProps {
  rowData: NotificationRowData | null;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
  modalAction: "add" | "edit" | null;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  rowData,
  formikRef,
  onSuccessSubmit,
  modalAction,
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  if (!rowData && modalAction === "edit") return null;

  const initialValues = {
    title_en: rowData?.title_en || "",
    title_ar: rowData?.title_ar || "",
    message_en: rowData?.message_en || "",
    message_ar: rowData?.message_ar || "",
  };

  const validationSchema = Yup.object().shape({
    title_en: Yup.string().required(t("required")),
    message_en: Yup.string().required(t("required")),
    title_ar: Yup.string().required(t("required")),
    message_ar: Yup.string().required(t("required")),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    const payload: NotificationPayloadItem[] = [];
    const currentDate = new Date().toISOString();

    if (values.title_en.trim() || values.message_en.trim()) {
      payload.push({
        clientId: 0,
        seqNo: 0,
        languageId: 1,
        date: currentDate,
        title: values.title_en.trim(),
        body: values.message_en.trim(),
        isRead: false,
      });
    }

    if (values.title_ar.trim() || values.message_ar.trim()) {
      payload.push({
        clientId: 0,
        seqNo: 0,
        languageId: 2,
        date: currentDate,
        title: values.title_ar.trim(),
        body: values.message_ar.trim(),
        isRead: false,
      });
    }

    if (payload.length === 0) {
      showToast("error", t("Please fill in at least one language section."));
      setSubmitting(false);
      return;
    }

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: NotificationMobileRepository.Notification.createPack,
          body: payload,
          rawBody: true,
        })
      ).unwrap()
    );

    setSubmitting(false);
    showToast("success");
    onSuccessSubmit?.();
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

  const isReadOnly = modalAction === "edit";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      {({ submitForm }) => (
        <Form onKeyDown={(e) => handleKeyDown(e, submitForm)}>
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
                    readOnly={isReadOnly}
                  />
                  <CustomInput
                    name="message_en"
                    label={t("Message (English)")}
                    type="text"
                    placeholder={t("Enter the message in English")}
                    readOnly={isReadOnly}
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
                    readOnly={isReadOnly}
                  />
                  <CustomInput
                    name="message_ar"
                    label={t("Message (Arabic)")}
                    type="text"
                    placeholder={t("أدخل الرسالة باللغة العربية")}
                    readOnly={isReadOnly}
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

export default NotificationForm;
