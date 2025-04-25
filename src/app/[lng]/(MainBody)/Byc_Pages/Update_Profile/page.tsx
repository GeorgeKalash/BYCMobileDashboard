"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { CardBody, Card, Col, Row } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedButton from "@/Shared/Components/SharedButton";
import CustomInput from "../../../../../Shared/Components/CustomInput";
import CustomSelect from "../../../../../Shared/Components/CustomSelect";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { getMobileRequest, postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { SystemMobileRepository } from "@/Repositories/SystemMobileRepository";
import { withRequestTracking } from "@/utils/withRequestTracking ";

const initialValues = {
  yakeen_enable_service: "", 
  yakeen_daily_request_count: "",
  yakeen_monthly_request_count: "",
  yakeen_user_daily_request: "",
  daily_user_new_request: "",
};

const validationSchema = Yup.object({
  yakeen_enable_service: Yup.string().required("هذه الخانة مطلوبة"),
  yakeen_daily_request_count: Yup.number()
    .typeError("يجب أن يكون رقماً")
    .required("هذه الخانة مطلوبة"),
  yakeen_monthly_request_count: Yup.number()
    .typeError("يجب أن يكون رقماً")
    .required("هذه الخانة مطلوبة"),
  yakeen_user_daily_request: Yup.number()
    .typeError("يجب أن يكون رقماً")
    .required("هذه الخانة مطلوبة"),
  daily_user_new_request: Yup.number()
    .typeError("يجب أن يكون رقماً")
    .required("هذه الخانة مطلوبة"),
});

const MobileVerificationForm = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const fetchData = async (setValues: (values: typeof initialValues) => void) => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: SystemMobileRepository.Default.get,
          parameters: "_key=",
        })
      ).unwrap()
    );

    if (Array.isArray(result)) {
      const dataObj: Partial<typeof initialValues> = {};

      result.forEach((item: { key: string; value: string }) => {
        if (item.key in initialValues) {
          dataObj[item.key as keyof typeof initialValues] = item.value;
        }
      });

      setValues({
        ...initialValues,
        ...dataObj,
      });
    }
  };

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
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchData(() => {}); 
    };
    loadData();
  }, []);

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Update Profile")} />
        <CardBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, setValues, validateForm }) => {
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

                  if (Array.isArray(result)) {
                    const dataObj: Partial<typeof initialValues> = {};

                    result.forEach((item: { key: string; value: string }) => {
                      if (item.key in initialValues) {
                        dataObj[item.key as keyof typeof initialValues] = item.value;
                      }
                    });

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
                        isRequired
                        dataSetId={11}
                        defaultIndex={0}
                        valueKey="key"
                        labelKey="value"
                        value={values.yakeen_enable_service}
                        onChange={(val) => setFieldValue("yakeen_enable_service", val)}
                      />
                    </Col>
                    <Col md="4">
                      <CustomInput
                        name="yakeen_daily_request_count"
                        label={t("Number of checks per day")}
                        type="number"
                        isRequired
                        placeholder="0"
                      />
                    </Col>
                    <Col md="4">
                      <CustomInput
                        name="yakeen_monthly_request_count"
                        label={t("Number of checks per month")}
                        type="number"
                        isRequired
                        placeholder="0"
                      />
                    </Col>
                    <Col md="6">
                      <CustomInput
                        name="yakeen_user_daily_request"
                        label={t("Maximum number of Nafath access codes")}
                        type="number"
                        isRequired
                        placeholder="0"
                      />
                    </Col>
                    <Col md="6">
                      <CustomInput
                        name="daily_user_new_request"
                        label={t("Maximum number of Nafath access codes")}
                        type="number"
                        isRequired
                        placeholder="0"
                      />
                    </Col>
                  </Row>
                  <SharedButton title="حفظ" color="primary" type="submit" />
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
