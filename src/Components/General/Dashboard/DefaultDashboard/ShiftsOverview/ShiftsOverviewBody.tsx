import { CardBody, Col, Row } from "reactstrap";
import { ShiftsOverviewData } from "@/Data/General/Dashboard/DefaultDashboard";

const ShiftsOverviewBody = () => {
  return (
    <CardBody>
      <Row>
        <Col xs="7" className="shifts-overview">
          {ShiftsOverviewData.map((data, index) => (
            <div className="d-flex gap-2" key={index}>
              <div className="flex-shrink-0">
                <span className={`bg-${data.color}`}> </span>
              </div>
              <div className="flex-grow-1">
                <h6>{data.title}</h6>
              </div>
              <span>{data.count}</span>
            </div>
          ))}
        </Col>
      </Row>
    </CardBody>
  );
};

export default ShiftsOverviewBody;
