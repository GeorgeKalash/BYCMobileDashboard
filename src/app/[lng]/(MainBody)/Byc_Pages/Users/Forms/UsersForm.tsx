"use client";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import {  Col, Row } from "reactstrap";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import { withRequestTracking } from "@/utils/withRequestTracking";
import TransactionLogForm from "./TransactionLogForm";
import UserInfoForm from "./UserInfoForm";
import OTPForm from "./OTPForm";
import UserControlForm from "./UserControlForm";
import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";

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
>(({ user }, ref) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showUserControlModal, setShowUserControlModal] = useState(false);
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
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
      <Row>
        <Col md="6">
          <CustomInput
            name="name"
            label={t("Name")}
            value={user?.clientMaster?.name || ""}
            readOnly
          />
        </Col>
        <Col md="6">
          <CustomInput
            name="cellPhone"
            label={t("Phone Number")}
            value={user?.clientMaster?.cellPhone || ""}
            readOnly
          />
        </Col>
        <Col md="6">
          <CustomInput
            name="nationality"
            label={t("Nationality")}
            value={user?.clientMaster?.nationalityName || ""}
            readOnly
          />
        </Col>
        <Col md="6">
          <CustomInput
            name="idNo"
            label={t("ID Number")}
            value={user?.clientRemittance?.idNo || ""}
            readOnly
          />
        </Col>
        <Col md="6">
          <CustomInput
            name="city"
            label={t("City")}
            value={user?.address?.city || ""}
            readOnly
          />
        </Col>
        <Col md="6">
          <CustomInput
            name="district"
            label={t("District")}
            value={user?.address?.cityDistrict || ""}
            readOnly
          />
        </Col>
        <Col md="6">
          <CustomInput
            name="street"
            label={t("Street")}
            value={user?.address?.street1 || ""}
            readOnly
          />
        </Col>
        <Col md="6">
          <CustomInput
            name="status"
            label={t("Status")}
            value={user?.clientMaster?.statusName || ""}
            readOnly
          />
        </Col>
        <Col md="6">
          <SharedCheckbox
            label={t("isSuspicious")}
            checked={userData?.isSuspicious}
            disabled={true}
          />
        </Col>
      </Row>
      <TransactionLogForm
        visible={showMoreInfoModal}
        onClose={() => setShowMoreInfoModal(false)}
        phoneNumber={initialValues?.username}
      />
      <UserInfoForm
        visible={showUserInfoModal}
        onClose={() => setShowUserInfoModal(false)}
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
