import React, { useState, useEffect } from "react";
import "rsuite/dist/rsuite.min.css";
import { format, subMonths } from "date-fns";
import { useNavigate } from "react-router-dom";

import {
  Table,
  Pagination,
  ButtonToolbar,
  Button,
  IconButton,
  FlexboxGrid,
  DateRangePicker,
} from "rsuite";

import DeleteTransactionModal from "../forms/Transactions/DeleteTransactionModal";

import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import ReloadIcon from "@rsuite/icons/Reload";

const { Column, HeaderCell, Cell } = Table;

const Transactions = () => {
  const navigate = useNavigate();

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: subMonths(new Date(), 1),
    endDate: new Date(),
  });

  const [showDelTransModal, setShowDelTransModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [transactions, setTransactions] = useState(new Array());
  const [sortedTransactions, setSortedTransactions] = useState(new Array());
  const [slicedTransactions, setSlicedTransactions] = useState(new Array());

  const [currentPage, setCurrentPage] = useState(1); // Current page of the pagination
  const [pageSize, setPageSize] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(0); // Number total pages

  const [sortColumn, setSortColumn] = useState(null); // Column used for sorting
  const [sortType, setSortType] = useState(null); // Type of sorting (asc, desc)

  // Fetch transactions from API
  useEffect(() => {
    fetchTransactions();
  }, [selectedDateRange]);

  // Sort data based on sort column and sort type
  useEffect(() => {
    const newSortedTransactions = Array.isArray(transactions)
      ? transactions.sort((a, b) => {
          const sortColumnKey = sortColumn || "transactionDate";
          const sortTypeDirection = sortType === "asc" ? 1 : -1;
          var valA;
          var valB;

          if (
            sortColumnKey != "source[name]" &&
            sortColumnKey != "category[name]"
          ) {
            valA = a[sortColumnKey];
            valB = b[sortColumnKey];
          } else if (sortColumnKey == "source[name]") {
            valA = a.source.name;
            valB = b.source.name;
          } else if (sortColumnKey == "category[name]") {
            valA = a.category.name;
            valB = b.category.name;
          }

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
        })
      : [];

    setSortedTransactions([...newSortedTransactions]);
  }, [transactions, sortColumn, sortType]);

  // Sort data based on sort column and sort type
  // Calculate total number of pages
  useEffect(() => {
    setSlicedTransactions(
      sortedTransactions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      )
    );

    setTotalPages(Math.ceil(sortedTransactions.length / pageSize));
  }, [sortedTransactions, currentPage]);

  // Fetch transactions and setTransactions with the retrieved data
  const fetchTransactions = () => {
    selectedDateRange.startDate && selectedDateRange.endDate
      ? getAllTransactionsByDateRange(
          selectedDateRange.startDate,
          selectedDateRange.endDate
        )
      : getAllTransactions();
  };

  const getAllTransactions = async () => {
    try {
      const response = await fetch(`/transaction/GetAllTransactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const getAllTransactionsByDateRange = async (startDate, endDate) => {
    const startDateInput = startDate.toISOString();
    const endDateInput = endDate.toISOString();

    try {
      const response = await fetch(
        `/transaction/GetTransactionsByDateRange?startDate=${startDateInput}&endDate=${endDateInput}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const handleRangeChange = (range) => {
    setSelectedDateRange(
      range
        ? { startDate: range[0], endDate: range[1] }
        : { startDate: null, endDate: null }
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //TODO implement this
  const handlePageSizeChange = (size) => {
    // setCurrentPage(1); // Reset to first page when page size changes
    // setPageSize(size);
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const handleAddTransaction = () => {
    navigate("/Transactions/Add");
  };

  const handleAddRefund = (transaction) => {
    navigate(`/Refunds/add/${transaction.id}`);
  };

  const handleEditTransaction = (transaction) => {
    navigate(`/Transactions/edit/${transaction.id}`);
  };

  const handleDeleteTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDelTransModal(true);
  };

  const handleModalClose = () => {
    setShowDelTransModal(false);
    fetchTransactions();
  };

  return (
    <div>
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={8}>
          {<h1> Transactions</h1>}
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

      <DateRangePicker
        value={[selectedDateRange.startDate, selectedDateRange.endDate]}
        onChange={(value) => handleRangeChange(value)}
        defaultValue={[subMonths(new Date(), 1), new Date()]}
      />

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
          <Cell dataKey="source[name]" />
        </Column>
        <Column width={150} align="center" resizable sortable>
          <HeaderCell>Category</HeaderCell>
          <Cell dataKey="category[name]" />
        </Column>
        <Column width={200} align="center" resizable sortable>
          <HeaderCell>Description</HeaderCell>
          <Cell dataKey="description" />
        </Column>
        <Column width={150} fixed="right" align="center" resizable>
          <HeaderCell>Edit/Delete</HeaderCell>
          <Cell>
            {(rowData) => (
              <ButtonToolbar>
                <IconButton
                  icon={<EditIcon />}
                  size="xs"
                  appearance="ghost"
                  color="blue"
                  onClick={() => handleEditTransaction(rowData)}
                />
                <IconButton
                  icon={<ReloadIcon />}
                  size="xs"
                  appearance="ghost"
                  color="green"
                  onClick={() => handleAddRefund(rowData)}
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
      <DeleteTransactionModal
        showModal={showDelTransModal}
        transaction={selectedTransaction}
        onClose={() => handleModalClose()}
      />
    </div>
  );
};

export default Transactions;
