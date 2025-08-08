import { Card, CardBody, Col, Row } from "reactstrap";
import { ModalOne } from "./ProfileModal";
import ModalTwo from "./ResultModal";
import ModalThird from "./BalanceModal";

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
