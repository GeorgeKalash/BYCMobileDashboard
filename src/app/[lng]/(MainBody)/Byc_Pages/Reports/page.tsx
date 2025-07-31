"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { CardBody, Card, Col, Row } from "reactstrap";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import SharedButton from "@/Shared/Components/SharedButton";
import { useTranslation } from "@/app/i18n/client";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { ReportsRepository } from "@/Repositories/ReportsRepository";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { format } from "date-fns";
import CustomDatePicker from "@/Shared/Components/CustomDatePicker";
import SimpleStatsGrid from "@/Shared/Components/SimpleStatsGrid";

const Defaults = () => {
  type Filters = {
    fromDate: string;
    toDate: string;
  };

  const initialValues = {
    newClients: 0,
    onlineClients: 0,
    inactiveClients: 0,
  };

  const validationSchema = Yup.object({});

  const [filters, setFilters] = useState<Filters>({
    fromDate: format(new Date(), "MM-dd-yyyy"),
    toDate: format(new Date(), "MM-dd-yyyy"),
  });

  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  return (
    <Col xs="12">
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ values, setValues }) => {
          const fetchAndSet = async () => {
            const result = await withRequestTracking(dispatch, () =>
              dispatch(
                getMobileRequest({
                  extension: ReportsRepository.MobileStatistics,
                  parameters: `_from=${filters.fromDate}&_to=${filters.toDate}`,
                })
              ).unwrap()
            );

            if (result.status === 1 && Array.isArray(result.data)) {
              const dataObj: Partial<typeof initialValues> = {};
              result.data.forEach((item: { key: string; value: string }) => {
                if (item.key in initialValues) {
                  dataObj[item.key as keyof typeof initialValues] =
                    Number(item.value) || 0;
                }
              });
              setValues({ ...initialValues, ...dataObj });
            }
          };

          useEffect(() => {
            fetchAndSet();
          }, []);

          return (
            <Form style={{ maxHeight: "85vh", overflowY: "auto" }}>
              <Card className="mb-3">
                <CommonCardHeader title={t("Notifications")}>
                  <Row className="w-100">
                    <Col>
                      <CustomDatePicker
                        name="fromDate"
                        label={t("From Date")}
                        value={filters.fromDate}
                        onChange={(val) =>
                          val && setFilters((prev) => ({ ...prev, fromDate: val }))
                        }
                      />
                    </Col>
                    <Col>
                      <CustomDatePicker
                        name="toDate"
                        label={t("To Date")}
                        value={filters.toDate}
                        onChange={(val) =>
                          val && setFilters((prev) => ({ ...prev, toDate: val }))
                        }
                      />
                    </Col>
                    <Col className="d-flex align-items-center">
                      <SharedButton title={t("Filter")} onClick={fetchAndSet} />
                    </Col>
                  </Row>
                </CommonCardHeader>
                <CardBody>
                  <Row>
                    <SimpleStatsGrid
                      data={values}
                      logoMap={{
                        newClients: "/user-check.svg",
                        onlineClients: "/user-plus.svg",
                        inactiveClients: "/user-lock.svg",
                      }}
                    />
                  </Row>
                </CardBody>
              </Card>
            </Form>
          );
        }}
      </Formik>
    </Col>
  );
};

export default Defaults;
