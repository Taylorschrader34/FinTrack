import React, { useEffect, useRef, useState } from "react";
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
  tagPicker: 0
};

const defaultNewTag = {
  transactionId: 0,
  tagPicker: 0
};

const AddTagModal = ({ showModal, transactionId, onClose }) => {
  const formRef = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState(defaultFormValue);
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const [newTag, setNewTag] = useState({
    tagName: "",
    tagDescription: "",
  });

  useEffect(() => {
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

    const tag = {
      TransactionId: transactionId,
      TagId: 0,
      Name: "",
      Description: "",
    };

    if (showNewTagInput) {
      if (!newTag.tagName) {
        toaster.push(<Message type="error">New tag must have a name.</Message>);
        return;
      }
      tag.Name = newTag.tagName;
      tag.Description = newTag.tagDescription;
    } else {
      tag.TagId = formValue.tagPicker;
    }

    fetch("/tag/CreateTransactionTag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tag),
    })
      .then((response) => {
        if (response.ok) {
          toaster.push(<Message type="success">Success</Message>);
          handleModalClose();
        } else {
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

  const handleModalClose = () => {
    setFormValue(defaultFormValue);
    setNewTag({
      tagName: "",
      tagDescription: "",
    });
    onClose();
  };

  return (
    <Modal open={showModal} onClose={handleModalClose}>
      <Modal.Header>
        <Modal.Title>Add Tag to Transaction</Modal.Title>
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
          onCheck={(error) => setFormError(error)}
          formValue={formValue}
        >
          <hr />
          {showNewTagInput ? (
            <>
              <Form.Group>
                <Form.ControlLabel>Tag Name</Form.ControlLabel>
                <Form.Control
                  name="tagName"
                  value={newTag.tagName}
                  onChange={(value) => setNewTag({ ...newTag, tagName: value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Tag Description</Form.ControlLabel>
                <Form.Control
                  name="tagDescription"
                  value={newTag.tagDescription}
                  onChange={(value) =>
                    setNewTag({ ...newTag, tagDescription: value })
                  }
                />
              </Form.Group>
            </>
          ) : (
            <Form.Group controlId="tagPicker">
              <Form.ControlLabel>Tags:</Form.ControlLabel>
              <Form.Control
                name="tagPicker"
                accepter={InputPicker}
                data={tagOptions}
                labelKey="name"
                valueKey="id"
              />
            </Form.Group>
          )}
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

export default AddTagModal;
