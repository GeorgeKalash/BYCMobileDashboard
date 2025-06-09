"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { Col, Row, Card, CardBody, CardTitle } from "reactstrap";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  getMobileRequest,
  postMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { NotificationAlertRepository } from "@/Repositories/NotificatioAlert";
import { NotificationMobileRepository } from "@/Repositories/NotificationMobileRepository";
import CustomInput from "@/Shared/Components/CustomInput";
import * as Yup from "yup";
import { showToast } from "@/Shared/Components/showToast";
import { withRequestTracking } from "@/utils/withRequestTracking ";

interface NotificationPayloadItem {
  templateId: number;
  clientId: number;
  seqNo: number;
  languageId: number;
  date: string;
  title: string;
  body: string;
  isRead: boolean;
}

interface Props {
  templateId: number;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
}

const NotificationForm = ({
  templateId,
  formikRef,
  onSuccessSubmit,
}: Props) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [initialValues, setInitialValues] = useState({
    title_en: "",
    message_en: "",
    title_ar: "",
    message_ar: "",
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      const res = await withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: `${NotificationAlertRepository.NotificationTemplate.getPack}?_recordId=${templateId}`,
          })
        )
      );

      const data = res.payload.data;
      const getLangField = (field: "title" | "description", langId: number) =>
        data?.languages?.find((lang: any) => lang.languageId === langId)?.[
          field
        ] ?? "";

      setInitialValues({
        title_en: getLangField("title", 1),
        message_en: getLangField("description", 1),
        title_ar: getLangField("title", 2),
        message_ar: getLangField("description", 2),
      });
    };

    fetchTemplate();
  }, [templateId]);

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

    payload.push({
      templateId,
      clientId: 0,
      seqNo: 0,
      languageId: 1,
      date: currentDate,
      title: values.title_en.trim(),
      body: values.message_en.trim(),
      isRead: false,
    });

    payload.push({
      templateId,
      clientId: 0,
      seqNo: 0,
      languageId: 2,
      date: currentDate,
      title: values.title_ar.trim(),
      body: values.message_ar.trim(),
      isRead: false,
    });

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: NotificationMobileRepository.Notification.createPack,
          body: { notificationAlert: payload },
          rawBody: true,
        })
      ).unwrap()
    );

    setSubmitting(false);
    showToast("success", t("Notification submitted successfully"));
    onSuccessSubmit?.();
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
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

export default NotificationForm;
