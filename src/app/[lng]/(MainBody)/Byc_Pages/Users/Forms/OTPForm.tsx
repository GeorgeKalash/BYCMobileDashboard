"use client";
import React, { useEffect, useState } from "react";
import SharedModal from "@/Shared/Components/SharedModal";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import {
  getMobileRequest,
  postMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import CustomInput from "@/Shared/Components/CustomInput";
import SharedButton from "@/Shared/Components/SharedButton";
import { showToast } from "@/Shared/Components/showToast";

interface OTPFormProps {
  visible: boolean;
  onClose: () => void;
  phoneNumber?: string;
}

const OTPForm: React.FC<OTPFormProps> = ({ visible, onClose, phoneNumber }) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const [otpData, setOtpData] = useState<any[]>([]);

  const fetchOtpData = async () => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.OTP.getCounter,
          parameters: `_username=${phoneNumber?.replace("+", "%2B")}`,
        })
      ).unwrap()
    );

    if (result.status === 1 && Array.isArray(result.data)) {
      setOtpData(result.data);
    }
  };

  useEffect(() => {
    if (visible && phoneNumber) {
      fetchOtpData();
    }
  }, [visible, phoneNumber, dispatch]);

  const handleReset = async (resourceId: number) => {
    if (!phoneNumber) return;

    const body = {
      resourceId,
      username: phoneNumber,
    };

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: DashboardMobileRepository.OTP.reset,
          parameters: ``,
          body,
          rawBody: true,
        })
      ).unwrap()
    );

    showToast("success");
    fetchOtpData();
  };

  return (
    <SharedModal
      visible={visible}
      onClose={onClose}
      title={t("User Info")}
      height="80vh"
      width="80vw"
    >
      <div style={{ padding: "1rem", maxHeight: "70vh", overflowY: "auto" }}>
        {otpData.length > 0 &&
          otpData.map((item) => (
            <Card className="mb-3" key={item.resourceId}>
              <CardHeader tag="h5">{item.resourceName}</CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <CustomInput
                      name={`lastRequest-${item.resourceId}`}
                      label={t("Last Request")}
                      value={item.lastRequest?.split("T")[0] || ""}
                      onChange={() => {}}
                      onBlur={() => {}}
                      readOnly
                    />
                  </Col>
                  <Col>
                    <CustomInput
                      name={`count-${item.resourceId}`}
                      label={t("Request Count")}
                      value={item.count}
                      onChange={() => {}}
                      onBlur={() => {}}
                      readOnly
                    />
                  </Col>
                  <Col>
                    <CustomInput
                      name={`isInactive-${item.resourceId}`}
                      label={t("Inactive")}
                      value={item.isInactive === true ? t("Yes") : t("No")}
                      onChange={() => {}}
                      onBlur={() => {}}
                      readOnly
                    />
                  </Col>
                  <Col className="d-flex align-items-center">
                    <SharedButton
                      color="primary"
                      type="button"
                      title={t("Reset")}
                      onClick={() => handleReset(item.resourceId)}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}
      </div>
    </SharedModal>
  );
};

export default OTPForm;
