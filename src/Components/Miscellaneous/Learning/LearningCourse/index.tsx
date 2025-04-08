import React from "react";
import { Col, Container, Row } from "reactstrap";
import BlogSingle from "./BlogSingle";

const DetailsCourseContainer = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="9" className="xl-60 order-xl-0 order-1 box-col-12">
          <BlogSingle />
        </Col>
      </Row>
    </Container>
  );
};

export default DetailsCourseContainer;
