import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  ButtonToolbar,
  DatePicker,
  InputPicker,
  InputNumber,
  Checkbox,
  Schema,
  Message,
  toaster,
} from "rsuite";

const { StringType, NumberType, DateType } = Schema.Types;
const model = Schema.Model({
  amount: NumberType()
    .min(0.01, "Amount must be greate than zero.")
    .isRequired("Amount is required."),
  sourcePicker: NumberType()
    .isInteger("Must be a valid id."),
  sourceName: StringType().rangeLength(
    2,
    250,
    "The number of characters can only be between 2 and 250"
  ),
  categoryPicker: NumberType()
    .isInteger("Must be a valid id."),
  categoryName: StringType().rangeLength(
    2,
    250,
    "The number of characters can only be between 2 and 250"
  ),
  datePicker: DateType().isRequired("Please select a date."),
});

const defaultFormValue = {
  amount: 0,
  sourcePicker: 0,
  sourceName: "",
  sourceDescription: "",
  categoryPicker: 0,
  categoryName: "",
  categoryDescription: "",
  description: "",
  datePicker: null,
};

const TransactionModal = ({ showModal, transaction, onClose }) => {
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState(
    transaction
      ? {
          amount: transaction.Amount,
          sourcePicker: transaction.SourceId,
          sourceName: "",
          sourceDescription: "",
          categoryPicker: transaction.CategoryId,
          categoryName: "",
          categoryDescription: "",
          description: transaction.description,
          datePicker: transaction.date,
        }
      : defaultFormValue
  );

  const [showNewSourceInput, setShowNewSourceInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const [sourceOptions, setSourceOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [isIncome, setIsIncome] = useState(false);

  const handleCheckboxChange = () => {
    setIsIncome(!isIncome);
  };

  useEffect(() => {
    // Fetch sources from backend when modal is shown
    if (showModal) {
      getAllSources();
      getAllCategories();
    }
  }, [showModal]);

  const getAllSources = async () => {
    try {
      const response = await fetch("/source/GetAllSources");
      const data = await response.json();
      setSourceOptions(data);
    } catch (error) {
      console.error("Failed to fetch sources:", error);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await fetch("/category/GetAllCategories");
      const data = await response.json();
      setCategoryOptions(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    }

    //Fill new Transaction's Source with the existing selected
    // OR newly entered data
    var tSource = {
      id: 0,
      name: "",
      description: "",
    };

    if (showNewSourceInput) {
      tSource.name = formValue.sourceName;
      tSource.description = formValue.sourceDescription;
    } else {
      tSource.id = formValue.sourcePicker;
    }

    //Fill new Transaction's Category with the existing selected
    // OR newly entered data
    var tCategory = {
      id: 0,
      name: "",
      description: "",
    };

    if (showNewCategoryInput) {
      tCategory.name = formValue.categoryName;
      tCategory.description = formValue.categoryDescription;
    } else {
      tCategory.id = formValue.categoryPicker;
    }

    const transaction = {
      Amount: isIncome ? formValue.amount : -formValue.amount,
      Source: tSource,
      Category: tCategory,
      Description: formValue.description,
      TransactionDate: formValue.datePicker,
    };

    // Submit the transaction to the backend
    fetch("/transaction/ProcessTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful transaction creation
          response.json().then((data) => {
            console.log("Transaction created:", data.Message);
            console.log("Transaction data:", data.Transaction);
            toaster.push(<Message type="success">Success</Message>);
            handleClose();
          });
        } else {
          // Handle error response
          toaster.push(
            <Message type="error">
              {"Error creating transaction:" + response.status}
            </Message>
          );
        }
      })
      .catch((error) =>
        toaster.push(
          <Message type="error">
            {"Error creating transaction:" + error}
          </Message>
        )
      );
  };

  const handleClose = () => {
    setFormValue(defaultFormValue);
    setShowNewSourceInput(false);
    setShowNewCategoryInput(false);
    setIsIncome(false);
    onClose();
  };

  return (
    <Modal open={showModal} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>
          {transaction ? "Edit Transaction" : "Add Transaction"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          ref={formRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          model={model}
        >
          <ButtonToolbar>
            <Button onClick={() => setFormValue(defaultFormValue)}>
              Clear form data
            </Button>
            <Button onClick={() => setShowNewSourceInput(!showNewSourceInput)}>
              {showNewSourceInput ? "Add Existing Source" : "Add New Sourece"}
            </Button>
            <Button
              onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
            >
              {showNewSourceInput
                ? "Add Existing Category"
                : "Add New Category"}
            </Button>
          </ButtonToolbar>
          <hr />

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

          {!showNewSourceInput ? (
            <Form.Group controlId="sourcePicker">
              <Form.ControlLabel>Source:</Form.ControlLabel>
              <Form.Control
                name="sourcePicker"
                accepter={InputPicker}
                ref={formRef}
                data={sourceOptions}
                labelKey="name" // Display source.name as the label
                valueKey="id" // Set source.id as the value
              />
            </Form.Group>
          ) : (
            <>
              <Form.Group controlId="sourceName">
                <Form.ControlLabel>Source Name:</Form.ControlLabel>
                <Form.Control name="sourceName" ref={formRef} />
              </Form.Group>
              <Form.Group controlId="sourceDescription">
                <Form.ControlLabel>Source Description:</Form.ControlLabel>
                <Form.Control name="sourceDescription" ref={formRef} />
              </Form.Group>
            </>
          )}

          {!showNewCategoryInput ? (
            <Form.Group controlId="categoryPicker">
              <Form.ControlLabel>Category:</Form.ControlLabel>
              <Form.Control
                name="categoryPicker"
                accepter={InputPicker}
                ref={formRef}
                data={categoryOptions}
                labelKey="name" // Display category.name as the label
                valueKey="id" // Set category.id as the value
              />
            </Form.Group>
          ) : (
            <>
              <Form.Group controlId="categoryName">
                <Form.ControlLabel>Category Name:</Form.ControlLabel>
                <Form.Control name="categoryName" ref={formRef} />
              </Form.Group>
              <Form.Group controlId="categoryDescription">
                <Form.ControlLabel>Category Description:</Form.ControlLabel>
                <Form.Control name="categoryDescription" ref={formRef} />
              </Form.Group>
            </>
          )}

          <Form.Group controlId="description">
            <Form.ControlLabel>Description:</Form.ControlLabel>
            <Form.Control name="description" ref={formRef} />
          </Form.Group>

          <Form.Group controlId="datePicker">
            <Form.ControlLabel>DatePicker:</Form.ControlLabel>
            <Form.Control
              name="datePicker"
              accepter={DatePicker}
              ref={formRef}
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
        <Checkbox onChange={handleCheckboxChange}>Income</Checkbox>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionModal;
