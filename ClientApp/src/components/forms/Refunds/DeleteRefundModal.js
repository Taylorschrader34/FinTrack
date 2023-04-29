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
import { useNavigate } from "react-router-dom";

const defaultFormValue = {
  transactionId: 0,
  amount: 0,
  description: "",
  refundDate: null,
};

const DeleteRefundModal = ({ showModal, refund, onClose }) => {
  const navigate = useNavigate();
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
    console.log(refund);
    if (refund) {
      setFormValue(
        refund
          ? {
              transactionId: refund.transactionId,
              amount: refund.amount,
              description: refund.description,
              refundDate: new Date(refund.refundDate),
            }
          : defaultFormValue
      );
    }
  };

  const handleSubmit = () => {
    // Submit the transaction to the backend
    fetch(`/refund/DeleteRefund/${refund?.transactionId}/${refund?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful refund deletion
          toaster.push(<Message type="success">Success</Message>);
          handleClose();
        } else {
          // Handle error response
          response.text().then((text) => {
            toaster.push(
              <Message type="error">{"Error deleting refund:" + text}</Message>
            );
          });
        }
      })
      .catch((error) =>
        toaster.push(
          <Message type="error">{"Error deleting refund:" + error}</Message>
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
          {"Are you sure you wish to delete this Refund?"}
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

          <Form.Group controlId="description">
            <Form.ControlLabel>Description:</Form.ControlLabel>
            <Form.Control name="description" ref={formRef} disabled />
          </Form.Group>

          <Form.Group controlId="refundDate">
            <Form.ControlLabel>Refund Date:</Form.ControlLabel>
            <Form.Control
              name="refundDate"
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
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteRefundModal;
