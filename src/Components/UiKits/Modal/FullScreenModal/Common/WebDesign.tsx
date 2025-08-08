import { WebDesigner, WebDesigns } from "@/Constant";
import { ArrowRightCircle, ChevronsRight } from "react-feather";

const WebDesign = () => {
  return (
    <>
      <div className="large-modal-header"><ChevronsRight /><h5 className="f-w-600">{WebDesigns}</h5></div>
      <p className="modal-padding-space">We build specialised websites for companies, list them on digital directories, and set up a sales funnel to boost ROI.</p>
      <h5 className="f-w-600">{WebDesigner}</h5>
    
    </>
  );
};

export default WebDesign;
