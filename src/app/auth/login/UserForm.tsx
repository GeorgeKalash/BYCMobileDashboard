"use client"

import { EmailAddressLogIn, Password, RememberPassword, SignIn, SignInToAccount } from "@/Constant"
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button, FormGroup, Input, Label } from "reactstrap"
import imageOne from "../../../../public/assets/images/logo/logo.png"
import imageTwo from "../../../../public/assets/images/logo/logo_dark.png"
import { fetchAC, login } from "@/Redux/Reducers/AuthSlice"
import CenteredModal from "@/Components/UiKits/Modal/CenteredModal"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

export const UserForm = () => {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice)
  const { loading, errorMessage } = useAppSelector((state) => state.authSlice)
  const [centred, setCentered] = useState(false)
  const centeredToggle = () => setCentered(!centred)

  const dispatch = useAppDispatch()

  const [show, setShow] = useState(false)

  useEffect(() => {
    dispatch(fetchAC())
  }, [dispatch])

  const initialValues = {
    email: "",
    password: "",
    remember: false,
  }

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  })

  const onSubmit = async (values: typeof initialValues) => {
     await dispatch(
      login({
        username: values.email,
        password: values.password,
        onError: () => centeredToggle(),
      })
    )
  }

  return (
    <div style={{ paddingBottom: '150px' }}>
      <div>
        <Link className="logo" href={`/${i18LangStatus}/dashboard/default_dashboard`}>
          <img className="img-fluid for-light" src={imageOne.src} alt="login page" />
          <img className="img-fluid for-dark" src={imageTwo.src} alt="login page" />
        </Link>
      </div>
      <div className="login-main">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <Form className="theme-form" onSubmit={handleSubmit}>
              <h4>{SignInToAccount}</h4>
              <p>Enter your email & password to login</p>
              <FormGroup>
                <Label className="col-form-label">{EmailAddressLogIn}</Label>
                <Field
                  name="email"
                  type="email"
                  as={Input}
                  placeholder="Enter email"
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </FormGroup>
              <FormGroup>
                <Label className="col-form-label">{Password}</Label>
                <div className="position-relative">
                  <Field
                    name="password"
                    type={show ? "text" : "password"}
                    as={Input}
                    placeholder="Enter password"
                  />
                  <div className="show-hide" onClick={() => setShow(!show)}>
                    <span className="show" />
                  </div>
                </div>
                <ErrorMessage name="password" component="div" className="text-danger" />
              </FormGroup>
              <FormGroup className="mb-0">
                <div className="checkbox p-0">
                  <Field id="checkbox1" name="remember" type="checkbox" />
                  <Label className="text-muted" htmlFor="checkbox1">{RememberPassword}</Label>
                </div>
                <div className="text-end mt-3">
                  <Button color="primary" block className="w-100" type="submit" disabled={loading}>
                    {loading ? "Signing In..." : SignIn}
                  </Button>
                </div>
              </FormGroup>
            </Form>
          )}
        </Formik>
      </div>
      <CenteredModal
        isOpen={centred}
        toggle={centeredToggle}
        title="Login Failed"
        message={errorMessage}
      />
    </div>
  )
}
