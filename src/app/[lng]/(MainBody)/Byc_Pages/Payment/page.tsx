"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
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
import { withRequestTracking } from "@/utils/withRequestTracking";
import { showToast } from "@/Shared/Components/showToast";
import { PaymentGatewayRepository } from "@/Repositories/PaymentGatewayRepository";
import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";

const validationSchema = Yup.object({
  brands: Yup.array().of(
    Yup.object().shape({
      typeName: Yup.string().required("Required"),
      isInactive: Yup.boolean(),
    })
  ),
});

const Payment = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  const [paymentType, setPaymentType] = useState<1 | 2 | null>(1);
  const [initialValues, setInitialValues] = useState<{ brands: { id: number; typeName: string; isInactive: boolean }[] }>({ brands: [] });

  const handlePaymentChange = (e: string | number | null) => {
    const num = Number(e);
    setPaymentType([1, 2].includes(num) ? (num as 1 | 2) : null);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      const result = await withRequestTracking(dispatch, () =>
        dispatch(
          getMobileRequest({
            extension: PaymentGatewayRepository.PaymentSupport.getAll,
            parameters: `_paymentGatewayId=${paymentType}`,
          })
        ).unwrap()
      );

      if (result.status === 1 && Array.isArray(result.data)) {
        setInitialValues({ brands: result.data });
      }
    };

    fetchBrands();
  }, [paymentType]);

  const handleSubmit = async (values: typeof initialValues) => {

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: PaymentGatewayRepository.PaymentSupport.setPack,
          body: {paymentGatewayId:paymentType,brands:values.brands},
          rawBody: true,
        })
      ).unwrap()
    );

    showToast("success");
  };

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Payments")}>
          <div style={{ minWidth: 250, maxWidth: 400, width: "100%" }}>
            <CustomSelect
              name="paymentType"
              label={t("paymentType")}
              dashboardDatasetId={2}
              valueKey="key"
              labelKey="value"
              value={paymentType ?? ""}
              onChange={handlePaymentChange}
             />
          </div>
        </CommonCardHeader>
        <CardBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <FieldArray name="brands">
                  {() => (
                    <>
                      {values.brands.map((brand, index) => (
                        <Row key={brand.id} className="mb-3 align-items-end">
                          <Col md={6}>
                            <CustomInput
                              name={`brands.${index}.name`}
                              label={`${t("Name")}`}
                              value={brand.typeName}
                              readOnly
                            />
                          </Col>
                          <Col md={6}>
                            <SharedCheckbox
                              label={t("Active")}
                              checked={!brand.isInactive}
                              onChange={() =>
                                setFieldValue(`brands.${index}.isInactive`, !brand.isInactive)
                              }
                            />
                          </Col>
                        </Row>
                      ))}
                      <div className="d-flex justify-content-end">
                        <SharedButton
                          type="submit"
                          color="primary"
                          disabled={isSubmitting}
                          title={t("Save")}
                        />
                      </div>
                    </>
                  )}
                </FieldArray>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Payment;

