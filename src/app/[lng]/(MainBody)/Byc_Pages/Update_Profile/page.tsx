"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CardBody, Card, Col, Row, FormGroup, Label, Input } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedButton from "@/Shared/Components/SharedButton";
import CustomInput from "../../../../../Shared/Components/CustomInput";
import CustomSelect from "../../../../../Shared/Components/CustomSelect";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { getMobileRequest ,postMobileRequest} from "@/Redux/Reducers/RequestThunks";
import { SystemMobileRepository } from "@/Repositories/SystemMobileRepository";

const initialValues = {
  yakeen_enable_service: 0,
  yakeen_daily_request_count: "",
  yakeen_monthly_request_count: "",
  yakeen_user_daily_request: "",
  daily_user_new_request: "",
  unlimited: false,
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
    .when("unlimited", {
      is: false,
      then: (schema) => schema.required("هذه الخانة مطلوبة"),
    }),
});

const MobileVerificationForm = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const [submitErrors, setSubmitErrors] = useState(true);
  const dispatch = useAppDispatch()

  const fetchData = async () => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(getMobileRequest({
        extension: `${SystemMobileRepository.Default.get}`,
        parameters: '_key='
      }))
    )
    console.log(result)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    const transformedData = Object.entries(values).map(([key, value]) => ({
      key,
      value: String(value),
    }));
  
    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: `${SystemMobileRepository.Default.set}`,
          body: transformedData,
        })
      )
    );
  
    setSubmitting(false);
  };
  

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Update Profile")} />
        <CardBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit} 
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Row className="gy-3">
                  <Col md="4">
                    <CustomSelect
                      name="yakeen_enable_service"
                      label={t("Check mobile compatibility with BQIN?")}
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
                      submitErrors={submitErrors ? "invalid" : ""}
                    />
                  </Col>
                  <Col md="4">
                    <CustomInput
                      name="yakeen_monthly_request_count"
                      label={t("Number of checks per month")}
                      type="number"
                      isRequired
                      placeholder="0"
                      submitErrors={submitErrors ? "invalid" : ""}
                    />
                  </Col>
                  <Col md="6">
                    <CustomInput
                      name="yakeen_user_daily_request"
                      label={t("Maximum number of Nafath access codes")}
                      type="number"
                      isRequired
                      placeholder="0"
                      submitErrors={submitErrors ? "invalid" : ""}
                    />
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>
                        {t("Maximum number of new memberships per day")}
                      </Label>
                      <div className="d-flex gap-2 align-items-center">
                        <Field
                          type="number"
                          name="daily_user_new_request"
                          className={`form-control ${
                            submitErrors && !values.unlimited
                              ? "is-invalid"
                              : ""
                          }`}
                          disabled={values.unlimited}
                          min={0}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <SharedButton
                  title="حفظ"
                  color="primary"
                  type="submit"
                />

              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Col>
  );
};

export default MobileVerificationForm;
