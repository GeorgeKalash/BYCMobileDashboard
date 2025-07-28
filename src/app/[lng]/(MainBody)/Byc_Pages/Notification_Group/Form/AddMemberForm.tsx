import React, { useRef } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { Col, FormGroup } from "reactstrap";
import { useTranslation } from "react-i18next";
import ResourceLookup from "@/Shared/Components/ResourceLookup";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";

interface AddMemberFormProps {
  onSubmit: (username: string) => void;
  formikRef?: React.Ref<FormikProps<any>>;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({
  onSubmit,
  formikRef,
}) => {
  const { t } = useTranslation();
  const localRef = useRef<FormikProps<any>>(null);

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string().required(t("required")),
  });

  return (
    <Formik
      innerRef={formikRef || localRef}
      initialValues={{ phoneNumber: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values.phoneNumber);
        resetForm();
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <FormGroup>
            <Col md={12} className="mt-3">
              <ResourceLookup
                name="phoneNumber"
                label={t("Phone Number")}
                endpoint={DashboardMobileRepository.mobileUser.snapshot}
                searchParamKey="_username"
                parameters={{}}
                columns={[{ key: "username", label: "Phone Number" }]}
                minChars={3}
                onChange={(selectedUser) => {
                  if (selectedUser) {
                    setFieldValue("phoneNumber", selectedUser.username);
                  }
                }}
                value={values.phoneNumber}
                isRequired={true}
              />
            </Col>
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};

export default AddMemberForm;
