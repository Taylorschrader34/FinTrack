import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const PieChartComponent = ({ data, selectedMonth, selectedYear }) => {
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

  const pieData = Object.entries(summedData).map(([key, value], index) => ({
    name: key,
    value: value,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <PieChart width={400} height={400}>
      <Legend />
      <Tooltip
        formatter={(value) => `$${value}`}
        labelFormatter={(label) => `${label}`}
      />
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default PieChartComponent;
