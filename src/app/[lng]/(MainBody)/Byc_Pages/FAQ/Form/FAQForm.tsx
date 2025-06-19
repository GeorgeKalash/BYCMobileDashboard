"use client";

import { useRef } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/Redux/Hooks";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import {
  postMobileRequest,
  putMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import { showToast } from "@/Shared/Components/showToast";
import CustomInput from "@/Shared/Components/CustomInput";
import CustomTextarea from "@/Shared/Components/CustomTextarea";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import { useTranslation } from "react-i18next";

interface FAQFormProps {
  rowData: any;
  formikRef?: React.Ref<FormikProps<any>>;
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

  const localFormikRef = useRef<FormikProps<any>>(null);
  const formikReference = formikRef || localFormikRef;

  const initialValues = {
    recordId: rowData?.recordId ?? 0,
    question: rowData?.question ?? "",
    answer: rowData?.answer ?? "",
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().required(t("required")),
    answer: Yup.string().required(t("required")),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const payload = {
      recordId: values.recordId || 0,
      question: values.question,
      answer: values.answer,
    };

    await withRequestTracking(dispatch, () =>
      dispatch(
        modalAction === "edit"
          ? putMobileRequest({
              extension: DashboardMobileRepository.FAQ.update,
              body: payload,
              rawBody: true,
            })
          : postMobileRequest({
              extension: DashboardMobileRepository.FAQ.add,
              body: payload,
              rawBody: true,
            })
      ).unwrap()
    );

    showToast("success", t("Saved successfully"));
    onSuccessSubmit?.();
  };

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
          <Card className="border">
            <CardHeader className="fw-bold">{t("FAQ Entry")}</CardHeader>
            <CardBody>
              <Row>
                <Col md={6}>
                  <CustomInput name="question" label={t("Question")} />
                  <CustomTextarea name="answer" label={t("Answer")} rows={5} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default FAQForm;
