import React from "react";
import { Container, Row } from "reactstrap";
import TotalSells from "./TotalSells";
import SalesOverview from "./SalesOverview";
import RecentCustomers from "./RecentCustomers";
import RevenueByCategory from "./RevenueByCategory";
import UserByContinent from "./UserByContinent";
import TopSeller from "./TopSeller/TopSeller";

const EcommerceContainer = () => {
  return (
    <Container fluid className="dashboard-3">
      <Row>
        <TotalSells />
        <SalesOverview />
        <RecentCustomers />
        <RevenueByCategory />
        <UserByContinent />
        <TopSeller />
      </Row>
    </Container>
  );
};

export default EcommerceContainer;
