import React, { useState, useEffect } from "react";
import axios from "axios";
import PieChartComponent from "../charts/PieChartComponent";
import BarGraph from "../charts/BarGraph";
import TransactionsTable from "../charts/TransactionsTable";

const MonthlyReport = () => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const fakeData = [
    {
      user_id: 123,
      account_id: 456,
      date: "1/1/2023",
      category: "Food",
      amount: 50,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/3/2023",
      category: "Transportation",
      amount: 20,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/5/2023",
      category: "Shopping",
      amount: 75,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/2/2023",
      category: "Housing",
      amount: 500,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/4/2023",
      category: "Utilities",
      amount: 150,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/6/2023",
      category: "Food",
      amount: 100,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/3/2023",
      category: "Transportation",
      amount: 35,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/4/2023",
      category: "Shopping",
      amount: 50,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/6/2023",
      category: "Food",
      amount: 150,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/1/2023",
      category: "Food",
      amount: 50,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/3/2023",
      category: "Transportation",
      amount: 20,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/5/2023",
      category: "Shopping",
      amount: 75,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/2/2023",
      category: "Housing",
      amount: 500,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/4/2023",
      category: "Utilities",
      amount: 150,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/6/2023",
      category: "Food",
      amount: 100,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/3/2023",
      category: "Transportation",
      amount: 35,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/4/2023",
      category: "Shopping",
      amount: 50,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/6/2023",
      category: "Food",
      amount: 150,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "4/2/2023",
      category: "Utilities",
      amount: 100,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "4/5/2023",
      category: "Shopping",
      amount: 200,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "4/8/2023",
      category: "Housing",
      amount: 600,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "5/1/2023",
      category: "Transportation",
      amount: 50,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "5/4/2023",
      category: "Food",
      amount: 125,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "5/6/2023",
      category: "Shopping",
      amount: 75,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "6/2/2023",
      category: "Housing",
      amount: 550,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "6/4/2023",
      category: "Utilities",
      amount: 100,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "6/6/2023",
      category: "Food",
      amount: 150,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "7/3/2023",
      category: "Transportation",
      amount: 25,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "7/5/2023",
      category: "Shopping",
      amount: 100,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "7/7/2023",
      category: "Housing",
      amount: 700,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/1/2022",
      category: "Food",
      amount: 50,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/3/2022",
      category: "Transportation",
      amount: 20,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/5/2022",
      category: "Shopping",
      amount: 75,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/2/2022",
      category: "Housing",
      amount: 500,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/4/2022",
      category: "Utilities",
      amount: 150,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/6/2022",
      category: "Food",
      amount: 100,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/3/2022",
      category: "Transportation",
      amount: 35,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/4/2022",
      category: "Shopping",
      amount: 50,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/6/2022",
      category: "Food",
      amount: 150,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "4/2/2022",
      category: "Housing",
      amount: 700,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "4/4/2022",
      category: "Utilities",
      amount: 200,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "4/6/2022",
      category: "Shopping",
      amount: 100,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "5/1/2022",
      category: "Food",
      amount: 80,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "5/3/2022",
      category: "Transportation",
      amount: 50,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "5/5/2022",
      category: "Housing",
      amount: 600,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "6/2/2022",
      category: "Utilities",
      amount: 250,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "6/4/2022",
      category: "Food",
      amount: 120,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "6/6/2022",
      category: "Shopping",
      amount: 80,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "7/1/2022",
      category: "Housing",
      amount: 650,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "7/3/2022",
      category: "Transportation",
      amount: 30,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "7/5/2022",
      category: "Food",
      amount: 60,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/1/2023",
      category: "Travel",
      amount: 250,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/3/2023",
      category: "Entertainment",
      amount: 40,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "1/5/2023",
      category: "Healthcare",
      amount: 75,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/2/2023",
      category: "Education",
      amount: 800,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/4/2023",
      category: "Insurance",
      amount: 150,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "2/6/2023",
      category: "Charity",
      amount: 50,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/3/2023",
      category: "Fitness",
      amount: 35,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/4/2023",
      category: "Home Improvement",
      amount: 100,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "3/6/2023",
      category: "Personal Care",
      amount: 75,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "4/1/2023",
      category: "Investments",
      amount: 5000,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "4/3/2023",
      category: "Pets",
      amount: 45,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "4/5/2023",
      category: "Clothing",
      amount: 125,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "5/2/2023",
      category: "Gifts",
      amount: 300,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "5/4/2023",
      category: "Beauty",
      amount: 50,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "5/6/2023",
      category: "Technology",
      amount: 1000,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "6/3/2023",
      category: "Office Supplies",
      amount: 25,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "6/4/2023",
      category: "Sporting Goods",
      amount: 80,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "6/6/2023",
      category: "Jewelry",
      amount: 200,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "7/1/2023",
      category: "Books",
      amount: 75,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "7/3/2023",
      category: "Music",
      amount: 20,
    },
    {
      user_id: 123,
      account_id: 456,
      date: "7/5/2023",
      category: "Art",
      amount: 150,
    },
  ];

  const [data, setData] = useState(fakeData);
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState("2023");

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    // const result = await axios.get(`/transactions/${year}/${month}`);
    // setData(result.data);
    setData(fakeData);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  function getAvailableMonths() {
    const months = data.reduce((acc, transaction) => {
      const [month, ,] = transaction.date.split("/");
      if (!acc.includes(month)) {
        acc.push(month);
      }
      return acc;
    }, []);
    return months;
  }

  function getAvailableYears() {
    const years = data.reduce((acc, transaction) => {
      const [, , year] = transaction.date.split("/");
      if (!acc.includes(year)) {
        acc.push(year);
      }
      return acc;
    }, []);
    return years;
  }

  const renderDropdowns = () => {
    const months = getAvailableMonths();
    const years = getAvailableYears();
    return (
      <>
        <label htmlFor="month-select">Month:</label>
        <select id="month-select" value={month} onChange={handleMonthChange}>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <label htmlFor="year-select">Year:</label>
        <select id="year-select" value={year} onChange={handleYearChange}>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </>
    );
  };

  return (
    <div>
      {renderDropdowns()}
      <TransactionsTable
        data={data}
        selectedMonth={month}
        selectedYear={year}
      />
      <PieChartComponent
        data={data}
        selectedMonth={month}
        selectedYear={year}
      ></PieChartComponent>
      <BarGraph
        data={data}
        selectedMonth={month}
        selectedYear={year}
      ></BarGraph>
    </div>
  );
};

export default MonthlyReport;
