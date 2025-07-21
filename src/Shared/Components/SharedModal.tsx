import React, { ReactNode } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SharedButton from "./SharedButton";
import { useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "react-i18next";

const infoLogo = "/assets/images/icons/info.png";
const saveLogo = "/assets/images/icons/save.png";

interface SharedModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  onInfoClick?: () => void;
  title: string;
  children: ReactNode;
  width?: string;
  height?: string;
  className?: string;
  footerActions?: ReactNode;
}

const SharedModal: React.FC<SharedModalProps> = ({
  visible,
  onClose,
  onSubmit,
  onInfoClick,
  title,
  children,
  width = "",
  height = "",
  className = "",
  footerActions,
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
        {footerActions}

        {typeof onInfoClick === "function" && (
          <SharedButton
            logo={infoLogo}
            color="info"
            tooltip={t("More info")}
            onClick={onInfoClick}
          />
        )}

        {typeof onSubmit === "function" && (
          <SharedButton
            logo={saveLogo}
            color="primary"
            onClick={onSubmit}
            tooltip={t("Submit")}
          />
        )}
      </ModalFooter>
    </Modal>
  );
};

export default SharedModal;
