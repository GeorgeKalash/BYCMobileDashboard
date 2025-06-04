"use client";

import { useEffect, useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  postMobileRequest,
  putMobileRequest,
  deleteMobileRequest,
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
  modalAction: "add" | "edit" | "delete" | null;
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

  const [templateData, setTemplateData] = useState<any>(null);
  const isReadOnly = modalAction === "delete";

  // Fetch template data for editing or deleting
  useEffect(() => {
    const fetchTemplate = async () => {
      if (
        (modalAction === "edit" || modalAction === "delete") &&
        rowData?.recordId
      ) {
        try {
          const response = await withRequestTracking(dispatch, () =>
            dispatch(
              getMobileRequest({
                extension: `${NotificationAlertRepository.NotificationTemplate.getPack}?_recordId=${rowData.recordId}`,
              })
            )
          );

          if (response?.payload?.data) {
            setTemplateData(response.payload.data);
          }
        } catch (error) {
          console.error("Error fetching template data:", error);
        }
      } else if (modalAction === "add") {
        setTemplateData(null);
      }
    };

    fetchTemplate();
  }, [dispatch, modalAction, rowData]);

  const getLanguageField = (
    field: "title" | "description",
    langId: number
  ): string =>
    templateData?.languages?.find((lang: any) => lang.languageId === langId)?.[
      field
    ] ?? "";

  const initialValues = {
    recordId: templateData?.header?.recordId?.toString() || "",
    date: templateData?.header?.date || new Date().toISOString(),
    name: templateData?.header?.name || "",
    title: getLanguageField("title", 1),
    title2: getLanguageField("title", 2),
    description: getLanguageField("description", 1),
    description2: getLanguageField("description", 2),
    type: rowData?.type ?? templateData?.header?.type ?? "",
    isPushNotification: !!templateData?.header?.isPushNotification,
  };

  const validationSchema =
    modalAction === "delete"
      ? null
      : Yup.object().shape({
          name: Yup.string().required(t("required")),
          title: Yup.string().required(t("required")),
          title2: Yup.string().required(t("required")),
          description: Yup.string().required(t("required")),
          description2: Yup.string().required(t("required")),
          type: Yup.string().required(t("required")),
        });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const timestamp = new Date().toISOString();

      const payload = {
        header: {
          recordId: rowData?.recordId || 0,
          date: values.date || timestamp,
          name: values.name,
          type: parseInt(values.type, 10),
          isPushNotification: values.isPushNotification,
        },
        languages: [
          {
            templateId: rowData?.recordId || 0,
            languageId: 1,
            title: values.title,
            description: values.description,
          },
          {
            templateId: rowData?.recordId || 0,
            languageId: 2,
            title: values.title2,
            description: values.description2,
          },
        ],
      };

      if (modalAction === "delete") {
        await withRequestTracking(dispatch, () =>
          dispatch(
            deleteMobileRequest({
              extension: `${NotificationAlertRepository.NotificationTemplate.delete}?_recordId=${rowData?.recordId}`,
              rawBody: false,
            })
          ).unwrap()
        );
      } else {
        await withRequestTracking(dispatch, () =>
          dispatch(
            postMobileRequest({
              extension:
                NotificationAlertRepository.NotificationTemplate.setPack,
              body: payload,
              rawBody: true,
            })
          ).unwrap()
        );
      }

      showToast("success", t("Saved successfully"));
      onSuccessSubmit?.();
    } catch (error) {
      console.error("Submission error:", error);
      showToast("error", t("Failed to save"));
    }
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
          {modalAction === "delete" ? (
            <Card className="shadow-sm border">
              <CardBody className="text-center">
                <h5 className="mb-3">
                  {t("Are you sure you want to delete this template?")}
                </h5>
              </CardBody>
            </Card>
          ) : (
            <>
              <Row>
                <Col md={6} className="mb-2">
                  <CustomInput
                    name="name"
                    label={t("Template Name")}
                    readOnly={isReadOnly}
                  />
                  <SharedCheckbox
                    name="isPushNotification"
                    label={t("Push Notification")}
                    checked={values.isPushNotification}
                    onChange={(checked) =>
                      setFieldValue("isPushNotification", checked)
                    }
                    disabled={isReadOnly}
                  />
                </Col>
                <Col md={6} className="mb-2">
                  <CustomSelect
                    name="type"
                    label={t("Type")}
                    value={values.type}
                    onChange={(val) => setFieldValue("type", val)}
                    readOnly={isReadOnly}
                    isRequired
                    endpointId={
                      NotificationAlertRepository.NotificationTypes.getAll
                    }
                    valueKey="key"
                    labelKey="value"
                  />
                </Col>
              </Row>

              <Card className="shadow-sm mt-4 border">
                <CardHeader className="p-3 fw-bold border-bottom">
                  {t("Content")}
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6} className="mb-3">
                      <CustomInput
                        name="title"
                        label={t("Title (English)")}
                        readOnly={isReadOnly}
                      />
                      <CustomTextarea
                        name="description"
                        label={t("Message (English)")}
                        readOnly={isReadOnly}
                        rows={5}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <CustomInput
                        name="title2"
                        label={t("Title (Arabic)")}
                        readOnly={isReadOnly}
                        ar
                      />
                      <CustomTextarea
                        name="description2"
                        label={t("Message (Arabic)")}
                        readOnly={isReadOnly}
                        rows={5}
                        ar
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default NotificationTemplateForm;
