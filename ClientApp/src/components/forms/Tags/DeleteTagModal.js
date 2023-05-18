import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, Message, toaster } from "rsuite";

const defaultFormValue = {
  transactionId: 0,
  name: "",
  description: "",
};

const DeleteTagModal = ({ showModal, tag, onClose }) => {
  const formRef = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState(defaultFormValue);

  useEffect(() => {
    if (showModal) {
      updateFormValues();
    }
  }, [showModal]);

  const updateFormValues = () => {
    if (tag) {
      setFormValue({
        transactionId: tag.transactionId,
        name: tag.name,
        description: tag.description,
      });
    } else {
      setFormValue(defaultFormValue);
    }
  };

  const handleSubmit = () => {
    fetch(`/tag/DeleteTransactionTag/${tag?.transactionId}/${tag?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          toaster.push(<Message type="success">Success</Message>);
          handleModalClose();
        } else {
          response.text().then((text) => {
            toaster.push(
              <Message type="error">{"Error deleting tag: " + text}</Message>
            );
          });
        }
      })
      .catch((error) =>
        toaster.push(
          <Message type="error">{"Error deleting tag: " + error}</Message>
        )
      );
  };

  const handleModalClose = () => {
    setFormValue(defaultFormValue);
    onClose();
  };

  return (
    <Modal open={showModal} onClose={handleModalClose}>
      <Modal.Header>
        <Modal.Title>Are you sure you wish to delete this Tag?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          ref={formRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
        >
          <hr />
          <Form.Group controlId="name">
            <Form.ControlLabel>Name:</Form.ControlLabel>
            <Form.Control name="name" disabled />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.ControlLabel>Description:</Form.ControlLabel>
            <Form.Control name="description" disabled />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleModalClose} appearance="subtle">
          Cancel
        </Button>
        <Button onClick={handleSubmit} appearance="primary">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteTagModal;
