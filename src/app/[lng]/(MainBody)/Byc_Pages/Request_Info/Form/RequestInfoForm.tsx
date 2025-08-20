"use client";
import React, { useEffect, useState } from "react";
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
import { showToast } from "@/Shared/Components/showToast";

interface RequestInfoFormProps {
  visible: boolean;
  filters: {
    fromBirthDate: string;
    toBirthDate: string;
    nationalityId: number | null;
  };
}

type QuestionWithType = {
  value: number;
  label: string;
  type: string;
  typeId: number;
  body?: string;
  isActive?: boolean;
  isValid?: boolean;
};

const RequestInfoForm: React.FC<RequestInfoFormProps> = ({ visible, filters }) => {
  const reduxLangId = useAppSelector((state) => state.langSlice.i18LangStatus);
  const { t } = useTranslation(reduxLangId);
  const dispatch = useAppDispatch();

  const [questionsWithType, setQuestionsWithType] = useState<QuestionWithType[]>([]);

  const langIdMap: Record<string, number> = { ar: 2, en: 1 };
  const langId =
    langIdMap[reduxLangId] ||
    parseInt(localStorage.getItem("languageId") || "1", 10);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const [questionsRes] = await Promise.all([
      withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: DashboardMobileRepository.AdditionalInfo.getAll,
            parameters: `_languageId=${langId}`,
          })
        )
      ),
    ]);

    const questions = questionsRes?.payload?.data || [];

    const mappedQuestions: QuestionWithType[] = questions.map((q: any) => ({
      value: q.recordId,
      label: q.question,
      type: q.typeName,
      typeId: q.type,
      isActive: q.isActive ?? false,
      isValid: q.isValid ?? false,
    }));

    setQuestionsWithType(mappedQuestions);
  };

  const handleRequest = async (field: QuestionWithType) => {
    const payload = {
      clientExtras: {
        clientId: 0,
        extraRowId: field.value,
        type: field.typeId,
        body: field.body || null,
        isValid: true,
        isActive: true,
      },
      filter: {
        fromBirthDate: filters.fromBirthDate
          ? new Date(filters.fromBirthDate).toISOString()
          : null,
        toBirthDate: filters.toBirthDate
          ? new Date(filters.toBirthDate).toISOString()
          : null,
        nationalityId: filters.nationalityId ?? null,
        username: "",
        idNo: "",
        sponsors: [""],
      },
        cityId: null,
        street: "",
        lastLogin: null,
        fromCreationDate: null,
        toCreationDate: null,
        userMode: 1,
    };
console.log(payload)
    if (field.isActive) {
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
            extension: DashboardMobileRepository.ExtraInfo.Broadcastrequest,
            body: payload,
            rawBody: true,
          })
        ).unwrap()
      );

      showToast("success", t("Request sent successfully"));
    }

    await fetchAllData();
  };

  return (
    <>
      {questionsWithType.map((q) => (
        <Row key={q.value} className="align-items-center mb-3">
          <Col xs="10">
            <CustomInput
              name={`field_${q.value}`}
              type="text"
              value={q.label}
              readOnly={true}
            />
          </Col>
          <Col xs="2">
            <SharedButton
              title={q.isActive ? t("Cancel") : t("Request")}
              onClick={() => handleRequest(q)}
              color={q.isActive ? "danger" : "success"}
            />
          </Col>
        </Row>
      ))}
    </>
  );
};

export default RequestInfoForm;
