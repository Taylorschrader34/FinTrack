import React, { useState } from "react";
import { TransactionForm } from "../forms/TransactionForm";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const Home = () => {
  const [transactionFormShow, setTransactionFormShow] = useState(false);

  const buttonStyle = {
    textDecoration: "none",
  };

  const [data, setData] = useState({
    // Define your initial data state
    Name: "TestCategory",
    Description: "This is a test description of this test category.",
  });

  const handleTestDbAddition = async () => {
    // Define the data to be sent in the request body
    const newData = {
      // Replace with the data you want to send
      Name: "TestCategory",
      Description: "This is a test description of this test category.",
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    };

    // Make the POST request with fetch
    await fetch("/category", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Process the data returned from the API
        console.log(data);
        setData(data); // Update the component state with the new data
      })
      .catch((error) => {
        // Handle any error that occurred during the fetch call
        console.error("Fetch error:", error);
      });
  };

  return (
    <>
      <Container>
        <Row className="justify-content-md-center mb-5">
          <Col xs lg="2">
            <Button
              variant="primary"
              onClick={() => setTransactionFormShow(true)}
            >
              Add Transaction
            </Button>
          </Col>
        </Row>
        <Row className="justify-content-md-center mb-5">
          <Col xs lg="2">
            <Link to={"/Reports"} style={buttonStyle}>
              <Button>See Reports</Button>
            </Link>
          </Col>
        </Row>
        <Row className="justify-content-md-center mb-5">
          <Col xs lg="2">
            <Button style={buttonStyle} onClick={handleTestDbAddition}>
              Test add category
            </Button>
          </Col>
        </Row>
      </Container>

      <TransactionForm
        show={transactionFormShow}
        onHide={() => setTransactionFormShow(false)}
      />
    </>
  );
};

export default Home;
