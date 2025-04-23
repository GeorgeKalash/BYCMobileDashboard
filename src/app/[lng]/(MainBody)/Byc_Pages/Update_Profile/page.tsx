"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CardBody, Card, Col, Row, FormGroup, Label, Input } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
// import SharedButton from "@/Shared/Components/SharedButton";
// import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";
import CustomInput from "../../../../../Shared/Components/CustomInput";
import CustomSelect from "../../../../../Shared/Components/CustomSelect";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";

// ✅ Initial form values
const initialValues = {
  enabled: "disabled",
  dailyCheck: "",
  monthlyCheck: "",
  maxCodesPerUser: "",
  maxNewMembers: "",
  unlimited: false,
};

// ✅ Yup validation schema
const validationSchema = Yup.object({
  enabled: Yup.string().required("هذه الخانة مطلوبة"),
  dailyCheck: Yup.number()
    .typeError("يجب أن يكون رقماً")
    .required("هذه الخانة مطلوبة"),
  monthlyCheck: Yup.number()
    .typeError("يجب أن يكون رقماً")
    .required("هذه الخانة مطلوبة"),
  maxCodesPerUser: Yup.number()
    .typeError("يجب أن يكون رقماً")
    .required("هذه الخانة مطلوبة"),
  maxNewMembers: Yup.number()
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

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Update Profile")} />
        <CardBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log(values);
              alert("تم حفظ البيانات بنجاح!");
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Row className="gy-3">
                  <Col md="4">
                    <CustomSelect
                      name="enabled"
                      label={t("Check mobile compatibility with BQIN?")}
                      options={[
                        { value: "disabled", label: "غير مفعل" },
                        { value: "enabled", label: "مفعل" },
                      ]}
                      isRequired
                      submitErrors={submitErrors ? "invalid" : ""}
                    />
                  </Col>

                  <Col md="4">
                    <CustomInput
                      name="dailyCheck"
                      label={t("Number of checks per day")}
                      type="number"
                      isRequired
                      placeholder="0"
                      submitErrors={submitErrors ? "invalid" : ""}
                    />
                  </Col>

                  <Col md="4">
                    <CustomInput
                      name="monthlyCheck"
                      label={t("Number of checks per month")}
                      type="number"
                      isRequired
                      placeholder="0"
                      submitErrors={submitErrors ? "invalid" : ""}
                    />
                  </Col>

                  <Col md="6">
                    <CustomInput
                      name="maxCodesPerUser"
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
                          name="maxNewMembers"
                          className={`form-control ${
                            submitErrors && !values.unlimited
                              ? "is-invalid"
                              : ""
                          }`}
                          disabled={values.unlimited}
                          min={0}
                        />
                      </div>
                      <FormGroup check className="mb-0">
                        {/* <Label check>
                          <SharedCheckbox
                            label="غير محدود"
                            checked={values.unlimited}
                            onChange={() =>
                              setFieldValue("unlimited", !values.unlimited)
                            }
                          />
                        </Label> */}
                      </FormGroup>
                    </FormGroup>
                  </Col>
                </Row>

                {/* <SharedButton
                  title="حفظ"
                  color="primary"
                  onClick={() => setSubmitErrors(true)} 
                /> */}
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Col>
  );
};

export default MobileVerificationForm;
