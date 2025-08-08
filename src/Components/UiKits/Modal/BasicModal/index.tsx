
import { Card, CardBody, Col } from "reactstrap";
import OpenModalMofi from "./OpenModalMofi";
import ScrollingModal from "./ScrollingModal";
import { SimpleModal } from "./SimpleModal";
import { ToolTipAndPopover } from "./ToolTipAndPopover";

const BasicModalCart = () => {
  return (
    <Col lg="6">
      <Card>
        <CardBody className="badge-spacing">
          <SimpleModal />
          <ScrollingModal />
          <ToolTipAndPopover />
          <OpenModalMofi />
        </CardBody>
      </Card>
    </Col>
  );
};

export default BasicModalCart;
