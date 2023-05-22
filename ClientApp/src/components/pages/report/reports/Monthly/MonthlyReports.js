import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Table, DatePicker, Dropdown } from "rsuite";
import { Container, Row, Col } from "reactstrap";
const { Column, HeaderCell, Cell } = Table;

const MonthlyReports = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthSelection, setMonthSelection] = useState(new Date());
  const [catSourceSelection, setCatSourceSelection] = useState("category");
  const [incomeExpenseSelection, setIncomeExpenseSelection] =
    useState("expense");
  const [reportType, setReportType] = useState("Table");

  const [dataForChart, setDataForChart] = useState([]);

  useEffect(() => {
    getAllTransactionsByDateRange(
      new Date(monthSelection.getFullYear(), monthSelection.getMonth(), 1),
      new Date(monthSelection.getFullYear(), monthSelection.getMonth() + 1, 1)
    );
  }, [monthSelection]);

  useEffect(() => {
    const dataByCatOrSource = groupTransactions(
      transactions,
      catSourceSelection,
      incomeExpenseSelection
    );

    setDataForChart(dataByCatOrSource);
  }, [transactions, catSourceSelection, incomeExpenseSelection]);

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

  function handleMonthSelectionChange(date) {
    setMonthSelection(date);
  }

  const handleCategorySourceChange = (value) => {
    setCatSourceSelection(value);
  };

  const handleIncomeExpenseChange = (value) => {
    setIncomeExpenseSelection(value);
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  const groupTransactions = (transactions, groupBy, filterBy) => {
    let filteredTransactions = null;
    if (filterBy === "income") {
      filteredTransactions = transactions.filter(
        (transaction) => transaction.amount > 0
      );
    } else {
      filteredTransactions = transactions.filter(
        (transaction) => transaction.amount < 0
      );
    }

    const result = [];
    if (groupBy == "category") {
      const categories = {};

      filteredTransactions.forEach((transaction) => {
        const category = transaction.category.name;
        if (!categories[category]) {
          categories[category] = 0;
        }

        let amount = Math.abs(transaction.amount);
        if (transaction.refunds?.length > 0) {
          transaction.refunds.forEach((refund) => {
            amount -= refund.amount;
          });
        }

        categories[category] += amount;
      });
      for (const [category, amount] of Object.entries(categories)) {
        result.push({ name: category, amount });
      }
    } else {
      const sources = {};

      filteredTransactions.forEach((transaction) => {
        const source = transaction.source.name;
        if (!sources[source]) {
          sources[source] = 0;
        }
        sources[source] += Math.abs(transaction.amount);
      });
      for (const [source, amount] of Object.entries(sources)) {
        result.push({ name: source, amount });
      }
    }

    return result.sort((a, b) => b.amount - a.amount);
  };

  let reportToRender;

  //TODO make these components
  switch (reportType) {
    case "Table":
      reportToRender = (
        <Table
          data={dataForChart}
          height={400}
          rowHeight={50}
          headerHeight={50}
          autoHeight
          virtualized
          bordered
        >
          <Column width={200} fixed>
            <HeaderCell>Category</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column width={200} fixed>
            <HeaderCell>Amount</HeaderCell>
            <Cell dataKey="amount" />
          </Column>
        </Table>
      );
      break;
    case "BarChart":
      reportToRender = (
        <BarChart
          width={800}
          height={400}
          data={dataForChart}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" label={{ position: "top" }} />
        </BarChart>
      );
      break;
    case "PieChart":
      reportToRender = (
        <PieChart width={400} height={400}>
          <Pie
            dataKey="amount"
            isAnimationActive={false}
            data={dataForChart}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name }) => name}
          />
          <Tooltip />
        </PieChart>
      );
      break;
    default:
      reportToRender = <>Please Select A Report</>;
      break;
  }

  return (
    <div>
      <div>
        <DatePicker
          oneTap
          format="MM-yyyy"
          cleanable={false}
          onChange={handleMonthSelectionChange}
          value={monthSelection}
        />
        <Dropdown
          value={catSourceSelection}
          onSelect={handleCategorySourceChange}
          title={catSourceSelection === "category" ? "Category" : "Source"}
        >
          <Dropdown.Item eventKey="category">Category</Dropdown.Item>
          <Dropdown.Item eventKey="source">Source</Dropdown.Item>
        </Dropdown>
        <Dropdown
          value={incomeExpenseSelection}
          onSelect={handleIncomeExpenseChange}
          title={incomeExpenseSelection === "income" ? "Income" : "Expense"}
        >
          <Dropdown.Item eventKey="income">Income</Dropdown.Item>
          <Dropdown.Item eventKey="expense">Expense</Dropdown.Item>
        </Dropdown>
        <Dropdown
          value={reportType}
          onSelect={handleReportTypeChange}
          title={reportType}
        >
          <Dropdown.Item eventKey="Table">Table</Dropdown.Item>
          <Dropdown.Item eventKey="BarChart">BarChart</Dropdown.Item>
          <Dropdown.Item eventKey="PieChart">PieChart</Dropdown.Item>
        </Dropdown>
      </div>

      <br></br>

      <Container fluid>
        <Row>
          <Col xs="12" sm="6" lg="4">
            {dataForChart && dataForChart.length > 0 ? (
              reportToRender
            ) : (
              <p>No data found for this month</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MonthlyReports;
