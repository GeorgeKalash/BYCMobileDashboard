"use client";
import React from "react";
import SharedModal from "@/Shared/Components/SharedModal";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import { Col, Row } from "reactstrap";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomTextarea from "@/Shared/Components/CustomTextarea";
import { showToast } from "@/Shared/Components/showToast";
import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";
import { Formik, Form } from "formik";
import * as Yup from "yup";

interface UserControlFormProps {
  visible: boolean;
  onClose: () => void;
  phoneNumber?: string;
  isInactive?: boolean;
  inactiveReason?: string;
}

const UserControlForm: React.FC<UserControlFormProps> = ({
  visible,
  onClose,
  phoneNumber,
  isInactive = false,
  inactiveReason = "",
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(),
    isInactive: Yup.boolean(),
    reason: Yup.string(),
  });

  const handleSubmit = async (values: any) => {
    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: DashboardMobileRepository.MobileUser.changeUserStatus,
          body: values,
          rawBody: true,
        })
      ).unwrap()
    );

    showToast("success");
    onClose();
  };

  const initialValues = {
    username: phoneNumber || "",
    isInactive,
    reason: inactiveReason,
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, submitForm }) => (
          <SharedModal
            visible={visible}
            onClose={onClose}
            title={t("User Control")}
            height="80vh"
            width="60vw"
            onSubmit={submitForm}
          >
            <div style={{ padding: "1rem" }}>
              <Form>
                <Row>
                  <Col md={6}>
                    <CustomInput
                      name="username"
                      label={t("username")}
                      readOnly
                    />
                  </Col>
                  <Col md={6} className="d-flex align-items-center">
                    <div className="w-100">
                      <SharedCheckbox
                        name="isInactive"
                        label={t("isInactive")}
                        checked={values.isInactive}
                        onChange={(checked) =>
                          setFieldValue("isInactive", checked)
                        }
                      />
                    </div>
                  </Col>
                  <Col md={12}>
                    <CustomTextarea
                      name="reason"
                      label={t("reason")}
                      rows={3}
                    />
                  </Col>
                </Row>
              </Form>
            </div>
          </SharedModal>
        )}
      </Formik>
    </div>
  );
};

export default UserControlForm;
