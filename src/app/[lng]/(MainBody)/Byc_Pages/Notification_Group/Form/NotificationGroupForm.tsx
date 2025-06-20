"use client";

import { useEffect, useRef, useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/Redux/Hooks";
import { withRequestTracking } from "@/utils/withRequestTracking ";
import {
  postMobileRequest,
  putMobileRequest,
  getMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { NotificationAlertRepository } from "@/Repositories/NotificationAlert";
import { showToast } from "@/Shared/Components/showToast";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useTranslation } from "react-i18next";
import DataTableComponent from "@/Shared/Components/DataTable";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import CustomInput from "@/Shared/Components/CustomInput";
import SharedModal from "@/Shared/Components/SharedModal";
interface NotificationGroupFormProps {
  rowData: any;
  formikRef?: React.Ref<FormikProps<any>>;
  modalAction: "add" | "edit" | null;
  onSuccessSubmit?: () => void;
}

const NotificationGroupForm = ({
  rowData,
  formikRef,
  modalAction,
  onSuccessSubmit,
}: NotificationGroupFormProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const localFormikRef = useRef<FormikProps<any>>(null);
  const formikReference = formikRef || localFormikRef;

  const initialValues = {
    recordId: rowData?.recordId ?? 0,
    name: rowData?.name ?? "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("required")),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const payload = {
      recordId: values.recordId || 0,
      name: values.name,
    };

    await withRequestTracking(dispatch, () =>
      dispatch(
        modalAction === "edit"
          ? putMobileRequest({
              extension: NotificationAlertRepository.NotificationGroup.update,
              body: payload,
              rawBody: true,
            })
          : postMobileRequest({
              extension: NotificationAlertRepository.NotificationGroup.create,
              body: payload,
              rawBody: true,
            })
      ).unwrap()
    );

    showToast("success", t("Saved successfully"));
    onSuccessSubmit?.();
  };

  const columns = [
    {
      name: t("Phone Number"),
      selector: (row: any) => row.phoneNumber,
      sortable: true,
      id: "phoneNumber",
    },
  ];

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (modalAction === "edit" && rowData?.recordId) {
        const result = await withRequestTracking(dispatch, () =>
          dispatch(
            getMobileRequest({
              extension: `${NotificationAlertRepository.NotificationGroup.getpack}?_recordId=${rowData.recordId}`,
            })
          )
        );

        const clients = result?.payload?.data?.clients || [];

        const members = clients.map((client: any) => ({
          phoneNumber: client.username,
        }));

        setGroupMembers(members);
      } else {
        setGroupMembers([]);
      }
    };

    fetchGroupMembers();
  }, [dispatch, modalAction, rowData]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      innerRef={formikReference}
    >
      {() => (
        <Form>
          <Card>
            {modalAction === "edit" && (
              <CommonCardHeader
                title={t("Group Data")}
                onAdd={() => setShowModal(true)}
              />
            )}

            <CardBody>
              {modalAction === "edit" ? (
                <Row>
                  <Col md={12}>
                    <DataTableComponent
                      data={groupMembers}
                      columns={columns}
                      pagination
                      title={t("Group Members")}
                      showActions={true}
                      onDelete={() => {}}
                    />
                  </Col>
                  <SharedModal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    title={t("Add Member")}
                  >
                    <div>{t("Modal content placeholder")}</div>
                  </SharedModal>
                </Row>
              ) : (
                <Row>
                  <Col md={12}>
                    <CustomInput
                      name="name"
                      label={t("Group Name")}
                      placeholder={t("Enter group name")}
                    />
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default NotificationGroupForm;
