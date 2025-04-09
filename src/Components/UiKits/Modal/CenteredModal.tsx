import { Button } from "reactstrap";
import CommonModal from "./Common/CommonModal";
import { Close, ImagePath } from "@/Constant";

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
  message = "Attackers on malicious activity may trick you into doing something dangerous like installing software or revealing your personal informations.",
  image = `${ImagePath}/gif/danger.gif`,
}) => {
  return (
    <CommonModal centered isOpen={isOpen} toggle={toggle}>
      <div className="modal-toggle-wrapper">
        <div className="modal-img">
          <div className="text-center"><img src={image} alt="error" /></div>
        </div>
        <h4 className="text-center pb-2">{title}</h4>
        <p className="text-center">{message}</p>
        <Button color="secondary" className="d-flex m-auto" onClick={toggle}>{Close}</Button>
      </div>
    </CommonModal>
  );
};

export default CenteredModal;
