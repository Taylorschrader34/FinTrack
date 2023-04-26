import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const Home = () => {

  const buttonStyle = {
    textDecoration: "none",
  };

  return (
    <>
      <Container>
        <Row className="justify-content-md-center mb-5">
          <Col xs lg="2">
            <Link to={"/Reports"} style={buttonStyle}>
              <Button>See Reports</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
