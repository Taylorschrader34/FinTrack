import React, { useState, useEffect } from "react";
import "rsuite/dist/rsuite.min.css";
import { format } from "date-fns";

import {
  Table,
  Pagination,
  ButtonToolbar,
  Button,
  IconButton,
  Modal,
  Form,
  Schema,
} from "rsuite";
import { Icon } from "@rsuite/icons";
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
const { Column, HeaderCell, Cell } = Table;

// const { StringType, NumberType } = Schema.Types;
// const model = Schema.Model({
//   amount: NumberType().isRequired("This field is required."),
//   transactionDate: StringType().isRequired("This field is required."),
//   source: StringType().isRequired("This field is required."),
//   category: StringType().isRequired("This field is required."),
//   description: StringType().isRequired("This field is required."),
// });

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState({});

  const [currentPage, setCurrentPage] = useState(1); // Current page of the pagination
  const [pageSize, setPageSize] = useState(10); // Number of items per page

  const [sortColumn, setSortColumn] = useState(null); // Column used for sorting
  const [sortType, setSortType] = useState(null); // Type of sorting (asc, desc)

  // Fetch transactions from API
  useEffect(() => {
    // Fetch transactions and setTransactions with the retrieved data
    getAllTransactions();
  }, []);

  const getAllTransactions = async () => {
    try {
      const response = await fetch("/transaction/GetAllTransactions");
      const data = await response.json();
      console.log(data);
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    // setCurrentPage(1); // Reset to first page when page size changes
    // setPageSize(size);
  };

  // Handle column sort
  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  // Sort data based on sort column and sort type
  const sortedTransactions = transactions.sort((a, b) => {
    const sortColumnKey = sortColumn || "id";
    const sortTypeDirection = sortType === "asc" ? 1 : -1;
    const valA = a[sortColumnKey];
    const valB = b[sortColumnKey];

    if (valA === valB) {
      return 0;
    } else if (valA === null || valA === undefined) {
      return sortTypeDirection;
    } else if (valB === null || valB === undefined) {
      return -sortTypeDirection;
    } else if (typeof valA === "string" && typeof valB === "string") {
      return valA.localeCompare(valB) * sortTypeDirection;
    } else {
      return (valA - valB) * sortTypeDirection;
    }
  });

  // Calculate total number of pages
  const totalPages = Math.ceil(sortedTransactions.length / pageSize);

  // Slice data based on current page and page size
  const slicedTransactions = sortedTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddTransaction = () => {
    // setShowModal(true);
    // setFormData({});
    // setFormError({});
  };

  const handleEditTransaction = (transaction) => {
    // setShowModal(true);
    // setFormData(transaction);
    // setFormError({});
  };

  const handleDeleteTransaction = (transactionId) => {
    // Delete transaction with the given transactionId
    // and update transactions state
  };

  const handleSubmit = () => {
    // const { errors, hasError } = formRef.check();
    // if (hasError) {
    //   setFormError(errors);
    //   return;
    // }

    // Submit form data to API or any other data source
    // and update transactions state
    setShowModal(false);
  };

  return (
    <div>
      <h1>Manage Transactions</h1>
      <ButtonToolbar>
        {/* <Button color="blue" onClick={handleAddTransaction}>
          Add Transaction
        </Button> */}
      </ButtonToolbar>
      <Table
        data={slicedTransactions}
        height={400}
        rowHeight={50}
        headerHeight={50}
        autoHeight
        virtualized
        bordered
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
      >
        <Column width={100} fixed align="center" resizable sortable>
          <HeaderCell>Amount</HeaderCell>
          <Cell dataKey="amount" />
        </Column>
        <Column width={150} align="center" resizable sortable>
          <HeaderCell>Transaction Date</HeaderCell>
          <Cell dataKey="transactionDate">
            {(rowData) =>
              format(new Date(rowData.transactionDate), "yyyy-MM-dd")
            }
          </Cell>
        </Column>
        <Column width={150} align="center" resizable sortable>
          <HeaderCell>Source</HeaderCell>
          <Cell dataKey="sourceName" />
        </Column>
        <Column width={150} align="center" resizable sortable>
          <HeaderCell>Category</HeaderCell>
          <Cell dataKey="categoryName" />
        </Column>
        <Column width={200} align="center" resizable sortable>
          <HeaderCell>Description</HeaderCell>
          <Cell dataKey="description" />
        </Column>
        <Column width={100} fixed="right" align="center" resizable>
          <HeaderCell>Edit/Delete</HeaderCell>
          <Cell>
            {({ rowData }) => (
              <ButtonToolbar>
                <IconButton
                  icon={<EditIcon/>}
                  size="xs"
                  appearance="ghost"
                  color="blue"
                  onClick={() => handleEditTransaction(rowData)}
                />
                <IconButton
                  icon={<TrashIcon/>}
                  size="xs"
                  appearance="ghost"
                  color="red"
                  onClick={() => handleDeleteTransaction(rowData.id)}
                />
              </ButtonToolbar>
            )}
          </Cell>
        </Column>
      </Table>
      <Pagination
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        maxButtons={5}
        size="md"
        pages={totalPages}
        activePage={currentPage}
        onSelect={handlePageChange}
      />
      {/* <Modal open={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>
            {formData.id ? "Edit Transaction" : "Add Transaction"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            model={model}
            ref={(ref) => (formRef = ref)}
            formData={formData}
            onChange={(formData) => setFormData(formData)}
            onCheck={(errors) => setFormError(errors)}
          >
            <Form.Group>
              <Form.ControlLabel>Amount</Form.ControlLabel>
              <Form.Control name="amount" />
              {formError.amount && (
                <span className="error">{formError.amount}</span>
              )}
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Transaction Date</Form.ControlLabel>
              <Form.Control name="transactionDate" />
              {formError.transactionDate && (
                <span className="error">{formError.transactionDate}</span>
              )}
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Source</Form.ControlLabel>
              <Form.Control name="source" />
              {formError.source && (
                <span className="error">{formError.source}</span>
              )}
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Category</Form.ControlLabel>
              <Form.Control name="category" />
              {formError.category && (
                <span className="error">{formError.category}</span>
              )}
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Form.Control name="description" />
              {formError.description && (
                <span className="error">{formError.description}</span>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button appearance="primary" onClick={handleSubmit}>
            {formData.id ? "Save Changes" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default ManageTransactions;
