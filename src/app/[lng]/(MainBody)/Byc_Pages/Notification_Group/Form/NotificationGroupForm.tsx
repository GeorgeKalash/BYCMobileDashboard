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
  deleteMobileRequest,
} from "@/Redux/Reducers/RequestThunks";
import { NotificationAlertRepository } from "@/Repositories/NotificationAlert";
import { showToast } from "@/Shared/Components/showToast";
import { Card, CardBody, Col, Row, FormGroup } from "reactstrap";
import { useTranslation } from "react-i18next";
import DataTableComponent from "@/Shared/Components/DataTable";
import CustomInput from "@/Shared/Components/CustomInput";
import SharedModal from "@/Shared/Components/SharedModal";
import SharedButton from "@/Shared/Components/SharedButton";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";
import ResourceLookup from "@/Shared/Components/ResourceLookup";
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
  const [phoneNumber, setPhoneNumber] = useState("");
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

  const handleAddMember = async () => {
    if (!phoneNumber) {
      showToast("error", t("Please select a phone number"));
      return;
    }
    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: NotificationAlertRepository.NotificationGroup.addClient,
          body: {
            notificationGroupId: rowData?.recordId,
            username: phoneNumber,
          },
          rawBody: true,
        })
      ).unwrap()
    );
    showToast("success", t("User added successfully"));
    await fetchGroupMembers();
    setPhoneNumber("");
    setShowModal(false);
  };

  useEffect(() => {
    fetchGroupMembers();
  }, [dispatch, modalAction, rowData]);

  const columns = [
    {
      name: t("Phone Number"),
      selector: (row: any) => row.phoneNumber,
      sortable: true,
      id: "phoneNumber",
    },
  ];
  const handleDelete = async (row: any) => {
    if (!row?.phoneNumber) return;

    await withRequestTracking(dispatch, () =>
      dispatch(
        deleteMobileRequest({
          extension: NotificationAlertRepository.NotificationGroup.deleteClient,
          parameters: `_notificationGroupId=${
            rowData.recordId
          }&_username=${encodeURIComponent(row.phoneNumber)}`,

          rawBody: false,
        })
      ).unwrap()
    );

    showToast("success", t("User removed successfully"));
    fetchGroupMembers();
  };
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
            <CardBody>
              <Row>
                <Row>
                  <Col md={3}>
                    <CustomInput
                      name="name"
                      label={t("Group Name")}
                      placeholder={t("Enter group name")}
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={12} className="d-flex justify-content-end">
                    <SharedButton
                      title={t("Add Member")}
                      onClick={() => setShowModal(true)}
                      disabled={modalAction !== "edit"}
                    />
                  </Col>
                </Row>

                <Col md={12} className="mt-3">
                  <DataTableComponent
                    data={groupMembers}
                    columns={columns}
                    pagination
                    title={t("Group Members")}
                    showActions={modalAction === "edit"}
                    onDelete={handleDelete}
                  />
                </Col>
              </Row>

              {modalAction === "edit" && (
                <SharedModal
                  visible={showModal}
                  onClose={() => setShowModal(false)}
                  title={t("Add Member")}
                  height={"40vh"}
                  onSubmit={handleAddMember}
                >
                  <FormGroup>
                    <Col md={12} className="mt-3">
                      <ResourceLookup
                        name="phoneNumberLookup"
                        label={t("Phone Number")}
                        endpoint={DashboardMobileRepository.mobileUser.snapshot}
                        searchParamKey="_username"
                        parameters={{}}
                        columns={[{ key: "username", label: "Phone Number" }]}
                        minChars={3}
                        onChange={(selectedUser) => {
                          if (selectedUser) {
                            setPhoneNumber(selectedUser.username);
                            console.log("Selected user:", selectedUser);
                          }
                        }}
                        value={phoneNumber}
                      />
                    </Col>
                  </FormGroup>
                </SharedModal>
              )}
            </CardBody>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default NotificationGroupForm;
