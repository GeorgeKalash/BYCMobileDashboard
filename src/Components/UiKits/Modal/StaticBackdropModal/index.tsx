import { Button, Card, CardBody, Col } from "reactstrap";
import CommonModal from "../Common/CommonModal";
import { useState } from "react";
import { StaticForm } from "./StaticForm";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { MofiLogin, StaticBackdropModalBtn, StaticBackdropModals } from "@/Constant";

const StaticBackdropModal = () => {
  const [staticModal, setStaticModal] = useState(false);
  const staticModalToggle = () => setStaticModal(!staticModal);
  
  return (
    <Col xl="4">
      <Card>
        <CardBody>
          <Button color="primary" onClick={staticModalToggle}>{StaticBackdropModalBtn}</Button>
          <CommonModal backdrop="static"  modalBodyClassName="social-profile text-start" isOpen={staticModal} toggle={staticModalToggle}>
            <div className="modal-toggle-wrapper">
              <h3>{MofiLogin}</h3>
              <p>Fill in your information below to continue.</p>
              <StaticForm staticModalToggle={staticModalToggle} />
            </div>
          </CommonModal>
        </CardBody>
      </Card>
    </Col>
  );
};

export default StaticBackdropModal;
