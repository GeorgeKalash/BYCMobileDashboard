import { ExtraLargeModals, WebDesign } from "@/Constant";
import React, { Fragment, useState } from "react";
import { Button } from "reactstrap";
import CommonModal from "../../Common/CommonModal";
import { ChevronsRight } from "react-feather";

const ExtraLargeModal = () => {
  const [extraLargeScreen, setExtraLargeScreen] = useState(false);
  const extraLargeScreenToggle = () => setExtraLargeScreen(!extraLargeScreen);

  return (
    <>
      <Button color="info" onClick={extraLargeScreenToggle}>{ExtraLargeModals}</Button>
      <CommonModal size="xl" isOpen={extraLargeScreen} toggle={extraLargeScreenToggle} sizeTitle="Extra Large modal">
        <div className="large-modal-header"><ChevronsRight /><h5 className="f-w-600">{WebDesign}</h5></div>
        <p className="modal-padding-space">We build specialised websites for companies, list them on digital directories, and set up a sales funnel to boost ROI.</p>
       
      </CommonModal>
    </>
  );
};

export default ExtraLargeModal;
