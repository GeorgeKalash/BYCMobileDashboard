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

const Reports = () => {
  type Filters = {
    fromDate: string;
    toDate: string;
  };

  const initialValues = {
    newClients: 0,
    onlineClients: 0,
    inactiveClients: 0,
    outwardTransferAmount: 0,
    outwardTransferCount: 0,
    paidReturnPercentage: 0,
    returnAmount: 0,
    returnCount: 0,
  };

  const validationSchema = Yup.object({});

  const [filters, setFilters] = useState<Filters>({
    fromDate: format(new Date(), "yyyy-MM-dd"),
    toDate: format(new Date(), "yyyy-MM-dd"),
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

            const result2 = await withRequestTracking(dispatch, () =>
              dispatch(
                getMobileRequest({
                  extension: ReportsRepository.RT405,
                  parameters: `_from=${filters.fromDate}&_to=${filters.toDate}`,
                })
              ).unwrap()
            );
            setValues({ ...initialValues, ...result.data, ...result2.data });
          };

          useEffect(() => {
            fetchAndSet();
          }, []);

          return (
            <Form style={{ maxHeight: "85vh", overflowY: "auto" }}>
              <Card className="mb-3">
                <CommonCardHeader title={t("Reports")}>
                  <Row>
                    <Col md={2}>
                      <CustomDatePicker
                        name="fromDate"
                        label={t("From Date")}
                        value={filters.fromDate}
                        onChange={(val) =>
                          val &&
                          setFilters((prev) => ({ ...prev, fromDate: val }))
                        }
                      />
                    </Col>
                    <Col md={2}>
                      <CustomDatePicker
                        name="toDate"
                        label={t("To Date")}
                        value={filters.toDate}
                        onChange={(val) =>
                          val &&
                          setFilters((prev) => ({ ...prev, toDate: val }))
                        }
                      />
                    </Col>
                    <Col md={2} className="d-flex align-items-center">
                      <SharedButton
                        title={t("Filter")}
                        onClick={() => fetchAndSet()}
                      />
                    </Col>
                  </Row>
                </CommonCardHeader>
                <CardBody>
                  <Row>
                    <SimpleStatsGrid
                      data={values}
                     logoMap={{
                      newClients: "user-plus",
                      onlineClients: "user-check",
                      inactiveClients: "user-x",
                      outwardTransferAmount: "saudi-riyal",
                      outwardTransferCount: "tally-5",
                      paidReturnPercentage: "percent",
                      returnAmount: "undo-2",
                      returnCount: "activity"
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

export default Reports;
