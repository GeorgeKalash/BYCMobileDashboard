// import React, { ReactNode } from "react";
// import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

// interface SharedModalProps {
//   visible: boolean;
//   onClose: () => void;
//   title: string;
//   children: ReactNode;
//   footer: ReactNode;
// }

// const SharedModal: React.FC<SharedModalProps> = ({
//   visible,
//   onClose,
//   title,
//   children,
//   footer,
// }) => {
//   return (
//     <Modal
//       isOpen={visible}
//       toggle={onClose}
//       className="modal-xxl modal-dialog-scrollable"
//       backdrop="static"
//       centered
//     >
//       <ModalHeader toggle={onClose}>{title}</ModalHeader>
//       <ModalBody style={{ maxHeight: "70vh", overflowY: "auto" }}>
//         {children}
//       </ModalBody>
//       <ModalFooter>{footer}</ModalFooter>
//     </Modal>
//   );
// };

// export default SharedModal;
import React, { ReactNode } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

interface SharedModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
  width?: string;
  height?: string;
  className?: string;
}

const SharedModal: React.FC<SharedModalProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
  width = "",
  height = "",
  className = "",
}) => {
  return (
    <Modal
      isOpen={visible}
      toggle={onClose}
      backdrop="static"
      centered
      className={`modal-dialog-scrollable ${className}`}
      style={{ maxWidth: width }}
    >
      <ModalHeader toggle={onClose}>{title}</ModalHeader>
      <ModalBody style={{ maxHeight: height, overflowY: "auto" }}>
        {children}
      </ModalBody>
      <ModalFooter>{footer}</ModalFooter>
    </Modal>
  );
};

export default SharedModal;
