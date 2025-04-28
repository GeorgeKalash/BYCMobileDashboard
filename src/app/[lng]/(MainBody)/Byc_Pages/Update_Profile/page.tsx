"use client";

import React, { useEffect } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { CardBody, Card, Col, Row } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedButton from "@/Shared/Components/SharedButton";
import CustomInput from "../../../../../Shared/Components/CustomInput";
import CustomSelect from "../../../../../Shared/Components/CustomSelect";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  getMobileRequest,
  postMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { SystemMobileRepository } from "@/Repositories/SystemMobileRepository";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { showToast } from "@/Shared/Components/showToast";

const initialValues = {
  yakeen_enable_service: "",
  yakeen_daily_request_count: "",
  yakeen_monthly_request_count: "",
  yakeen_user_daily_request: "",
  daily_user_new_request: "",
};

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
      <Card>
        <CommonCardHeader title={t("Update Profile")} />
        <CardBody>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, setValues }) => {
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

                    result.data.forEach(
                      (item: { key: string; value: string }) => {
                        if (item.key in initialValues) {
                          dataObj[item.key as keyof typeof initialValues] =
                            item.value;
                        }
                      }
                    );

                    setValues({
                      ...initialValues,
                      ...dataObj,
                    });
                  }
                };
                fetchAndSet();
              }, []);

              return (
                <Form>
                  <Row className="gy-3">
                    <Col md="4">
                      <CustomSelect
                        name="yakeen_enable_service"
                        label={t("Check mobile compatibility with YAKEEN")}
                        dataSetId={11}
                        valueKey="key"
                        labelKey="value"
                        value={values.yakeen_enable_service}
                      />
                    </Col>
                    <Col md="4">
                      <CustomInput
                        name="yakeen_daily_request_count"
                        label={t("Number of YAKEEN checks per day")}
                        type="number"
                        placeholder="0"
                      />
                    </Col>
                    <Col md="4">
                      <CustomInput
                        name="yakeen_monthly_request_count"
                        label={t("Number of YAKEEN checks per month")}
                        type="number"
                        placeholder="0"
                      />
                    </Col>
                    <Col md="6">
                      <CustomInput
                        name="yakeen_user_daily_request"
                        label={t("Maximum number of Nafath access codes")}
                        type="number"
                        placeholder="0"
                      />
                    </Col>
                    <Col md="6">
                      <CustomInput
                        name="daily_user_new_request"
                        label={t("Maximum number of new memberships per day")}
                        type="number"
                        placeholder="0"
                      />
                    </Col>
                  </Row>
                  <SharedButton
                    color="primary"
                    type="submit"
                    title={t("Submit")}
                  />
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    </Col>
  );
};

export default MobileVerificationForm;
