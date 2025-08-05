"use client";

import React, { KeyboardEvent, useEffect, useRef } from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import { Col, Row } from "reactstrap";
import { getMobileRequest, postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import * as Yup from "yup";
import CustomTextarea from "@/Shared/Components/CustomTextarea";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import CustomDatePicker from "@/Shared/Components/CustomDatePicker";
import { format } from "date-fns";

const TermsAndConditionsForm = ({
  recordId,
  formikRef,
  onSuccessSubmit,
  modalAction,
}: {
  recordId: number;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
  modalAction: "add" | "edit" | null;
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  if (!recordId && modalAction === "edit") return null;

  const supportedLanguagesRef = useRef<{ id: number; text: string }[]>([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);

  const initialValues = {
    header: {
      recordId: recordId,
      version: "",
      publishingDate: format(new Date(), "MM-dd-yyyy"),
    },
    languages: supportedLanguagesRef.current.map((lang) => ({
      termsId: recordId,
      languageId: lang.id,
      text: lang.text,
    })),
  };

  const validationSchema = Yup.object().shape({
   
    languages: Yup.array().of(
      Yup.object().shape({
        text: Yup.string().required(t("Text is required")),
      })
    ),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: DashboardMobileRepository.TermsAndConditions.setpack,
          body: {
            ...values,
            header: {
              ...values.header,
              publishingDate: new Date(values.header.publishingDate).toISOString(),
            },
          },
          rawBody: true,
        })
      ).unwrap()
    );

    setSubmitting(false);
    if (onSuccessSubmit) {
      onSuccessSubmit();
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLFormElement>,
    submitForm: () => void
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitForm();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      {({ submitForm, setValues, values, setFieldValue }) => {
       useEffect(() => {
        const fetchData = async () => {
          if (recordId) {
            const result = await withRequestTracking(dispatch, () =>
              dispatch(
                getMobileRequest({
                  extension: DashboardMobileRepository.TermsAndConditions.getpack,
                  parameters: `_recordId=${recordId}`,
                })
              )
            );

            if (result?.payload?.data) {
              const apiData = result.payload.data;

              const mergedLanguages = supportedLanguagesRef.current.map((lang) => {
                const existing = apiData.languages?.find(
                  (l: any) => l.languageId === lang.id
                );
                return {
                  termsId: recordId,
                  languageId: lang.id,
                  text: existing?.text || "",
                };
              });

              const rawDate = apiData?.header?.publishingDate;
              let safePublishingDate: string;

              if (rawDate && !isNaN(new Date(rawDate).getTime())) {
                safePublishingDate = format(new Date(rawDate), "MM-dd-yyyy");
              } else {
                safePublishingDate = format(new Date(), "MM-dd-yyyy");
              }

              setValues({
                header: {
                  ...apiData.header,
                  version: String(apiData.header.version ?? ""),
                  publishingDate: safePublishingDate,
                },
                languages: mergedLanguages,
              });
            }
          }
        };

        fetchData();
      }, [recordId, dispatch, setValues]);

        return (
          <Form onKeyDown={(e) => handleKeyDown(e, submitForm)}>
            <Row>
              <Col md={12}>
                <CustomInput
                  name="header.version"
                  value={values?.header?.version ?? ""}
                  label={t("version")}
                  type="text"
                  onChange={(e) => {
                    const val = e.target.value;
                    const cleaned = val.replace(/[^0-9.]/g, "");
                    setFieldValue("header.version", cleaned);
                  }}
                />
                <CustomDatePicker
                  name="header.publishingDate"
                  label={t("publishingDate")}
                  value={values?.header?.publishingDate}
                  onChange={(val) => setFieldValue("header.publishingDate", val)}
                />
              </Col>
              {values.languages.map((lang, index) => (
                <Col md={6} key={lang.languageId}>
                  <CustomTextarea
                    name={`languages.${index}.text`}
                    label={`${t("Text")} (${t(`Language ${lang.languageId}`)})`}
                    rows={5}
                    value={lang.text}
                    onChange={(e) =>
                      setFieldValue(`languages.${index}.text`, e.target.value)
                    }
                  />
                </Col>
              ))}
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TermsAndConditionsForm;
