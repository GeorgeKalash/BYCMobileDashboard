"use client";
import React, { useEffect, useState, useCallback } from "react";
import SharedModal from "@/Shared/Components/SharedModal";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap";
import { showToast } from "@/Shared/Components/showToast";
import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";

interface AdditionalInfoFormProps {
  visible: boolean;
  onClose: () => void;
  phoneNumber?: string;
}

type OptionType = {
  value: string | number;
  label: string;
};

type QuestionWithType = {
  value: string | number;
  label: string;
  type: string;
};

const FIELD_TYPE_DATASET = 3629;
const EXTRA_INFO_QUESTIONS_DATASET = 3628;

const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({
  visible,
  onClose,
  phoneNumber,
}) => {
  const reduxLangId = useAppSelector((state) => state.langSlice.i18LangStatus);
  const { t } = useTranslation(reduxLangId);
  const dispatch = useAppDispatch();

  const [questionsWithType, setQuestionsWithType] = useState<
    QuestionWithType[]
  >([]);
  const [loading, setLoading] = useState(true);

  const langIdMap: Record<string, number> = { ar: 1, en: 2 };
  const langId =
    langIdMap[reduxLangId] ||
    parseInt(localStorage.getItem("languageId") || "1", 10);

  const fetchKVSOptions = useCallback(
    async (datasetId: number): Promise<OptionType[]> => {
      const result = await withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: "/api/KVS/getAllKVS",
            parameters: `_dataset=${datasetId}&_language=${langId}`,
          })
        )
      );

      const data = result?.payload?.data || [];
      return data.map((item: any) => ({
        value: item.key,
        label: item.value,
      }));
    },
    [dispatch, langId]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fieldTypes, extraInfoQuestions] = await Promise.all([
        fetchKVSOptions(FIELD_TYPE_DATASET),
        fetchKVSOptions(EXTRA_INFO_QUESTIONS_DATASET),
      ]);

      const typeMap = fieldTypes.reduce((acc, curr) => {
        acc[curr.value.toString()] = curr.label;
        return acc;
      }, {} as Record<string, string>);

      const combined = extraInfoQuestions.map((q) => ({
        ...q,
        type: typeMap[q.value.toString()] || "Unknown",
      }));

      setQuestionsWithType(combined);
    } catch (error) {
      showToast("error");
    } finally {
      setLoading(false);
    }
  }, [fetchKVSOptions]);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible, loadData]);

  return (
    <SharedModal
      visible={visible}
      onClose={onClose}
      title={t("User Info")}
      height="80vh"
      width="60vw"
    >
      <div style={{ padding: "1rem", maxHeight: "70vh", overflowY: "auto" }}>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "150px" }}
          >
            <Spinner size="lg" />
          </div>
        ) : (
          <Card>
            <>
              <ul>
                {questionsWithType.map((q) => (
                  <li key={q.value}>
                    <Row className="align-items-center">
                      <Col xs="10">
                        <strong>{q.label}</strong> — <em>{q.type}</em>
                      </Col>
                      <Col xs="2" className="text-end">
                        <SharedCheckbox />
                      </Col>
                    </Row>
                  </li>
                ))}
              </ul>
            </>
          </Card>
        )}
      </div>
    </SharedModal>
  );
};

export default AdditionalInfoForm;
