import React, { ReactNode } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SharedButton from "./SharedButton";
import { useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "react-i18next";

interface SharedModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  children: ReactNode;
  width?: string;
  height?: string;
  className?: string;
}

const SharedModal: React.FC<SharedModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
  children,
  width = "",
  height = "",
  className = "",
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

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
      <ModalFooter>
        {typeof onSubmit === "function" && (
          <SharedButton
            color="primary"
            onClick={onSubmit}
            title={t("Submit")}
          />
        )}
      </ModalFooter>
    </Modal>
  );
};

export default SharedModal;
