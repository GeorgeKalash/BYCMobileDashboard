import { Container, Row } from "reactstrap";
import BasicModalCart from "./BasicModal";
import SizeModalCart from "./SizesModal";
import FullScreenModals from "./FullScreenModal";
import ToggleBetweenModals from "./ToggleBetweenModals";
import StaticBackdropModal from "./StaticBackdropModal";
import MofiCustomModals from "./MofiCustomModals";

const ModalContainer = () => {
  return (
    <Container fluid>
      <Row>
        <BasicModalCart />
        <SizeModalCart />
        <FullScreenModals />
        <ToggleBetweenModals />
        <StaticBackdropModal />
        <MofiCustomModals />
      </Row>
    </Container>
  );
};

export default ModalContainer;
