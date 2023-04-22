import React, { useState, useEffect } from "react";
import "rsuite/dist/rsuite.min.css";
import { format } from "date-fns";

import {
  Table,
  Pagination,
  ButtonToolbar,
  Button,
  IconButton,
  FlexboxGrid,
} from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import TransactionModal from "../forms/TransactionModal";

const { Column, HeaderCell, Cell } = Table;

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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

  // Handler to open the modal for adding a new transaction
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setShowModal(true);
  };

  // Handler to open the modal for editing a transaction
  const handleEditTransaction = (transaction) => {
    // setSelectedTransaction(transaction);
    // setShowModal(true);
    console.log("Editing transaction with ID:", transaction.transactionId);
  };

  // Handler to delete a transaction
  const handleDeleteTransaction = (transaction) => {
    // Implement delete transaction logic here
    console.log("Deleting transaction with ID:", transaction.transactionId);
  };

  const handleModalClose = () => {
    setShowModal(false);
    getAllTransactions();
  };

  return (
    <div>
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={8}>
          {<h1>Manage Transactions</h1>}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={16}>
          {
            <ButtonToolbar>
              <Button appearance="primary" onClick={handleAddTransaction}>
                Add Transaction
              </Button>
            </ButtonToolbar>
          }
        </FlexboxGrid.Item>
      </FlexboxGrid>
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
            {(rowData ) => (
              <ButtonToolbar>
                <IconButton
                  icon={<EditIcon />}
                  size="xs"
                  appearance="ghost"
                  color="blue"
                  onClick={() => handleEditTransaction(rowData)}
                />
                <IconButton
                  icon={<TrashIcon />}
                  size="xs"
                  appearance="ghost"
                  color="red"
                  onClick={() => handleDeleteTransaction(rowData)}
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
      <TransactionModal
        showModal={showModal}
        transaction={selectedTransaction}
        onClose={() => handleModalClose()}
      />
    </div>
  );
};

export default ManageTransactions;
