"use client";

import React from "react";
import { Formik, Form, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomTextarea from "@/Shared/Components/CustomTextarea";
import { Col, Row } from "reactstrap";
import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";
import * as Yup from "yup";
import {
  postMobileRequest,
  putMobileRequest,
  deleteMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { NotificationAlertRepository } from "@/Repositories/NotificationAlert";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { showToast } from "@/Shared/Components/showToast";
import CustomSelect from "@/Shared/Components/CustomSelect";

const NotificationTemplateForm = ({
  rowData,
  formikRef,
  modalAction,
  onSuccessSubmit,
}: {
  rowData: any;
  formikRef?: React.Ref<FormikProps<any>>;
  modalAction: "add" | "edit" | "delete" | null;
  onSuccessSubmit?: () => void;
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const readOnly = modalAction === "delete";

  const initialValues = {
    recordId: rowData?.recordId?.toString() || "",
    date: rowData?.date || new Date().toISOString(),
    title: rowData?.title || "",
    description: rowData?.description || "",
    type: rowData?.type,
    isPushNotification: !!rowData?.isPushNotification,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t("required")),
    description: Yup.string().required(t("required")),
    type: Yup.string().required(t("required")),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload = {
        ...values,
        recordId: rowData?.recordId,
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
      } else if (modalAction === "edit") {
        await withRequestTracking(dispatch, () =>
          dispatch(
            putMobileRequest({
              extension:
                NotificationAlertRepository.NotificationTemplate.update,
              body: payload,
              rawBody: true,
            })
          ).unwrap()
        );
      } else {
        await withRequestTracking(dispatch, () =>
          dispatch(
            postMobileRequest({
              extension: NotificationAlertRepository.NotificationTemplate.set,
              body: payload,
              rawBody: true,
            })
          ).unwrap()
        );
      }

      showToast("success", t("Saved successfully"));
      onSuccessSubmit?.();
    } catch (error) {
      console.error(error);
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
          <Row>
            <Col md={12} className="mb-3">
              <CustomInput
                name="title"
                label={t("Title")}
                readOnly={readOnly}
              />

              <CustomSelect
                name="type"
                label={t("Type")}
                value={values.type}
                onChange={(val) => setFieldValue("type", val)}
                readOnly={readOnly}
                isRequired
                endpointId={
                  NotificationAlertRepository.NotificationTypes.getAll
                }
                valueKey="key"
                labelKey="value"
              />
            </Col>
            <Col md={6} className="mb-3">
              <SharedCheckbox
                name="isPushNotification"
                label={t("Push Notification")}
                checked={values.isPushNotification}
                onChange={(checked) =>
                  setFieldValue("isPushNotification", checked)
                }
                disabled={readOnly}
              />
            </Col>
            <Col md={12} className="mb-3">
              <CustomTextarea
                name="description"
                label={t("Description")}
                readOnly={readOnly}
                rows={5}
              />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default NotificationTemplateForm;
