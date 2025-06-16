"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Formik, Form, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  postMobileRequest,
  getMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { NotificationAlertRepository } from "@/Repositories/NotificationAlert";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { showToast } from "@/Shared/Components/showToast";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomTextarea from "@/Shared/Components/CustomTextarea";
import CustomSelect from "@/Shared/Components/CustomSelect";
import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import * as Yup from "yup";

interface NotificationTemplateFormProps {
  rowData: any;
  formikRef?: React.Ref<FormikProps<any>>;
  modalAction: "add" | "edit" | null;
  onSuccessSubmit?: () => void;
}

const NotificationTemplateForm = ({
  rowData,
  formikRef,
  modalAction,
  onSuccessSubmit,
}: NotificationTemplateFormProps) => {
  const dispatch = useAppDispatch();
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  const localFormikRef = useRef<FormikProps<any>>(null);
  const formikReference = formikRef || localFormikRef;

  const supportedLanguagesRef = useRef<
    { id: number; titleKey: string; descKey: string }[]
  >([
    { id: 1, titleKey: "title", descKey: "description" },
    { id: 2, titleKey: "title2", descKey: "description2" },
  ]);

  const generateInitialValues = () => {
    const langFields = supportedLanguagesRef.current.reduce((acc, lang) => {
      acc[lang.titleKey] = "";
      acc[lang.descKey] = "";
      return acc;
    }, {} as Record<string, string>);

    return {
      recordId: "",
      date: new Date().toISOString(),
      name: "",
      type: rowData?.type ?? "",
      isPushNotification: false,
      ...langFields,
    };
  };

  const generateValidationSchema = () => {
    const langSchema = supportedLanguagesRef.current.reduce((acc, lang) => {
      acc[lang.titleKey] = Yup.string().required(t("required"));
      acc[lang.descKey] = Yup.string().required(t("required"));
      return acc;
    }, {} as Record<string, any>);

    return Yup.object().shape({
      name: Yup.string().required(t("required")),
      type: Yup.string().required(t("required")),
      isPushNotification: Yup.boolean(),
      ...langSchema,
    });
  };

  const initialValues = generateInitialValues();
  const validationSchema = generateValidationSchema();

  const handleSubmit = async (values: typeof initialValues) => {
    const timestamp = new Date().toISOString();

    const languages = supportedLanguagesRef.current.map((lang) => ({
      templateId: rowData?.recordId || 0,
      languageId: lang.id,
      title: (values as any)[lang.titleKey],
      description: (values as any)[lang.descKey],
    }));

    const payload = {
      header: {
        recordId: rowData?.recordId || 0,
        date: values.date || timestamp,
        name: values.name,
        type: parseInt(values.type, 10),
        isPushNotification: values.isPushNotification,
      },
      languages,
    };

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: NotificationAlertRepository.NotificationTemplate.setPack,
          body: payload,
          rawBody: true,
        })
      ).unwrap()
    );

    showToast("success", t("Saved successfully"));
    onSuccessSubmit?.();
  };

  const fetchTemplate = useCallback(async () => {
    if (
      modalAction === "edit" &&
      formikReference &&
      "current" in formikReference &&
      formikReference.current
    ) {
      const response = await withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: `${NotificationAlertRepository.NotificationTemplate.getPack}?_recordId=${rowData.recordId}`,
          })
        )
      );

      const data = response.payload.data;

      const languagesFromApi = data?.languages || [];

      supportedLanguagesRef.current = languagesFromApi.map(
        (lang: any, index: number) => ({
          id: lang.languageId,
          titleKey: `title${index === 0 ? "" : index + 1}`,
          descKey: `description${index === 0 ? "" : index + 1}`,
        })
      );

      const getLanguageField = (
        field: "title" | "description",
        langId: number
      ): string =>
        data?.languages?.find((lang: any) => lang.languageId === langId)?.[
          field
        ] ?? "";

      const langFields = supportedLanguagesRef.current.reduce((acc, lang) => {
        acc[lang.titleKey] = getLanguageField("title", lang.id);
        acc[lang.descKey] = getLanguageField("description", lang.id);
        return acc;
      }, {} as Record<string, string>);

      formikReference.current.setValues({
        recordId: data?.header?.recordId?.toString() || "",
        date: data?.header?.date || new Date().toISOString(),
        name: data?.header?.name || "",
        type: data?.header?.type?.toString() || "",
        isPushNotification: !!data?.header?.isPushNotification,
        ...langFields,
      });
    }
  }, [dispatch, modalAction, rowData, formikReference]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikReference}
    >
      {(formik) => (
        <Form>
          <Row>
            <Col md={6}>
              <CustomInput name="name" label={t("Template Name")} />
              <SharedCheckbox
                name="isPushNotification"
                label={t("Push Notification")}
                checked={formik.values.isPushNotification}
                onChange={(checked) =>
                  formik.setFieldValue("isPushNotification", checked)
                }
              />
            </Col>
            <Col md={6}>
              <CustomSelect
                name="type"
                label={t("Type")}
                value={formik.values.type}
                onChange={(val) => formik.setFieldValue("type", val)}
                isRequired
                endpointId={
                  NotificationAlertRepository.NotificationTypes.getAll
                }
                valueKey="key"
                labelKey="value"
              />
            </Col>
          </Row>
          <Card className="border">
            <CardHeader className="fw-bold">{t("Content")}</CardHeader>
            <CardBody>
              <Row>
                {supportedLanguagesRef.current.map((lang) => (
                  <Col md={6} key={lang.id}>
                    <CustomInput
                      name={lang.titleKey}
                      label={`${t("Title")} (Language ${lang.id})`}
                    />
                    <CustomTextarea
                      name={lang.descKey}
                      label={`${t("Message")} (Language ${lang.id})`}
                      rows={5}
                    />
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default NotificationTemplateForm;
