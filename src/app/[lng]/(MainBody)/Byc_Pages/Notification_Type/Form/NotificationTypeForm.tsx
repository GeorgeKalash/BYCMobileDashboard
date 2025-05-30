"use client";

import React, { KeyboardEvent } from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { Col, Row, Card, CardBody } from "reactstrap";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import {
  postMobileRequest,
  getMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { NotificationAlertRepository } from "@/Repositories/NotificationAlert";
import * as Yup from "yup";
import { showToast } from "@/Shared/Components/showToast";
import { withRequestTracking } from "@/utils/withRequestTracking ";

interface NotificationRowData {
  key?: number;
  value?: string;
}

interface NotificationFormProps {
  rowData: NotificationRowData | null;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
  modalAction: "add" | "edit" | null;
}

const NotificationTypeForm: React.FC<NotificationFormProps> = ({
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
    value: rowData?.value || "",
  };

  const validationSchema = Yup.object().shape({
    value: Yup.string().required(t("required")),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setSubmitting(true);

    const trimmedValue = values.value.trim();

    try {
      if (modalAction === "edit") {
        await withRequestTracking(dispatch, () =>
          dispatch(
            postMobileRequest({
              extension: NotificationAlertRepository.NotificationTypes.update,
              body: {
                key: rowData?.key,
                value: trimmedValue,
              },
              rawBody: true,
            })
          ).unwrap()
        );
      } else {
        const result = await withRequestTracking(dispatch, () =>
          dispatch(
            getMobileRequest({
              extension: NotificationAlertRepository.NotificationTypes.getAll,
              parameters: "",
            })
          )
        );

        const existing = Array.isArray(result?.payload?.data)
          ? result.payload.data
          : [];

        const newKey =
          Math.max(0, ...existing.map((item: any) => item.key ?? 0)) + 1;

        const updatedPack = [...existing, { key: newKey, value: trimmedValue }];

        await withRequestTracking(dispatch, () =>
          dispatch(
            postMobileRequest({
              extension: NotificationAlertRepository.NotificationTypes.set,
              body: updatedPack,
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
    } finally {
      setSubmitting(false);
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
          <Row className="gy-4">
            <Col>
              <Card className="h-100">
                <CardBody>
                  {modalAction === "edit" && (
                    <CustomInput
                      name="key"
                      label={t("ID")}
                      type="text"
                      placeholder={String(rowData?.key ?? "")}
                      readOnly
                    />
                  )}
                  <CustomInput
                    name="value"
                    label={t("Notification Type")}
                    type="text"
                    placeholder={t("Enter Notification Type")}
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

export default NotificationTypeForm;
