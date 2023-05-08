import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Form,
  Button,
  ButtonToolbar,
  Message,
  toaster,
} from "rsuite";

const defaultFormValue = {
  transactionId: 0,
  name: 0,
  description: "",
};

const DeleteTagModal = ({ showModal, tag, onClose }) => {
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
    console.log(tag);
    if (tag) {
      setFormValue(
        tag
          ? {
              transactionId: tag.transactionId,
              name: tag.name,
              description: tag.description,
            }
          : defaultFormValue
      );
    }
  };

  const handleSubmit = () => {
    // Submit the transaction to the backend
    fetch(`/tag/DeleteTransactionTag/${tag?.transactionId}/${tag?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful tag deletion
          toaster.push(<Message type="success">Success</Message>);
          handleClose();
        } else {
          // Handle error response
          response.text().then((text) => {
            toaster.push(
              <Message type="error">{"Error deleting tag:" + text}</Message>
            );
          });
        }
      })
      .catch((error) =>
        toaster.push(
          <Message type="error">{"Error deleting tag:" + error}</Message>
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
        <Modal.Title>{"Are you sure you wish to delete this Tag?"}</Modal.Title>
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

          <Form.Group controlId="name">
            <Form.ControlLabel>Name:</Form.ControlLabel>
            <Form.Control name="name" ref={formRef} disabled />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.ControlLabel>Description:</Form.ControlLabel>
            <Form.Control name="description" ref={formRef} disabled />
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

export default DeleteTagModal;
