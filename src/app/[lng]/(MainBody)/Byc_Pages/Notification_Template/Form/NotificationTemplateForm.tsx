"use client";

import { useEffect, useState } from "react";
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

  const [fetchedData, setFetchedData] = useState<any>(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("required")),
    title: Yup.string().required(t("required")),
    title2: Yup.string().required(t("required")),
    description: Yup.string().required(t("required")),
    description2: Yup.string().required(t("required")),
    type: Yup.string().required(t("required")),
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      if (modalAction === "edit") {
        const response = await withRequestTracking(dispatch, () =>
          dispatch(
            getMobileRequest({
              extension: `${NotificationAlertRepository.NotificationTemplate.getPack}?_recordId=${rowData.recordId}`,
            })
          )
        );

        setFetchedData(response.payload.data);
      } else {
        setFetchedData(null);
      }
    };

    fetchTemplate();
  }, [dispatch, modalAction, rowData]);

  const getLanguageField = (
    field: "title" | "description",
    langId: number
  ): string =>
    fetchedData?.languages?.find((lang: any) => lang.languageId === langId)?.[
      field
    ] ?? "";

  const initialValues = {
    recordId: fetchedData?.header?.recordId?.toString() || "",
    date: fetchedData?.header?.date || new Date().toISOString(),
    name: fetchedData?.header?.name || "",
    title: getLanguageField("title", 1),
    title2: getLanguageField("title", 2),
    description: getLanguageField("description", 1),
    description2: getLanguageField("description", 2),
    type: rowData?.type ?? fetchedData?.header?.type ?? "",
    isPushNotification: !!fetchedData?.header?.isPushNotification,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const timestamp = new Date().toISOString();

    const supportedLanguages = [
      { id: 1, titleKey: "title", descKey: "description" },
      { id: 2, titleKey: "title2", descKey: "description2" },
    ];

    const languages = supportedLanguages.map((lang) => ({
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

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Row>
            <Col md={6}>
              <CustomInput name="name" label={t("Template Name")} />
              <SharedCheckbox
                name="isPushNotification"
                label={t("Push Notification")}
                checked={values.isPushNotification}
                onChange={(checked) =>
                  setFieldValue("isPushNotification", checked)
                }
              />
            </Col>
            <Col md={6}>
              <CustomSelect
                name="type"
                label={t("Type")}
                value={values.type}
                onChange={(val) => setFieldValue("type", val)}
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
            <CardHeader className=" fw-bold ">{t("Content")}</CardHeader>
            <CardBody>
              <Row>
                <Col md={6}>
                  <CustomInput name="title" label={t("Title (English)")} />
                  <CustomTextarea
                    name="description"
                    label={t("Message (English)")}
                    rows={5}
                  />
                </Col>
                <Col md={6}>
                  <CustomInput name="title2" label={t("Title (Arabic)")} ar />
                  <CustomTextarea
                    name="description2"
                    label={t("Message (Arabic)")}
                    rows={5}
                    ar
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default NotificationTemplateForm;
