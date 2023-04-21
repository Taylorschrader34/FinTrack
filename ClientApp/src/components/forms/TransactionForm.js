import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";

const TransactionForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [isIncome, setIsIncome] = useState(false);

  const [amount, setAmount] = useState(0);
  const [soureId, setSource] = useState({});
  const [categoryId, setCategory] = useState({});
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const [sourceOptions, setSourceOptions] = useState([]);
  const [showNewSourceInput, setShowNewSourceInput] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceDescription, setNewSourceDescription] = useState("");

  const [categoryOptions, setCategoryOptions] = useState([]);
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

  // Handle form submit
  const handleSubmit = async () => {
    //Fill new Transaction's Source with the existing selected
    // OR newly entered data
    var tSource = {
      id: 0,
      name: "",
      description: "",
    };

    if (newSourceName !== "") {
      tSource.name = newSourceName;
      tSource.description = newSourceDescription;
    } else {
      tSource.id = parseInt(soureId);
    }

    //Fill new Transaction's Category with the existing selected
    // OR newly entered data
    var tCategory = {
      id: 0,
      name: "",
      description: "",
    };

    if (newCategoryName !== "") {
      tCategory.name = newCategoryName;
      tCategory.description = newCategoryDescription;
    } else {
      tCategory.id = parseInt(categoryId);
    }

    const transaction = {
      Amount: isIncome ? parseFloat(amount) : -parseFloat(amount),
      Source: tSource,
      Category: tCategory,
      Description: description,
      TransactionDate: transactionDate,
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
            handleModalClose();
          });
        } else {
          // Handle error response
          console.error("Error creating transaction:", response.status);
        }
      })
      .catch((error) => console.error("Error creating transaction:", error));
  };

  const handleModalClose = () => {
    setShowModal(false); // Close the modal when the close button is clicked

    // Reset form fields
    setAmount(0);
    setSource({});
    setCategory({});
    setDescription("");
    setTransactionDate(new Date());
    setShowNewSourceInput(false);
    setNewSourceName("");
    setNewSourceDescription("");
    setShowNewCategoryInput(false);
    setNewCategoryName("");
    setNewCategoryDescription("");
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
          <Form>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                inputMode="numeric"
                placeholder={"Enter amount"}
                value={amount}
                onChange={(e) =>
                  setAmount(Math.abs(parseFloat(e.target.value)))
                }
              />
            </Form.Group>
            <Form.Group controlId="source">
              <Form.Label>Source</Form.Label>
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
                  <>
                    <Form.Control
                      as="select"
                      value={soureId}
                      onChange={(e) => setSource(e.target.value)}
                    >
                      <option value="">Select source</option>
                      {sourceOptions.map((src) => (
                        <option key={src.id} value={src.id}>
                          {src.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Button
                      variant="light"
                      onClick={() => setShowNewSourceInput(true)}
                    >
                      Add New Source
                    </Button>
                  </>
                )}
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
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
                  <>
                    <Form.Control
                      as="select"
                      value={categoryId}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select category</option>
                      {categoryOptions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Button
                      variant="light"
                      onClick={() => setShowNewCategoryInput(true)}
                    >
                      Add New Category
                    </Button>
                  </>
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
              <Button variant="primary" onClick={handleSubmit}>
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
