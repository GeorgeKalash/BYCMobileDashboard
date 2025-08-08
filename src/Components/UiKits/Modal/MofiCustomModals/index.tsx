import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { MofiCustomModal } from "@/Constant";
import { Card, CardBody, Col, Row } from "reactstrap";
import ModalThird from "./BalanceModal";
import { ModalOne } from "./ProfileModal";
import ModalTwo from "./ResultModal";

const MofiCustomModals = () => {
  return (
    <Col sm="12">
      <Card>
        <CardBody>
          <Row className="g-3">
            <ModalOne />
            <ModalTwo />
            <ModalThird />
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default MofiCustomModals;
