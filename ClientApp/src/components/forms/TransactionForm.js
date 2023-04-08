import React, { useState } from "react";
import { Button, Modal, Form, InputGroup, FormControl } from "react-bootstrap";

export const TransactionForm = (props) => {
  const [ammount, setAmmount] = useState("");
  const handleAmmountChange = (event) => {
    setAmmount(event.target.value);
  };

  const [date, setDate] = useState("");
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const exampleCategories = [
    { categoryID: 1, categoryName: "testCat 1" },
    { categoryID: 2, categoryName: "testCat 2" },
    { categoryID: 3, categoryName: "testCat 3" },
  ];
  const categories = [
    { categoryID: 0, categoryName: "" },
    ...exampleCategories,
  ];
  const [category, setCategory] = useState("");
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          New Transaction
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formAmmount">
            <Form.Label>Enter amount:</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <FormControl
                type="number"
                step="0.01"
                min="0"
                value={ammount}
                onChange={handleAmmountChange}
                style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formDate">
            <Form.Label>Transaction Date:</Form.Label>
            <InputGroup>
              <FormControl
                type="date"
                value={date}
                onChange={handleDateChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formCategory">
            <Form.Label>Category:</Form.Label>
            <InputGroup>
              <Form.Select value={category} onChange={handleCategoryChange}>
                {categories.map((categories) => (
                  <option
                    key={categories.categoryID}
                    value={categories.categoryName}
                  >
                    {categories.categoryName}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

TransactionForm.propTypes = {};
