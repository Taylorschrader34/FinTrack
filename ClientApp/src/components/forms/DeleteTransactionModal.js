import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Form,
  Button,
  ButtonToolbar,
  DatePicker,
  InputNumber,
  Checkbox,
  Message,
  toaster,
} from "rsuite";

const defaultFormValue = {
  transactionId: 0,
  amount: 0,
  sourceName: "",
  categoryName: "",
  description: "",
  datePicker: null,
};

const DeleteTransactionModal = ({ showModal, transaction, onClose }) => {
  const formRef = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState(defaultFormValue);

  useEffect(() => {
    // Fetch sources from backend when modal is shown
    if (showModal) {
      updateFormValues();
    }
  }, [showModal]);

  const updateFormValues = async () => {
    if (transaction) {
      setFormValue(
        transaction
          ? {
              transactionId: transaction.transactionId,
              amount: transaction.amount,
              sourceName: transaction.sourceName,
              categoryName: transaction.categoryName,
              description: transaction.description,
              datePicker: new Date(transaction.transactionDate),
            }
          : defaultFormValue
      );
    }
  };

  const handleSubmit = () => {
    // Submit the transaction to the backend

    fetch(`/transaction/DeleteTransaction/${transaction?.transactionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful transaction deletion
          toaster.push(<Message type="success">Success</Message>);
          handleClose();
        } else {
          // Handle error response
          response.text().then((text) => {
            toaster.push(
              <Message type="error">
                {"Error deleting transaction:" + text}
              </Message>
            );
          });
        }
      })
      .catch((error) =>
        toaster.push(
          <Message type="error">
            {"Error deleting transaction:" + error}
          </Message>
        )
      );
  };

  const handleClose = () => {
    setFormValue(defaultFormValue);
    onClose();
  };

  return (
    <Modal open={showModal} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>
          {"Are you sure you wish to delete this Transaction?"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          ref={formRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
        >
          <ButtonToolbar></ButtonToolbar>
          <hr />

          <Form.Group controlId="amount">
            <Form.ControlLabel>Amount</Form.ControlLabel>
            <Form.Control
              name="amount"
              accepter={InputNumber}
              ref={formRef}
              min={0}
              step={0.01}
              disabled
            />
          </Form.Group>

          <Form.Group controlId="sourceName">
            <Form.ControlLabel>Source:</Form.ControlLabel>
            <Form.Control name="sourceName" ref={formRef} disabled />
          </Form.Group>

          <Form.Group controlId="categoryName">
            <Form.ControlLabel>Category:</Form.ControlLabel>
            <Form.Control name="categoryName" ref={formRef} disabled />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.ControlLabel>Description:</Form.ControlLabel>
            <Form.Control name="description" ref={formRef} disabled />
          </Form.Group>

          <Form.Group controlId="datePicker">
            <Form.ControlLabel>DatePicker:</Form.ControlLabel>
            <Form.Control
              name="datePicker"
              accepter={DatePicker}
              ref={formRef}
              disabled
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} appearance="subtle">
          Cancel
        </Button>
        <Button onClick={handleSubmit} appearance="primary">
          Save
        </Button>
        <Checkbox defaultChecked={transaction?.amount > 0} disabled>
          Income
        </Checkbox>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteTransactionModal;
