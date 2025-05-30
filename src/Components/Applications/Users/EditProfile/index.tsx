import React from "react";
import { Container, Row } from "reactstrap";
import EditProfileForm from "./EditProfiles/EditProfileForm";
import AddProjectsAndUpload from "./AddProjectsAndUpload/AddProjectsAndUpload";

const EditProfileContainer = () => {
  return (
    <Container fluid>
      <div className="edit-profile">
        <Row>
          <EditProfileForm />
          <AddProjectsAndUpload />
        </Row>
      </div>
    </Container>
  );
};

export default EditProfileContainer;
