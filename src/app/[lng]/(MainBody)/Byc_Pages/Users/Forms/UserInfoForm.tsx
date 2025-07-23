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
  phoneNumber,
  LocaluserData,
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
      updatedPack = otherRequestedItems;
    } else {
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

    await fetchAllData();

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
      title={t("User Info")}
      height="80vh"
      width="80vw"
    >
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
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
                    disabled={!q.isRequested || !q.body?.trim()}
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
