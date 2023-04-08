import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const BarGraph = ({ data, selectedMonth, selectedYear }) => {
  const filteredData = data.filter(
    (item) =>
      item.date.split("/")[0] === selectedMonth &&
      item.date.split("/")[2] === selectedYear
  );

  const summedData = filteredData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    acc[item.category] += item.amount;
    return acc;
  }, {});

  const barData = Object.entries(summedData).map(([key, value], index) => ({
    name: key,
    value: value,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <BarChart width={800} height={400} data={barData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip formatter={(value) => `$${value}`} />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
};

export default BarGraph;
