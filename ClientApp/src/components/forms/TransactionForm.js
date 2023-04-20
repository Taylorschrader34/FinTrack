import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";

const TransactionForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  
  const [amount, setAmount] = useState(isIncome ? "" : "-");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const [sources, setSources] = useState([]);
  const [showNewSourceInput, setShowNewSourceInput] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceDescription, setNewSourceDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

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
      setSources(data);
    } catch (error) {
      console.error("Failed to fetch sources:", error);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await fetch("/category/GetAllCategories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // You can access the input values from the state variables (amount, source, category, transactionDate)
    // and send them to the backend for further processing
    console.log("Form submitted:", amount, source, category, transactionDate);
    setShowModal(false); // Close the modal after form submission
  };

  const handleModalClose = () => {
    setShowModal(false); // Close the modal when the close button is clicked
  };

  return (
    <>
      <Col xs lg="2">
        <Button
          variant="primary"
          onClick={() => {
            setShowModal(true);
            setIsIncome(true);
          }}
        >
          Add Income
        </Button>
      </Col>
      <Col xs lg="2">
        <Button
          variant="primary"
          onClick={() => {
            setShowModal(true);
            setIsIncome(false);
          }}
        >
          Add Expense
        </Button>
      </Col>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isIncome ? "Add Income" : "Add Expense"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder={
                  isIncome ? "Enter amount" : "Enter amount (negative)"
                }
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="source">
              <Form.Label>Source</Form.Label>
              <Form.Control
                as="select"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="">Select source</option>
                {sources.map((src) => (
                  <option key={src.id} value={src.name}>
                    {src.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Text>
                {showNewSourceInput ? (
                  <>
                    <br />
                    <Form.Label>New Source</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter New Source Name"
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Enter New Source Description"
                      value={newSourceDescription}
                      onChange={(e) => setNewSourceDescription(e.target.value)}
                    />
                    <br />
                  </>
                ) : (
                  <Button
                    variant="link"
                    onClick={() => setShowNewSourceInput(true)}
                  >
                    Add New Source
                  </Button>
                )}
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Text>
                {showNewCategoryInput ? (
                  <>
                    <br />
                    <Form.Label>New Category</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter New Category Name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Enter New Category Description"
                      value={newCategoryDescription}
                      onChange={(e) =>
                        setNewCategoryDescription(e.target.value)
                      }
                    />
                    <br />
                  </>
                ) : (
                  <Button
                    variant="link"
                    onClick={() => setShowNewCategoryInput(true)}
                  >
                    Add New Category
                  </Button>
                )}
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="transactionDate">
              <Form.Label>Transaction Date</Form.Label>
              <Form.Control
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TransactionForm;
