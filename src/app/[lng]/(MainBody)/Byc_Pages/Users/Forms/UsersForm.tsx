"use client";

import React, {
  KeyboardEvent,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Formik, Form, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import { Col, Row } from "reactstrap";
import {
  getMobileRequest,
  postMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import * as Yup from "yup";
import { showToast } from "@/Shared/Components/showToast";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";
import CustomTextarea from "@/Shared/Components/CustomTextarea";
import TransactionLogForm from "./TransactionLogForm";
interface FormValues {
  username: string;
  isInactive: boolean;
  reason: string;
}

export interface UsersFormHandle {
  logFormValues: () => void;
}

const UsersForm = forwardRef<
  UsersFormHandle,
  {
    userId: string;
    formikRef?: React.Ref<FormikProps<FormValues>>;
    onSuccessSubmit?: () => void;
  }
>(({ userId, formikRef, onSuccessSubmit }, ref) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);

  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  const internalFormikRef = useRef<FormikProps<FormValues> | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: DashboardMobileRepository.MobileUser.getById,
            parameters: `_username=${userId}`,
          })
        ).unwrap()
      );

      setInitialValues({
        username: result.data?.username || "",
        isInactive: !!result.data?.isInactive || false,
        reason: result.data?.inactiveReason || "",
      });
    };

    fetchUser();
  }, [userId]);

  useImperativeHandle(ref, () => ({
    logFormValues: () => {
      setShowMoreInfoModal(true);
    },
  }));
  const validationSchema = Yup.object().shape({
    username: Yup.string().required(),
    isInactive: Yup.boolean(),
    reason: Yup.string(),
  });

  const handleSubmit = async (values: FormValues) => {
    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: DashboardMobileRepository.MobileUser.changeUserStatus,
          parameters: ``,
          body: values,
          rawBody: true,
        })
      ).unwrap()
    );

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

  if (!initialValues) return null;

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        innerRef={(instance: FormikProps<FormValues> | null) => {
          if (instance) {
            internalFormikRef.current = instance;

            if (
              formikRef &&
              typeof formikRef === "object" &&
              "current" in formikRef
            ) {
              (
                formikRef as React.MutableRefObject<FormikProps<FormValues> | null>
              ).current = instance;
            }
          }
        }}
      >
        {({ values, setFieldValue, submitForm }) => (
          <Form onKeyDown={(e) => handleKeyDown(e, submitForm)}>
            <Row>
              <Col md={6}>
                <CustomInput name="username" label={t("username")} readOnly />
              </Col>
              <Col md={6} className="d-flex align-items-center">
                <div className="w-100">
                  <SharedCheckbox
                    name="isInactive"
                    label={t("isInactive")}
                    checked={values.isInactive}
                    onChange={(checked) => setFieldValue("isInactive", checked)}
                  />
                </div>
              </Col>
              <Col md={12}>
                <CustomTextarea name="reason" label={t("reason")} rows={3} />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
      <TransactionLogForm
        visible={showMoreInfoModal}
        onClose={() => setShowMoreInfoModal(false)}
        phoneNumber={initialValues?.username}
      />
    </>
  );
});

UsersForm.displayName = "UsersForm";
export default UsersForm;
