import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Divider,
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
  Row,
  Col,
} from "rsuite";
import RefundTable from "../Refunds/RefundTable";

const { StringType, NumberType, DateType } = Schema.Types;
const transModel = Schema.Model({
  amount: NumberType().isRequired("Amount is required."),
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
  transactionDate: DateType().isRequired("Please select a date."),
});

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    amount: 0,
    description: "",
    transactionDate: new Date(),
    sourcePicker: 0,
    categoryPicker: 0,
    sourceName: "",
    sourceDescription: "",
    categoryName: "",
    categoryDescription: "",
    isIncome: false,
  });

  const [showNewSourceInput, setShowNewSourceInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const [sourceOptions, setSourceOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [refunds, setRefunds] = useState([]);

  const [isIncome, setIsIncome] = useState(false);

  useEffect(() => {
    getAllSources();
    getAllCategories();
    getTransaction();
  }, []);

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

  const getTransaction = async () => {
    try {
      const response = await fetch(`/transaction/GetTransactionById/${id}`);
      const data = await response.json();
      if(data.id == 0){
        toaster.push(<Message type="error">No Transaction with that Id</Message>);
        navigate("/Transactions");
      }
      updateFormValues(data);
    } catch (error) {
      console.error(`Failed to fetch transaction with Id ${id}:`, error);
    }
  };

  const updateFormValues = async (transaction) => {
    setFormValue({
      transactionId: transaction.id,
      amount: Math.abs(transaction.amount),
      sourcePicker: transaction.sourceId,
      sourceName: "",
      sourceDescription: "",
      categoryPicker: transaction.categoryId,
      categoryName: "",
      categoryDescription: "",
      description: transaction.description,
      transactionDate: new Date(transaction.transactionDate),
    });
    setRefunds(transaction.refunds);
    setIsIncome(transaction.amount > 0);
  };

  const handleCheckboxChange = () => {
    setIsIncome(!isIncome);
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
      TransactionId: id,
      Amount: isIncome
        ? Math.abs(formValue.amount)
        : -Math.abs(formValue.amount),
      Source: tSource,
      Category: tCategory,
      Description: formValue.description,
      TransactionDate: formValue.transactionDate,
      Refunds: [],
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
          });
          navigate("/Transactions");
        } else {
          // Handle error response
          toaster.push(
            <Message type="error">
              {`Error updating transaction: ${response.status}`}
            </Message>
          );
        }
      })
      .catch((error) =>
        toaster.push(
          <Message type="error">
            {`Error updating transaction: ${error}`}
          </Message>
        )
      );
  };

  return (
    <>
      <h1>Edit Transaction</h1>
      <Form
        ref={formRef}
        onChange={setFormValue}
        onCheck={setFormError}
        formValue={formValue}
        model={transModel}
        style={{ marginLeft: "10px" }}
      >
        <ButtonToolbar>
          <Button onClick={() => setShowNewSourceInput(!showNewSourceInput)}>
            {showNewSourceInput ? "Add Existing Source" : "Add New Sourece"}
          </Button>
          <Button
            onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
          >
            {showNewSourceInput ? "Add Existing Category" : "Add New Category"}
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

            <Form.Group controlId="transactionDate">
              <Form.ControlLabel>Transaction Date:</Form.ControlLabel>
              <Form.Control
                name="transactionDate"
                accepter={DatePicker}
                ref={formRef}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
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
                    formValue?.sourceId
                      ? sourceOptions.find(
                          (option) => option.id === formValue.sourceId
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
                    formValue?.categoryId
                      ? sourceOptions.find(
                          (option) => option.id === formValue.categoryId
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

            <Form.Group>
              <ButtonToolbar>
                <Checkbox onChange={handleCheckboxChange} checked={isIncome}>
                  Income
                </Checkbox>
                <Button onClick={handleSubmit} appearance="primary">
                  Save
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <RefundTable refunds={refunds}></RefundTable>
    </>
  );
};

export default EditTransaction;
