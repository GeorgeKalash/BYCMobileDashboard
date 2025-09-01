"use client";
import React, { useEffect, useState } from "react";
import SharedModal from "@/Shared/Components/SharedModal";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import {
  getMobileRequest,
  postMobileRequest,
  deleteMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { Col, Row } from "reactstrap";
import CustomInput from "@/Shared/Components/CustomInput";
import SharedButton from "@/Shared/Components/SharedButton";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import CustomPdfDisplayInput from "@/Shared/Components/CustomFileInput";
import { showToast } from "@/Shared/Components/showToast";

interface UserInfoFormProps {
  visible: boolean;
  onClose: () => void;
  userData?: any;
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
  userData,
}) => {
  const reduxLangId = useAppSelector((state) => state.langSlice.i18LangStatus);
  const { t } = useTranslation(reduxLangId);
  const dispatch = useAppDispatch();

  const [questionsWithType, setQuestionsWithType] = useState<
    QuestionWithType[]
  >([]);

  const langIdMap: Record<string, number> = { ar: 2, en: 1 };
  const langId =
    langIdMap[reduxLangId] ||
    parseInt(localStorage.getItem("languageId") || "1", 10);

  useEffect(() => {
    if (visible && userData?.clientId) {
      fetchAllData();
    }
  }, [visible, userData]);

  const fetchAllData = async () => {
    const [questionsRes, extraInfoRes] = await Promise.all([
      withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: DashboardMobileRepository.AdditionalInfo.getAll,
            parameters: `_languageId=${langId}`,
          })
        )
      ),
      withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: DashboardMobileRepository.ExtraInfo.getAll,
            parameters: `_clientId=${userData.clientId}`,
          })
        )
      ),
    ]);

    const questions = questionsRes?.payload?.data || [];
    const extraInfo = extraInfoRes?.payload?.data || [];

    const merged = questions.map((item: any) => {
      const match = extraInfo.find((x: any) => x.extraRowId === item.recordId);
      return {
        value: item.recordId,
        label: item.question,
        type: item.typeName,
        typeId: item.type,
        body: match?.body || "",
        isRequested: !!match,
        isValid: match?.isValid ?? false,
      };
    });

    setQuestionsWithType(merged);
  };

  const handleRequest = async (field: QuestionWithType) => {
    if (!userData?.clientId) return;

        const payload = {
        clientId: userData.clientId,
        extraRowId: field.value,
        type: field.typeId,
        body: field.body || "",
        isValid: field.isValid ?? false,
        isActive: !field.isRequested,
      };

    if (field.isRequested) {
      await withRequestTracking(dispatch, () =>
        dispatch(
          deleteMobileRequest({
            extension: DashboardMobileRepository.ExtraInfo.cancel, 
            body: payload,
            rawBody: true,
          })
        ).unwrap()
      );

      showToast("success", t("Request canceled"));
    } else {
      await withRequestTracking(dispatch, () =>
        dispatch(
          postMobileRequest({
            extension: DashboardMobileRepository.ExtraInfo.request,
            body: payload,
            rawBody: true,
          })
        ).unwrap()
      );

      showToast("success", t("Request sent successfully"));
    }

    await fetchAllData();
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

    await fetchAllData();

    showToast(
      "success",
      t(newStatus ? "Validated successfully" : "Validation removed")
    );
  };

  return (
    <SharedModal
      visible={visible}
      onClose={onClose}
      title={t("Additional Data")}
      height="60vh"
      width="65vw"
    >
      {questionsWithType.map((q) => {
        return(
          <Row key={q.value} className="align-items-center mb-3">
            <Col xs="8">
              {q.type === "Text Field" || q.type === "Number Field" ? (
                <CustomInput
                  name={`field_${q.value}`}
                  label={q.label}
                  type="text"
                  value={q.body || ""}
                  readOnly={!!q.isRequested}
                />
              ) : q.type === "PDF" ? (
                <CustomPdfDisplayInput
                  name={`file_${q.value}`}
                  label={q.label}
                  ar={false}
                  clientId={userData.clientId}
                  extraRowId={q.value}
                  fileName={q.body || ""}
                />
              ) : (
                <strong>{q.label}</strong>
              )}
            </Col>
            <Col xs="2">
              <SharedButton
                title={q.isRequested ? t("Cancel") : t("Request")}
                onClick={() => handleRequest(q)}
                color={q.isRequested ? "danger" : "success"}
              />
            </Col>
            <Col xs="2">
              <SharedButton
                title={q.isValid ? t("Revoke") : t("Validate")}
                onClick={() => handleValidate(q)}
                disabled={!q.isRequested || !q.body?.trim()}
                color={q.isValid ? "warning" : "primary"}
              />
            </Col>
          </Row>
        )
      })}
    </SharedModal>
  );
};

export default UserInfoForm;
