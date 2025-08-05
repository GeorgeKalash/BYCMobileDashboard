"use client";

import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { Col, Row, Card, CardBody, CardTitle } from "reactstrap";
import * as Yup from "yup";

import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  getMobileRequest,
  postMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { NotificationAlertRepository } from "@/Repositories/NotificatioAlert";
import { NotificationMobileRepository } from "@/Repositories/NotificationMobileRepository";

import CustomInput from "@/Shared/Components/CustomInput";
import CustomTextarea from "@/Shared/Components/CustomTextarea";
import { showToast } from "@/Shared/Components/showToast";
import { withRequestTracking } from "@/utils/withRequestTracking";

interface NotificationPayloadItem {
  templateId: number;
  clientId: number;
  seqNo: number;
  languageId: number;
  date: string;
  title: string;
  body: string;
  isRead: boolean;
  destination: string;
}

interface Props {
  templateId: number;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;

  filters: Record<string, any>;
}

const NotificationForm = ({
  templateId,
  formikRef,
  onSuccessSubmit,
  filters,
}: Props) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [initialValues, setInitialValues] = useState<Record<string, string>>(
    {}
  );
  const supportedLanguagesRef = useRef<
    { id: number; titleKey: string; bodyKey: string }[]
  >([
    { id: 1, titleKey: "title", bodyKey: "body" },
    { id: 2, titleKey: "title2", bodyKey: "body2" },
  ]);

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
      const languagesFromApi = data?.languages || [];

      supportedLanguagesRef.current = languagesFromApi.map(
        (lang: any, index: number) => ({
          id: lang.languageId,
          titleKey: `title${index === 0 ? "" : index + 1}`,
          bodyKey: `body${index === 0 ? "" : index + 1}`,
        })
      );

      const getLangField = (field: "title" | "description", langId: number) =>
        data?.languages?.find((lang: any) => lang.languageId === langId)?.[
          field
        ] ?? "";

      const langValues = supportedLanguagesRef.current.reduce((acc, lang) => {
        acc[lang.titleKey] = getLangField("title", lang.id);
        acc[lang.bodyKey] = getLangField("description", lang.id);
        return acc;
      }, {} as Record<string, string>);

      setInitialValues(langValues);
    };

    fetchTemplate();
  }, [templateId, dispatch]);

  const validationSchema = Yup.object().shape(
    supportedLanguagesRef.current.reduce((acc, lang) => {
      acc[lang.titleKey] = Yup.string().required(t("required"));
      acc[lang.bodyKey] = Yup.string().required(t("required"));
      return acc;
    }, {} as Record<string, Yup.StringSchema>)
  );

  const handleSubmit = async (
    values: Record<string, string>,
    { setSubmitting }: FormikHelpers<Record<string, string>>
  ) => {
    const currentDate = new Date().toISOString();

    const payload: NotificationPayloadItem[] =
      supportedLanguagesRef.current.map((lang) => ({
        templateId,
        clientId: 0,
        seqNo: 0,
        languageId: lang.id,
        date: currentDate,
        title: values[lang.titleKey]?.trim() ?? "",
        body: values[lang.bodyKey]?.trim() ?? "",
        isRead: false,
        destination: "",
      }));

    const requestBody = {
      notificationAlerts: payload,
      filters: filters,
    };

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: NotificationMobileRepository.Notification.createBroadcast,

          body: requestBody,
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
            {supportedLanguagesRef.current.map((lang) => (
              <Col md="6" key={lang.id}>
                <Card className="h-100">
                  <CardBody>
                    <CardTitle tag="h5" className="mb-4">
                      {t(`Language ${lang.id}`)}
                    </CardTitle>
                    <CustomInput
                      name={lang.titleKey}
                      label={t(`Title (Language ${lang.id})`)}
                      type="text"
                      placeholder={t("Enter the title")}
                    />
                    <CustomTextarea
                      name={lang.bodyKey}
                      label={t(`Message (Language ${lang.id})`)}
                      placeholder={t("Enter the message")}
                    />
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default NotificationForm;
