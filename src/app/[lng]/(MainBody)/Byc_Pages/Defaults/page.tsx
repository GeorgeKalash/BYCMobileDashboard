"use client";

import React, { useEffect } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { CardBody, Card, Col, Row } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedButton from "@/Shared/Components/SharedButton";
import CustomInput from "../../../../../Shared/Components/CustomInput";
import CustomSelect from "../../../../../Shared/Components/CustomSelect";
import { useTranslation } from "@/app/i18n/client";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  getMobileRequest,
  postMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { SystemMobileRepository } from "@/Repositories/SystemMobileRepository";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { showToast } from "@/Shared/Components/showToast";

const initialValues = {
  "maintenance-mode": "",
  yakeen_enable_service: "",
  yakeen_user_daily_request: "",
  yakeen_user_monthly_request: "",
  nafath_enable_service: "",
  nafath_daily_request_count: "",
  nafath_monthly_request_count: "",
  daily_user_new_request: "",
  max_daily_user_new_request: "",
  enable_fast_password_service: "",
  enable_biometric_service: "",
};

const validationSchema = Yup.object({
  "maintenance-mode": Yup.string().required("Required"),
  yakeen_enable_service: Yup.string().required("Required"),
  yakeen_user_daily_request: Yup.string().required("Required"),
  yakeen_user_monthly_request: Yup.string().required("Required"),
  nafath_enable_service: Yup.string().required("Required"),
  nafath_daily_request_count: Yup.string().required("Required"),
  nafath_monthly_request_count: Yup.string().required("Required"),
  daily_user_new_request: Yup.string().required("Required"),
  max_daily_user_new_request: Yup.string().required("Required"),
  enable_fast_password_service: Yup.string().required("Required"),
  enable_biometric_service: Yup.string().required("Required"),
});

const MobileVerificationForm = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    const transformedData = Object.entries(values).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: SystemMobileRepository.Default.set,
          body: transformedData,
          rawBody: true,
        })
      ).unwrap()
    );
    setSubmitting(false);
    showToast("success");
  };

  return (
    <Col xs="12">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ values, setValues, setFieldValue }) => {
          useEffect(() => {
            const fetchAndSet = async () => {
              const result = await withRequestTracking(dispatch, () =>
                dispatch(
                  getMobileRequest({
                    extension: SystemMobileRepository.Default.get,
                    parameters: "_key=",
                  })
                ).unwrap()
              );

              if (result.status === 1 && Array.isArray(result.data)) {
                const dataObj: Partial<typeof initialValues> = {};
                result.data.forEach((item: { key: string; value: string }) => {
                  if (item.key in initialValues) {
                    dataObj[item.key as keyof typeof initialValues] =
                      item.value;
                  }
                });
                setValues({ ...initialValues, ...dataObj });
              }
            };
            fetchAndSet();
          }, []);

          return (
            <Form style={{ maxHeight: "85vh", overflowY: "auto" }}>
              <Card className="mb-3">
                <CommonCardHeader title={t("Maintenance Mode")} />
                <CardBody>
                  <Row>
                    <Col md="4">
                      <CustomSelect
                        name="maintenance-mode"
                        label={t("Enable Maintenance Mode")}
                        dataSetId={11}
                        valueKey="key"
                        labelKey="value"
                        value={Number(values["maintenance-mode"])}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card className="mb-3">
                <CommonCardHeader title={t("YAKEEN Settings")} />
                <CardBody>
                  <Row className="gy-3">
                    <Col md="4">
                      <CustomSelect
                        name="yakeen_enable_service"
                        label={t("Enable YAKEEN")}
                        dataSetId={11}
                        valueKey="key"
                        labelKey="value"
                        value={Number(values.yakeen_enable_service)}
                        onChange={(val) =>
                          setFieldValue("yakeen_enable_service", val)
                        }
                      />
                    </Col>
                    <Col md="4">
                      <CustomInput
                        name="yakeen_user_daily_request"
                        label={t("Daily Request")}
                      />
                    </Col>
                    <Col md="4">
                      <CustomInput
                        name="yakeen_user_monthly_request"
                        label={t("Monthly Request")}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card className="mb-3">
                <CommonCardHeader title={t("NAFATH Settings")} />
                <CardBody>
                  <Row className="gy-3">
                    <Col md="4">
                      <CustomSelect
                        name="nafath_enable_service"
                        label={t("Enable NAFATH")}
                        dataSetId={11}
                        valueKey="key"
                        labelKey="value"
                        value={Number(values.nafath_enable_service)}
                        onChange={(val) =>
                          setFieldValue("nafath_enable_service", val)
                        }
                      />
                    </Col>
                    <Col md="4">
                      <CustomInput
                        name="nafath_daily_request_count"
                        label={t("Daily Request Count")}
                      />
                    </Col>
                    <Col md="4">
                      <CustomInput
                        name="nafath_monthly_request_count"
                        label={t("Monthly Request Count")}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card className="mb-3">
                <CommonCardHeader title={t("User Request Limits")} />
                <CardBody>
                  <Row className="gy-3">
                    <Col md="4">
                      <CustomInput
                        name="daily_user_new_request"
                        label={t("New Users Per Day")}
                      />
                    </Col>
                    <Col md="4">
                      <CustomInput
                        name="max_daily_user_new_request"
                        label={t("Max Daily User Requests")}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card className="mb-3">
                <CommonCardHeader title={t("Security Settings")} />
                <CardBody>
                  <Row className="gy-3">
                    <Col md="4">
                      <CustomSelect
                        name="enable_fast_password_service"
                        label={t("Enable Fast Password")}
                        dataSetId={11}
                        valueKey="key"
                        labelKey="value"
                        value={Number(values.enable_fast_password_service)}
                        onChange={(val) =>
                          setFieldValue("enable_fast_password_service", val)
                        }
                      />
                    </Col>
                    <Col md="4">
                      <CustomSelect
                        name="enable_biometric_service"
                        label={t("Enable Biometric")}
                        dataSetId={11}
                        valueKey="key"
                        labelKey="value"
                        value={Number(values.enable_biometric_service)}
                        onChange={(val) =>
                          setFieldValue("enable_biometric_service", val)
                        }
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <SharedButton type="submit" color="primary" title={t("Submit")} />
            </Form>
          );
        }}
      </Formik>
    </Col>
  );
};

export default MobileVerificationForm;
