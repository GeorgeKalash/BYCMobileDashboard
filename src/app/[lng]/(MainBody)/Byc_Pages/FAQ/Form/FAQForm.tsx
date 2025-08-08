"use client";

import { useEffect, useRef, useCallback } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/Redux/Hooks";
import { withRequestTracking } from "@/utils/withRequestTracking";

import {
  postMobileRequest,
  getMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import { showToast } from "@/Shared/Components/showToast";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomTextarea from "@/Shared/Components/CustomTextarea";
import {  Col, Row } from "reactstrap";
import { useTranslation } from "react-i18next";

interface FAQFormProps {
  rowData: any;
  formikRef?: React.RefObject<FormikProps<any>>;
  modalAction: "add" | "edit" | null;
  onSuccessSubmit?: () => void;
}

const FAQForm = ({
  rowData,
  formikRef,
  modalAction,
  onSuccessSubmit,
}: FAQFormProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const localFormikRef = useRef<FormikProps<any> | null>(null);
  const formikReference = formikRef ?? localFormikRef;

  const supportedLanguagesRef = useRef([
    { id: 1, questionKey: "question", answerKey: "answer" },
    { id: 2, questionKey: "question2", answerKey: "answer2" },
  ]);

  const generateInitialValues = () => {
    const langFields = supportedLanguagesRef.current.reduce((acc, lang) => {
      acc[lang.questionKey] = "";
      acc[lang.answerKey] = "";
      return acc;
    }, {} as Record<string, string>);

    return {
      recordId: "",
      title: "",
      ...langFields,
    };
  };

  const generateValidationSchema = () => {
    const langSchema = supportedLanguagesRef.current.reduce((acc, lang) => {
      acc[lang.questionKey] = Yup.string().required(t("required"));
      acc[lang.answerKey] = Yup.string().required(t("required"));
      return acc;
    }, {} as Record<string, any>);

    return Yup.object().shape({
      title: Yup.string().required(t("required")),
      ...langSchema,
    });
  };

  const initialValues = generateInitialValues();
  const validationSchema = generateValidationSchema();

  const handleSubmit = async (values: typeof initialValues) => {
    const languages = supportedLanguagesRef.current.map((lang) => ({
      faqId: rowData?.recordId || 0,
      languageId: lang.id,
      question: (values as any)[lang.questionKey],
      answer: (values as any)[lang.answerKey],
    }));

    const payload = {
      header: {
        recordId: rowData?.recordId || 0,
        title: values.title,
      },
      languages,
    };

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: DashboardMobileRepository.FAQ.setpack,
          body: payload,
          rawBody: true,
        })
      ).unwrap()
    );

    showToast("success", t("Saved successfully"));
    onSuccessSubmit?.();
  };

  const fetchFAQ = useCallback(async () => {
    if (modalAction === "edit" && formikReference.current) {
      const response = await withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: `${DashboardMobileRepository.FAQ.getpack}?_recordId=${rowData.recordId}`,
          })
        )
      );

      const data = response.payload.data;
      const languagesFromApi = data?.languages || [];

      supportedLanguagesRef.current = languagesFromApi.map(
        (lang: any, index: number) => ({
          id: lang.languageId,
          questionKey: `question${index === 0 ? "" : index + 1}`,
          answerKey: `answer${index === 0 ? "" : index + 1}`,
        })
      );

      const getLanguageField = (
        field: "question" | "answer",
        langId: number
      ): string =>
        data?.languages?.find((lang: any) => lang.languageId === langId)?.[
          field
        ] ?? "";

      const langFields = supportedLanguagesRef.current.reduce((acc, lang) => {
        acc[lang.questionKey] = getLanguageField("question", lang.id);
        acc[lang.answerKey] = getLanguageField("answer", lang.id);
        return acc;
      }, {} as Record<string, string>);

      formikReference.current?.setValues({
        recordId: data?.header?.recordId?.toString() || "",
        title: data?.header?.title || "",
        ...langFields,
      });
    }
  }, [dispatch, modalAction, rowData, formikReference]);

  useEffect(() => {
    fetchFAQ();
  }, [fetchFAQ]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      innerRef={formikReference}
    >
      {() => (
        <Form>
          <Row>
            <Col md={12}>
              <CustomInput name="title" label={t("FAQ Title")} />
            </Col>
          </Row>
          <Row>
            {supportedLanguagesRef.current.map((lang) => (
              <Col md={6} key={lang.id}>
                <CustomInput
                  name={lang.questionKey}
                  label={`${t("Question")} (${t(`Language ${lang.id}`)})`}
                />
                <CustomTextarea
                  name={lang.answerKey}
                  label={`${t("Answer")} (${t(`Language ${lang.id}`)})`}
                  rows={5}
                />
              </Col>
            ))}
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default FAQForm;
