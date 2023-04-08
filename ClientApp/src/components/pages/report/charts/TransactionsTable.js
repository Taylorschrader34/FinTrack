import React from "react";

function TransactionsTable({ data, selectedMonth, selectedYear }) {
  // Filter the data by selectedMonth and selectedYear
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

  const tableData = Object.entries(summedData).map(([key, value], index) => ({
    id: index,
    name: key,
    value: value,
  }));

  // Create an array of table rows from the filtered data
  const tableRows = tableData.map((transaction) => (
    <tr key={transaction.id}>
      <td>{transaction.name}</td>
      <td>${transaction.value}</td>
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );
}

export default TransactionsTable;
