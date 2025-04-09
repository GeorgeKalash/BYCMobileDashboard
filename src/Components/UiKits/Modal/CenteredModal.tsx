import { Button } from "reactstrap";
import CommonModal from "./Common/CommonModal";
import { Close } from "@/Constant";
import imageOne from "../../../../public/assets/images/gif/danger.gif"

interface CenteredModalProps {
  isOpen: boolean;
  toggle: () => void;
  title?: string;
  message?: string;
  image?: string;
}

const CenteredModal: React.FC<CenteredModalProps> = ({
  isOpen,
  toggle,
  title = "Something went wrong",
  message = "error.",
}) => {
  return (
    <CommonModal centered isOpen={isOpen} toggle={toggle}>
      <div className="modal-toggle-wrapper">
        <div className="modal-img">
          <div className="text-center"><img src={imageOne.src} alt="error" /></div>
        </div>
        <h4 className="text-center pb-2">{title}</h4>
        <p className="text-center">{message}</p>
        <Button color="secondary" className="d-flex m-auto" onClick={toggle}>{Close}</Button>
      </div>
    </CommonModal>
  );
};

export default CenteredModal;
