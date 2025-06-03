"use client";

import React from "react";
import { Card, Col, CardBody } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";

import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";

const Home_Page = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader title={t("Home Page")} />
        <CardBody></CardBody>
      </Card>
    </Col>
  );
};

export default Home_Page;
