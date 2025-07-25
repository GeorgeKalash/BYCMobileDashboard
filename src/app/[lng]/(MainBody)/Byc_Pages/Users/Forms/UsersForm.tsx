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
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
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
import SharedModal from "@/Shared/Components/SharedModal";
import UserInfoForm from "./UserInfoForm";
import OTPForm from "./OTPForm";
import UserControlForm from "./UserControlForm";

interface FormValues {
  username: string;
  isInactive: boolean;
  reason: string;
}

export interface UsersFormHandle {
  logFormValues: () => void;
  openUserInfoModal: () => void;
  openUserControlModal: () => void;
  openOtpModal: () => void;
}

const UsersForm = forwardRef<
  UsersFormHandle,
  {
    user: any;
    formikRef?: React.Ref<FormikProps<FormValues>>;
    onSuccessSubmit?: () => void;
  }
>(({ user, formikRef, onSuccessSubmit }, ref) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showUserControlModal, setShowUserControlModal] = useState(false);

  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  const internalFormikRef = useRef<FormikProps<FormValues> | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;

    setInitialValues({
      username: user?.clientMaster?.cellPhone ?? "",
      isInactive: user?.clientMaster?.status === 0,
      reason: user?.clientMaster?.inactiveReason ?? "",
    });
  }, [user]);
  useEffect(() => {
    if (!initialValues?.username) return;
    fetchUserData();
  }, [initialValues?.username]);

  const fetchUserData = async () => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.MobileUser.getById,
          parameters: `_username=${initialValues?.username.replace(
            "+",
            "%2B"
          )}`,
        })
      )
    );
    setUserData(result?.payload?.data || null);
  };

  useImperativeHandle(ref, () => ({
    logFormValues: () => {
      setShowMoreInfoModal(true);
    },
    openUserInfoModal: () => {
      setShowUserInfoModal(true);
    },
    openUserControlModal: () => {
      setShowUserControlModal(true);
    },
    openOtpModal: () => {
      setShowOtpModal(true);
    },
  }));

  if (!initialValues) return null;

  return (
    <>
      <Card className="mb-4">
        <CardBody>
          <Row>
            <Col md="6">
              <CustomInput
                name="name"
                label={t("Name")}
                value={user?.clientMaster?.name || ""}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
            </Col>
            <Col md="6">
              <CustomInput
                name="cellPhone"
                label={t("Phone Number")}
                value={user?.clientMaster?.cellPhone || ""}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
            </Col>
            <Col md="6">
              <CustomInput
                name="nationality"
                label={t("Nationality")}
                value={user?.clientMaster?.nationalityName || ""}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
            </Col>
            <Col md="6">
              <CustomInput
                name="idNo"
                label={t("ID Number")}
                value={user?.clientRemittance?.idNo || ""}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
            </Col>
            <Col md="6">
              <CustomInput
                name="city"
                label={t("City")}
                value={user?.address?.city || ""}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
            </Col>
            <Col md="6">
              <CustomInput
                name="district"
                label={t("District")}
                value={user?.address?.cityDistrict || ""}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
            </Col>
            <Col md="6">
              <CustomInput
                name="street"
                label={t("Street")}
                value={user?.address?.street1 || ""}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
            </Col>
            <Col md="6">
              <CustomInput
                name="status"
                label={t("Status")}
                value={user?.clientMaster?.statusName || ""}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <TransactionLogForm
        visible={showMoreInfoModal}
        onClose={() => setShowMoreInfoModal(false)}
        phoneNumber={initialValues?.username}
      />

      <UserInfoForm
        visible={showUserInfoModal}
        onClose={() => setShowUserInfoModal(false)}
        phoneNumber={initialValues?.username}
        LocaluserData={user}
        userData={userData}
      />
      <UserControlForm
        visible={showUserControlModal}
        onClose={() => setShowUserControlModal(false)}
        phoneNumber={initialValues?.username}
        isInactive={user?.user?.isInactive ?? false}
        inactiveReason={user?.user?.inactiveReason ?? ""}
      />
      <OTPForm
        visible={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        phoneNumber={initialValues?.username}
      />
    </>
  );
});

UsersForm.displayName = "UsersForm";
export default UsersForm;
