import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Modal,
  Form,
  InputPicker,
  Button,
  ButtonToolbar,
  Message,
  toaster,
} from "rsuite";

const defaultFormValue = {
  transactionId: 0,
  tagId: 0,
  tagName: "",
  tagDescription: "",
};

const AddTagModal = ({ showModal, transactionId, onClose }) => {
  const navigate = useNavigate();

  const formRef = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState(defaultFormValue);

  const [showNewTagInput, setShowNewTagInput] = useState(false);

  const [tagOptions, setTagOptions] = useState([]);
  const [tagName, setTagName] = useState("");
  const [tagDescription, setTagDescription] = useState("");

  useEffect(() => {
    // Fetch sources from backend when modal is shown
    if (showModal) {
      getAllTags();
    }
  }, [showModal]);

  const getAllTags = async () => {
    try {
      const response = await fetch("/tag/GetAllTags");
      const data = await response.json();
      setTagOptions(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    }

    //Fill new Transaction's Tags with the existing selected
    // AND/OR newly entered data
    var tag = {
      TransactionId: transactionId,
      TagId: 0,
      Name: "",
      Description: "",
    };

    if (showNewTagInput) {
      tag.Name = formValue.tagName;
      tag.Description = formValue.tagDescription;
    } else {
      tag.TagId = formValue.tagPicker;
    }

    // Submit the refund to the backend
    fetch("/tag/CreateTransactionTag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tag),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful refund creation
          response.json().then((data) => {
            toaster.push(<Message type="success">Success</Message>);
          });
          onClose();
        } else {
          // Handle error response
          toaster.push(
            <Message type="error">
              {`Error creating tag: ${response.status}`}
            </Message>
          );
        }
      })
      .catch((error) =>
        toaster.push(
          <Message type="error">{`Error creating tag: ${error}`}</Message>
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
        <Modal.Title>{"Add Tag to Transaction"}</Modal.Title>
      </Modal.Header>
      <ButtonToolbar>
        <Button onClick={() => setShowNewTagInput(!showNewTagInput)}>
          {showNewTagInput ? "Add Existing Tag" : "Add New Tags"}
        </Button>
      </ButtonToolbar>
      <Modal.Body>
        <Form
          ref={formRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
        >
          <ButtonToolbar></ButtonToolbar>
          <hr />

          {showNewTagInput ? (
            <>
              <Form.Group>
                <Form.ControlLabel>Tag Name</Form.ControlLabel>
                <Form.Control
                  name="tagName"
                  value={tagName}
                  onChange={(value) => setTagName(value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Tag Description</Form.ControlLabel>
                <Form.Control
                  name="tagDescription"
                  value={tagDescription}
                  onChange={(value) => setTagDescription(value)}
                />
              </Form.Group>
            </>
          ) : (
            <Form.Group controlId="tagPicker">
              <Form.ControlLabel>Tags:</Form.ControlLabel>
              <Form.Control
                name="tagPicker"
                accepter={InputPicker}
                ref={formRef}
                data={tagOptions}
                labelKey="name" // Display tag.name as the label
                valueKey="id" // Set tag.id as the value
              />
            </Form.Group>
          )}
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

export default AddTagModal;
