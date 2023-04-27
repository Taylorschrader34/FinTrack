import React, { useState, useEffect, useRef } from "react";
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
const transModel = Schema.Model({
  amount: NumberType().isRequired("Amount is required."),
  // .check((value) => value !== 0, "Amount must not be equal to zero."),
  sourcePicker: NumberType().isInteger("Must be a valid id."),
  sourceName: StringType().rangeLength(
    2,
    250,
    "The number of characters can only be between 2 and 250"
  ),
  categoryPicker: NumberType().isInteger("Must be a valid id."),
  categoryName: StringType().rangeLength(
    2,
    250,
    "The number of characters can only be between 2 and 250"
  ),
  datePicker: DateType().isRequired("Please select a date."),
});

const defaultFormValue = {
  transactionId: 0,
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
  const formRef = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState(defaultFormValue);

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
      updateFormValues();
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

  const updateFormValues = async () => {
    if (transaction) {
      setFormValue(
        transaction
          ? {
              transactionId: transaction.transactionId,
              amount: transaction.amount,
              sourcePicker: transaction.sourceId,
              sourceName: "",
              sourceDescription: "",
              categoryPicker: transaction.categoryId,
              categoryName: "",
              categoryDescription: "",
              description: transaction.description,
              datePicker: new Date(transaction.transactionDate),
            }
          : defaultFormValue
      );
      setIsIncome(transaction.amount > 0);
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

    const transInput = {
      TransactionId: transaction?.transactionId,
      Amount: isIncome
        ? Math.abs(formValue.amount)
        : -Math.abs(formValue.amount),
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
      body: JSON.stringify(transInput),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful transaction creation
          response.json().then((data) => {
            toaster.push(<Message type="success">Success</Message>);
            handleClose();
          });
        } else {
          // Handle error response
          toaster.push(
            <Message type="error">
              {`Error ${
                transaction?.transactionId == 0 ? "creating" : "updating"
              } transaction: ${response.status}`}
            </Message>
          );
        }
      })
      .catch((error) =>
        toaster.push(
          <Message type="error">
            {`Error ${
              transaction?.transactionId == 0 ? "creating" : "updating"
            } transaction: ${error}`}
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
          model={transModel}
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
                defaultValue={
                  transaction?.sourceId
                    ? sourceOptions.find(
                        (option) => option.id === transaction.sourceId
                      )
                    : undefined
                }
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
                defaultValue={
                  transaction?.categoryId
                    ? sourceOptions.find(
                        (option) => option.id === transaction.categoryId
                      )
                    : undefined
                }
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
        <Checkbox
          onChange={handleCheckboxChange}
          defaultChecked={transaction?.amount > 0}
        >
          Income
        </Checkbox>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionModal;
