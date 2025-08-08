import React, { useState } from "react";
import { Button, Col, FormGroup, Label, ModalBody, Row } from "reactstrap";
import { Form, Formik, Field } from "formik";
import { FormSubmitProp } from "@/Types/UikitsType";
import { EmailAddress, EnterYourFirstName, EnterYourLastName, FirstName, LastName, MofiEmail, SignUp, TermsAndCondition } from "@/Constant";

export const OpenModalForm: React.FC<FormSubmitProp> = ({ modal }) => {
  const [formSubmit, setFormSubmit] = useState(false);

  return (
    <ModalBody>
     
    </ModalBody>
  );
};
