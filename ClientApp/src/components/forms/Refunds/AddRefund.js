import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Divider,
  Form,
  Button,
  ButtonToolbar,
  DatePicker,
  InputNumber,
  Schema,
  Message,
  toaster,
  Row,
  Col,
} from "rsuite";

const { NumberType, DateType } = Schema.Types;
const refundModel = Schema.Model({
  amount: NumberType().isRequired("Amount is required."),
  refundDate: DateType().isRequired("Please select a date."),
});

const defaultFormValue = {
  amount: 0,
  description: "",
  refundDate: null,
};

const AddRefund = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const formRef = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState(defaultFormValue);

  const [transaction, setTransaction] = useState({});

  useEffect(() => {
    getTransaction();
  }, []);

  const getTransaction = async () => {
    try {
      const response = await fetch(`/transaction/GetTransactionById/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.transactionId == 0) {
          toaster.push(
            <Message type="error">No Transaction with that Id</Message>
          );
          navigate("/Transactions");
        }
        setTransaction(data);
      } else if (response.status === 404) {
        console.log("Transaction not found");
        return null;
      } else {
        console.log(
          "Error fetching sources, categories, refunds, and/or tags."
        );
        return null;
      }
    } catch (error) {
      console.error(`Failed to fetch transaction with Id ${id}:`, error);
    }
  };

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    } else if (formValue.amount == 0) {
      toaster.push(<Message type="error">Amount must be not zero.</Message>);
      return;
    }

    const refundInput = {
      TransactionId: transaction.id,
      Amount: Math.abs(formValue.amount),
      Description: formValue.description,
      RefundDate: formValue.refundDate,
    };

    // Submit the refund to the backend
    fetch("/refund/CreateRefund", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refundInput),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful refund creation
          response.json().then((data) => {
            toaster.push(<Message type="success">Success</Message>);
          });
          navigate(`/Transactions/edit/${id}`);
        } else {
          // Handle error response
          toaster.push(
            <Message type="error">
              {`Error creating refund: ${response.status}`}
            </Message>
          );
        }
      })
      .catch((error) =>
        toaster.push(
          <Message type="error">{`Error creating refund: ${error}`}</Message>
        )
      );
  };

  return (
    <>
      <h1>Add Refund</h1>
      <Form
        ref={formRef}
        onChange={setFormValue}
        onCheck={setFormError}
        formValue={formValue}
        model={refundModel}
        style={{ marginLeft: "10px" }}
      >
        <ButtonToolbar>
          <Button onClick={() => setFormValue(defaultFormValue)}>
            Clear form data
          </Button>
        </ButtonToolbar>
        <Divider />

        <Row>
          <Col md={6}>
            <Form.Group controlId="amount">
              <Form.ControlLabel>Amount</Form.ControlLabel>
              <Form.Control
                name="amount"
                accepter={InputNumber}
                ref={formRef}
                min={0}
                step={0.01}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.ControlLabel>Description:</Form.ControlLabel>
              <Form.Control name="description" ref={formRef} />
            </Form.Group>

            <Form.Group controlId="refundDate">
              <Form.ControlLabel>Refund Date:</Form.ControlLabel>
              <Form.Control
                name="refundDate"
                accepter={DatePicker}
                ref={formRef}
              />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button onClick={handleSubmit} appearance="primary">
                  Save
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddRefund;
