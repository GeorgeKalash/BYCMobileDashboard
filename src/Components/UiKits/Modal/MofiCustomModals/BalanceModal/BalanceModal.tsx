import SVG from "@/CommonComponent/SVG";
import { ImagePath } from "@/Constant";
import { useAppSelector } from "@/Redux/Hooks";
import { BalanceModalType } from "@/Types/UikitsType";
import Link from "next/link";
import { Badge, Card, CardBody, Col, Modal } from "reactstrap";

export const BalanceModal:React.FC<BalanceModalType> = ({ modalThird, modalThirdToggle: modalThirdTogggle }) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);

  return (
    <Modal centered fade isOpen={modalThird} toggle={modalThirdTogggle}>
      <Col xl="12">
        <Card className="balance-box mb-0">
          <CardBody>
            <div className="balance-profile">
              <div className="balance-img">
                <img className="image-fluid" src={`${ImagePath}/dashboard-4/user.png`} alt="user vector" />
                <Link className="edit-icon" href={`/${i18LangStatus}/users/user_profile`}><SVG iconId="pencil" /></Link>
              </div>
              <span className="f-light d-block">Your Balance</span>
              <h5 className="mt-1">$768,987.90</h5>
              <ul>
              
              </ul>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Modal>
  );
};
