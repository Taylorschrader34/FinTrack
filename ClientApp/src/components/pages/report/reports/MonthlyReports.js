import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DatePicker, Dropdown } from "rsuite";
import { Container, Row, Col } from "reactstrap";

const MonthlyReports = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthSelection, setMonthSelection] = useState(new Date());
  const [catSourceSelection, setCatSourceSelection] = useState("category");
  const [incomeExpenseSelection, setIncomeExpenseSelection] =
    useState("expense");

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

    const categories = {};
    filteredTransactions.forEach((transaction) => {
      const category = transaction.category.name;
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += Math.abs(transaction.amount);
    });
    const result = [];
    for (const [category, amount] of Object.entries(categories)) {
      result.push({ category, amount });
    }
    return result;
  };

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
      </div>

      <br></br>

      <Container fluid>
        <Row>
          <Col xs="12" sm="6" lg="4">
            {dataForChart && dataForChart.length > 0 ? (
              <BarChart
                width={800}
                height={400}
                data={dataForChart}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={catSourceSelection} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
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
