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

const getTransaction = async (id, navigate) => {
  try {
    const response = await fetch(`/transaction/GetTransactionById/${id}`);
    if (response.ok) {
      const data = await response.json();
      if (data.transactionId === 0) {
        toaster.push(
          <Message type="error">No Transaction with that Id</Message>
        );
        navigate("/Transactions");
      }
      return data;
    } else {
      console.log("Error fetching transaction");
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch transaction with Id ${id}:`, error);
    return null;
  }
};

const handleSubmit = (transaction, formValue, navigate) => {
  if (!formValue.amount || formValue.amount === 0) {
    toaster.push(<Message type="error">Amount must not be zero.</Message>);
    return;
  }

  const refundInput = {
    TransactionId: transaction.id,
    Amount: Math.abs(formValue.amount),
    Description: formValue.description,
    RefundDate: formValue.refundDate,
  };

  fetch("/refund/CreateRefund", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refundInput),
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          toaster.push(<Message type="success">Success</Message>);
        });
        navigate(`/Transactions/edit/${transaction.id}`);
      } else {
        toaster.push(
          <Message type="error">{`Error creating refund: ${response.status}`}</Message>
        );
      }
    })
    .catch((error) =>
      toaster.push(
        <Message type="error">{`Error creating refund: ${error}`}</Message>
      )
    );
};

const AmountInput = React.forwardRef((props, ref) => (
  <Form.Control
    name="amount"
    accepter={InputNumber}
    ref={ref}
    min={0}
    step={0.01}
    {...props}
  />
));

const DescriptionInput = React.forwardRef((props, ref) => (
  <Form.Control name="description" ref={ref} {...props} />
));

const RefundDatePicker = React.forwardRef((props, ref) => (
  <Form.Control name="refundDate" accepter={DatePicker} ref={ref} {...props} />
));

const AddRefund = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const formRef = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState(defaultFormValue);
  const [transaction, setTransaction] = useState({});

  useEffect(() => {
    getTransaction(id, navigate).then((data) => {
      if (data) {
        setTransaction(data);
      }
    });
  }, [id, navigate]);

  const handleFormSubmit = () => {
    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    }

    handleSubmit(transaction, formValue, navigate);
  };

  const handleClearForm = () => {
    setFormValue(defaultFormValue);
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
          <Button onClick={handleClearForm}>Clear form data</Button>
        </ButtonToolbar>
        <Divider />

        <Row>
          <Col md={6}>
            <Form.Group controlId="amount">
              <Form.ControlLabel>Amount</Form.ControlLabel>
              <AmountInput />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.ControlLabel>Description:</Form.ControlLabel>
              <DescriptionInput />
            </Form.Group>

            <Form.Group controlId="refundDate">
              <Form.ControlLabel>Refund Date:</Form.ControlLabel>
              <RefundDatePicker />
            </Form.Group>

            <Form.Group>
              <ButtonToolbar>
                <Button onClick={handleFormSubmit} appearance="primary">
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
