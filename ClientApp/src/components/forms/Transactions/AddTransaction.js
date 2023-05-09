import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Divider,
  Form,
  Button,
  ButtonToolbar,
  DatePicker,
  InputPicker,
  InputNumber,
  Checkbox,
  TagPicker,
  Schema,
  Message,
  toaster,
  Row,
  Col,
  List,
} from "rsuite";

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

const defaultFormValue = {
  transactionId: 0,
  amount: 0,
  sourcePicker: 0,
  sourceName: "",
  sourceDescription: "",
  categoryPicker: 0,
  categoryName: "",
  categoryDescription: "",
  tagPicker: [],
  description: "",
  transactionDate: null,
};

const AddTransaction = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState(defaultFormValue);

  const [showNewSourceInput, setShowNewSourceInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewTagInput, setShowNewTagInput] = useState(false);

  const [sourceOptions, setSourceOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [tagName, setTagName] = useState("");
  const [tagDescription, setTagDescription] = useState("");
  const [newTags, setNewTags] = useState([]);

  const [isIncome, setIsIncome] = useState(false);

  useEffect(() => {
    getAllSources();
    getAllCategories();
    getAllTags();
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

  const getAllTags = async () => {
    try {
      const response = await fetch("/tag/GetAllTags");
      const data = await response.json();
      setTagOptions(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const handleAddTag = () => {
    if (tagName != "") {
      setNewTags([...newTags, { name: tagName, description: tagDescription }]);
      setTagName("");
      setTagDescription("");
    } else {
      toaster.push(<Message type="error">Tag must have a name.</Message>);
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

    //Fill new Transaction's Tags with the existing selected
    // AND/OR newly entered data
    var tTags = [];

    formValue.tagPicker.forEach((tagId) => {
      tTags = [...tTags, { id: tagId, name: "", description: "" }];
    });

    if (showNewTagInput) {
      newTags.forEach((tag) => {
        tTags = [
          ...tTags,
          { id: 0, name: tag.name, description: tag.description },
        ];
      });
    }

    const transInput = {
      Amount: isIncome
        ? Math.abs(formValue.amount)
        : -Math.abs(formValue.amount),
      Source: tSource,
      Category: tCategory,
      Description: formValue.description,
      TransactionDate: formValue.transactionDate,
      Refunds: [],
      tags: tTags,
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
              {`Error creating transaction: ${response.status}`}
            </Message>
          );
        }
      })
      .catch((error) =>
        toaster.push(
          <Message type="error">
            {`Error creating transaction: ${error}`}
          </Message>
        )
      );
  };

  const handleCheckboxChange = () => {
    setIsIncome(!isIncome);
  };

  return (
    <>
      <h1>Add Transaction</h1>
      <Form
        ref={formRef}
        onChange={setFormValue}
        onCheck={setFormError}
        formValue={formValue}
        model={transModel}
        style={{ marginLeft: "10px" }}
      >
        <ButtonToolbar>
          <Button onClick={() => setFormValue(defaultFormValue)}>
            Clear form data
          </Button>
          <Button onClick={() => setShowNewSourceInput(!showNewSourceInput)}>
            {showNewSourceInput ? "Add Existing Source" : "Add New Source"}
          </Button>
          <Button
            onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
          >
            {showNewCategoryInput ? "Add Existing Category" : "Add New Category"}
          </Button>
          <Button onClick={() => setShowNewTagInput(!showNewTagInput)}>
            {showNewTagInput ? "Don't Add New Tags" : "Add New Tags"}
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

            <Form.Group controlId="tagPicker">
              <Form.ControlLabel>Tags:</Form.ControlLabel>
              <Form.Control
                name="tagPicker"
                accepter={TagPicker}
                ref={formRef}
                data={tagOptions}
                labelKey="name" // Display tag.name as the label
                valueKey="id" // Set tag.id as the value
              />
            </Form.Group>

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
                <Button onClick={handleAddTag}>Add Tag</Button>
                <List bordered>
                  {newTags.map((tag, index) => (
                    <List.Item key={index}>
                      <div>
                        <div>Tag Name: {tag.name}</div>
                        <div>Tag Name: {tag.description}</div>
                      </div>
                    </List.Item>
                  ))}
                </List>
              </>
            ) : (
              <></>
            )}

            <Form.Group>
              <ButtonToolbar>
                <Checkbox onChange={handleCheckboxChange}>Income</Checkbox>
                <Button onClick={handleSubmit} appearance="primary">
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

export default AddTransaction;
