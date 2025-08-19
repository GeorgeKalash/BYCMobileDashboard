"use client";

import React from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import { Card, CardBody, Col, Row } from "reactstrap";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import * as Yup from "yup";
import { showToast } from "@/Shared/Components/showToast";
import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import ColorPreview from "./ColorPreview";
import PhoneSkeletonPreview from "./PhoneSkeletonPreview";

type Palette = Record<string, string>;

const ActivateThemeForm = ({
  rowData,
  formikRef,
  allData = [],
  onSuccessSubmit,
}: {
  rowData: any;
  allData?: any[];

  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  if (!rowData) return null;
  const palette: Palette = rowData?.color ?? {};

  const initialValues = {
    name: rowData?.name || "",
    isInactive: !!rowData?.isInactive,
  };

  const validationSchema = Yup.object().shape({
    isInactive: Yup.boolean().required(t("Theme status is required")),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    const payload = (allData || []).map((item) =>
      item.languageId === rowData.languageId
        ? {
            ...item,
            name: String(item.name ?? rowData.name ?? ""),
            description: String(item.description ?? rowData.description ?? ""),
            color: item.color ?? rowData.color ?? {},
            isInactive: values.isInactive,
          }
        : {
            ...item,
            name: String(item.name ?? ""),
            description: String(item.description ?? ""),
            color: item.color ?? {},
          }
    );

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: DashboardMobileRepository.Templates.set,
          body: payload,
          rawBody: true,
        })
      ).unwrap()
    );

    setSubmitting(false);
    showToast("success");
    onSuccessSubmit?.();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Row>
            <Col xs={6}>
              <CustomInput
                name="name"
                label={t("Name")}
                placeholder={t("Enter name")}
                readOnly
              />
            </Col>
            <Col md={6} className="d-flex align-items-center">
              <div className="w-100">
                <SharedCheckbox
                  label={t("isInactive")}
                  checked={values.isInactive}
                  onChange={(checked) => setFieldValue("isInactive", checked)}
                />
              </div>
            </Col>
          </Row>

          <Card className="mt-1">
            <Row className="g-4 align-items-start">
              <Col xs={12} md={6}>
                <CardBody>
                  <ColorPreview palette={palette} />
                </CardBody>
              </Col>
              <Col xs={12} md={6}>
                <CardBody className="d-flex flex-column align-items-center">
                  <PhoneSkeletonPreview palette={palette} />
                </CardBody>
              </Col>
            </Row>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default ActivateThemeForm;
