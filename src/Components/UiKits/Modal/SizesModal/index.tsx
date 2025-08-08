import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { SizesModal } from "@/Constant";
import { Card, CardBody, Col } from "reactstrap";
import FullScreenModal from "./FullscreenModal";
import ExtraLargeModal from "./ExtraLargeModal";
import LargeModal from "./LargeModal";
import SmallModal from "./SmallModal";

const SizeModalCart = () => {
  return (
    <Col lg="6">
      <Card>
        <CardBody className="badge-spacing">
          <FullScreenModal />
          <ExtraLargeModal />
          <LargeModal />
          <SmallModal />
        </CardBody>
      </Card>
    </Col>
  );
};

export default SizeModalCart;
