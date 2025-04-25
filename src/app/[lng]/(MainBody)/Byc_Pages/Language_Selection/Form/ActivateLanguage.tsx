"use client";

import React from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomSelect from "@/Shared/Components/CustomSelect";
import CustomInput from "@/Shared/Components/CustomInput";
import { Col, Row } from "reactstrap";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import { postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { SystemMobileRepository } from "@/Repositories/SystemMobileRepository";
import * as Yup from "yup";
import { showToast } from "@/Shared/Components/showToast";
import { SharedCheckbox } from "@/Shared/Components/SharedCheckbox";

const ActivateLanguage = ({
  rowData,
  formikRef,
  onSuccessSubmit,
}: {
  rowData: any;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  if (!rowData) return null;

  const initialValues = {
    name: rowData?.name || "",
    isInactive: rowData?.isInactive, 
  };

  const validationSchema = Yup.object().shape({
    isInactive: Yup.boolean().required(t("Language status is required")),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {

    const transformedData = [
      {
        languageId: rowData.languageId,
        name: String(rowData.name),
        isInactive: values.isInactive, 
      },
    ];

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: SystemMobileRepository.Languages.update,
          body: transformedData,
          rawBody: true,
        })
      ).unwrap()
    );

    setSubmitting(false);
    if (onSuccessSubmit){   
      showToast("success");
      onSuccessSubmit()
    };
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      {({ values, setFieldValue }) => {

        return (
          <Form>
            <Row>
              <Col>
                <CustomInput
                  name="name"
                  label={t("Name")}
                  placeholder={t("Enter name")}
                  readOnly={true}
                />
                <SharedCheckbox
                  label={t("Active")}
                  checked={!values.isInactive}
                  onChange={()=>setFieldValue("isInactive", !values.isInactive)}
                />
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ActivateLanguage;
