"use client";
import React, { useEffect, useState } from "react";
import SharedModal from "@/Shared/Components/SharedModal";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import {
  getMobileRequest,
  postMobileRequest,
  putMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import CustomInput from "@/Shared/Components/CustomInput";
import SharedButton from "@/Shared/Components/SharedButton";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import CustomPdfDisplayInput from "@/Shared/Components/CustomFileInput";
import { showToast } from "@/Shared/Components/showToast";

interface UserInfoFormProps {
  visible: boolean;
  onClose: () => void;
  phoneNumber?: string;
  LocaluserData?: any;
}

type QuestionWithType = {
  value: number;
  label: string;
  type: string;
  typeId: number;
  body?: string;
  isRequested?: boolean;
  isValid?: boolean;
};

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  visible,
  onClose,
  phoneNumber,
  LocaluserData,
}) => {
  const reduxLangId = useAppSelector((state) => state.langSlice.i18LangStatus);
  const { t } = useTranslation(reduxLangId);
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState<any | null>(null);
  const [questionsWithType, setQuestionsWithType] = useState<
    QuestionWithType[]
  >([]);

  const langIdMap: Record<string, number> = { ar: 2, en: 1 };
  const langId =
    langIdMap[reduxLangId] ||
    parseInt(localStorage.getItem("languageId") || "1", 10);

  useEffect(() => {
    if (visible) {
      if (phoneNumber) fetchUserData();

      fetchAdditionalInfo();
    }
  }, [visible, phoneNumber]);

  useEffect(() => {
    if (userData?.clientId) {
      fetchClientExtraInfo(userData.clientId);
    }
  }, [userData]);

  const fetchUserData = async () => {
    if (!phoneNumber) return;

    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.MobileUser.getById,
          parameters: `_username=${phoneNumber.replace("+", "%2B")}`,
        })
      )
    );

    setUserData(result?.payload?.data || null);
  };

  const fetchAdditionalInfo = async () => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.AdditionalInfo.getAll,
          parameters: `_languageId=${langId}`,
        })
      )
    );

    const data = result?.payload?.data || [];

    const mapped = data.map((item: any) => ({
      value: item.recordId,
      label: item.question,
      type: item.typeName,
      typeId: item.type,
    }));

    setQuestionsWithType(mapped);
  };

  const fetchClientExtraInfo = async (clientId: number) => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.ExtraInfo.getAll,
          parameters: `_clientId=${clientId}`,
        })
      )
    );

    const extraInfoData = result?.payload?.data || [];

    setQuestionsWithType((prev) =>
      prev.map((q) => {
        const match = extraInfoData.find(
          (item: any) => item.extraRowId === q.value
        );
        return match
          ? {
              ...q,
              body: match.body,
              isRequested: true,
              isValid: match.isValid,
            }
          : q;
      })
    );
  };

  const handleRequest = async (field: QuestionWithType) => {
    if (!userData?.clientId) return;

    // Filter out the item being toggled
    const otherRequestedItems = questionsWithType
      .filter((q) => q.isRequested && q.value !== field.value)
      .map((q) => ({
        clientId: userData.clientId,
        extraRowId: q.value,
        type: q.typeId,
        body: q.body || "",
        isValid: q.isValid ?? false,
        isActive: true,
      }));

    let updatedPack;

    if (field.isRequested) {
      // ❌ Cancel request → exclude the item
      updatedPack = otherRequestedItems;
    } else {
      // ✅ Send new request
      const newField = {
        clientId: userData.clientId,
        extraRowId: field.value,
        type: field.typeId,
        body: field.body || "",
        isValid: false,
        isActive: true,
      };

      updatedPack = [...otherRequestedItems, newField];
    }

    await withRequestTracking(dispatch, () =>
      dispatch(
        putMobileRequest({
          extension: DashboardMobileRepository.ExtraInfo.update,
          parameters: `_clientId=${userData.clientId}`,
          body: updatedPack,
          rawBody: true,
        })
      ).unwrap()
    );

    setQuestionsWithType((prev) =>
      prev.map((q) =>
        q.value === field.value
          ? { ...q, isRequested: !field.isRequested, isValid: false }
          : q
      )
    );
    await fetchClientExtraInfo(userData.clientId);

    showToast(
      "success",
      t(field.isRequested ? "Request canceled" : "Request sent successfully")
    );
  };

  const handleValidate = async (field: QuestionWithType) => {
    if (!userData?.clientId || !field.value) return;

    const newStatus = !(field.isValid === true);

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: DashboardMobileRepository.ExtraInfo.validate,
          parameters: `_clientId=${userData.clientId}&_extraId=${field.value}&_isValid=${newStatus}`,
        })
      ).unwrap()
    );

    setQuestionsWithType((prev) =>
      prev.map((q) =>
        q.value === field.value ? { ...q, isValid: newStatus } : q
      )
    );
    await fetchClientExtraInfo(userData.clientId);

    showToast(
      "success",
      t(newStatus ? "Validated successfully" : "Validation removed")
    );
  };

  return (
    <SharedModal
      visible={visible}
      onClose={onClose}
      title={t("User Info")}
      height="80vh"
      width="80vw"
    >
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Card className="mb-4">
          <CardHeader>{t("User Information")}</CardHeader>
          <CardBody>
            <Row>
              <Col md="6">
                <CustomInput
                  name="name"
                  label={t("Name")}
                  value={LocaluserData?.clientMaster?.name || ""}
                  readOnly
                  onChange={() => {}}
                  onBlur={() => {}}
                />
              </Col>
              <Col md="6">
                <CustomInput
                  name="cellPhone"
                  label={t("Phone Number")}
                  value={LocaluserData?.clientMaster?.cellPhone || ""}
                  readOnly
                  onChange={() => {}}
                  onBlur={() => {}}
                />
              </Col>
              <Col md="6">
                <CustomInput
                  name="nationality"
                  label={t("Nationality")}
                  value={LocaluserData?.clientMaster?.nationalityName || ""}
                  readOnly
                  onChange={() => {}}
                  onBlur={() => {}}
                />
              </Col>
              <Col md="6">
                <CustomInput
                  name="idNo"
                  label={t("ID Number")}
                  value={LocaluserData?.clientRemittance?.idNo || ""}
                  readOnly
                  onChange={() => {}}
                  onBlur={() => {}}
                />
              </Col>
              <Col md="6">
                <CustomInput
                  name="city"
                  label={t("City")}
                  value={LocaluserData?.address?.city || ""}
                  readOnly
                  onChange={() => {}}
                  onBlur={() => {}}
                />
              </Col>
              <Col md="6">
                <CustomInput
                  name="district"
                  label={t("District")}
                  value={LocaluserData?.address?.cityDistrict || ""}
                  readOnly
                  onChange={() => {}}
                  onBlur={() => {}}
                />
              </Col>
              <Col md="6">
                <CustomInput
                  name="street"
                  label={t("Street")}
                  value={LocaluserData?.address?.street1 || ""}
                  readOnly
                  onChange={() => {}}
                  onBlur={() => {}}
                />
              </Col>
              <Col md="6">
                <CustomInput
                  name="status"
                  label={t("Status")}
                  value={LocaluserData?.clientMaster?.statusName || ""}
                  readOnly
                  onChange={() => {}}
                  onBlur={() => {}}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>{t("Extra Information")}</CardHeader>
          <CardBody>
            {questionsWithType.map((q) => (
              <Row key={q.value} className="align-items-center mb-3">
                <Col xs="6">
                  {q.type === "Text Field" || q.type === "Number Field" ? (
                    <CustomInput
                      name={`field_${q.value}`}
                      label={q.label}
                      type="text"
                      value={q.body || ""}
                      readOnly={!!q.isRequested}
                      onChange={() => {}}
                      onBlur={() => {}}
                    />
                  ) : q.type === "PDF" ? (
                    <CustomPdfDisplayInput
                      name={`file_${q.value}`}
                      label={q.label}
                      isRequired={false}
                      ar={false}
                      fileUrl={""}
                      fileName={q.body || ""}
                    />
                  ) : (
                    <strong>{q.label}</strong>
                  )}
                </Col>
                <Col xs="3">
                  <SharedButton
                    title={q.isRequested ? t("Cancel") : t("Request")}
                    onClick={() => handleRequest(q)}
                  />
                </Col>
                <Col xs="3">
                  <SharedButton
                    title={q.isValid ? t("Revoke") : t("Validate")}
                    onClick={() => handleValidate(q)}
                    disabled={!q.isRequested}
                  />
                </Col>
              </Row>
            ))}
          </CardBody>
        </Card>
      </div>
    </SharedModal>
  );
};

export default UserInfoForm;
