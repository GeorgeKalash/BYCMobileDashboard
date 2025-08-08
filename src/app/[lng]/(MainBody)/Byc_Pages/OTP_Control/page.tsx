"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import { CardBody, Card, Col, Row } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedButton from "@/Shared/Components/SharedButton";
import CustomInput from "../../../../../Shared/Components/CustomInput";
import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  getMobileRequest,
  postMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { showToast } from "@/Shared/Components/showToast";
import * as Yup from "yup";

interface OTPSetting {
  resourceName: string;
  resourceId: number;
  timeFrame: number;
  maxRequest: number;
  isInactive: boolean;
}

const MobileVerificationForm = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [initialValues, setInitialValues] = useState<{
    settings: OTPSetting[];
  }>({ settings: [] });

  useEffect(() => {
    const fetchSettings = async () => {
      const result = await withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: DashboardMobileRepository.OTP.getPack,
          })
        ).unwrap()
      );

      if (result.status === 1 && Array.isArray(result.data)) {
        const transformed = result.data.map((item: any) => ({
          resourceName: item.resourceName,
          resourceId: item.resourceId,
          timeFrame: item.timeFrame ?? 0,
          maxRequest: item.maxRequest ?? 0,
          isInactive: item.isInactive ?? false,
        }));
        setInitialValues({ settings: transformed });
      }
    };

    fetchSettings();
  }, [dispatch]);

  const handleSubmit = async (values: { settings: OTPSetting[] }) => {
    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: DashboardMobileRepository.OTP.setPack,
          body: values.settings,
          rawBody: true,
        })
      ).unwrap()
    );

    showToast("success", t("Saved successfully"));
  };

  const validationSchema = Yup.object({
    settings: Yup.array().of(
      Yup.object({
        timeFrame: Yup.number().min(0).required(),
        maxRequest: Yup.number().min(0).required(),
        isInactive: Yup.boolean().required(),
      })
    ),
  });

  return (
    <Col xs="12">
      <Card>
        <CardBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form style={{ maxHeight: "85vh", overflowY: "auto" }}>
                <FieldArray name="settings">
                  {() =>
                    values.settings.map((item, index) => (
                      <Card key={item.resourceId}>
                        <CommonCardHeader title={item.resourceName} />
                        <CardBody>
                          <Row>
                            <Col>
                              <CustomInput
                                name={`settings[${index}].timeFrame`}
                                label={t("Time Frame (in Minutes)")}
                                min={0}
                                value={values.settings[index].timeFrame}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  setFieldValue(
                                    `settings[${index}].timeFrame`,
                                    val
                                  );
                                }}
                              />
                            </Col>
                            <Col>
                              <CustomInput
                                name={`settings[${index}].maxRequest`}
                                label={t("Max Request")}
                                min={0}
                                value={values.settings[index].maxRequest}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  setFieldValue(
                                    `settings[${index}].maxRequest`,
                                    val
                                  );
                                }}
                              />
                            </Col>
                            <Col className="d-flex align-items-center">
                              <SharedCheckbox
                                name={`settings[${index}].isInactive`}
                                label={t("Inactive")}
                                checked={values.settings[index].isInactive}
                                onChange={(checked) =>
                                  setFieldValue(
                                    `settings[${index}].isInactive`,
                                    checked
                                  )
                                }
                              />
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    ))
                  }
                </FieldArray>
                <Col className="d-flex justify-content-end">
                  <SharedButton
                    color="primary"
                    type="submit"
                    title={t("Submit")}
                  />
                </Col>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Col>
  );
};

export default MobileVerificationForm;
