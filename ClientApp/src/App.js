import React from "react";
import { Routes, Route } from "react-router";

import "./App.css";

import Layout from "./components/pages/Layout";
import Home from "./components/pages/Home";
import NoPage from "./components/pages/NoPage";
import Reports from "./components/pages/report/Reports";
import Transactions from "./components/pages/Transactions";
import EditTransaction from "./components/forms/Transactions/EditTransaction";
import AddTransaction from "./components/forms/Transactions/AddTransaction";
import AddRefund from "./components/forms/Refunds/AddRefund";
import EditRefund from "./components/forms/Refunds/EditRefund";
import BulkImport from "./components/pages/BulkImport";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="Reports/Monthly"
          element={<Reports reportType={"monthly"} />}
        />
        <Route
          path="Reports/Yearly"
          element={<Reports reportType={"yearly"} />}
        />
        <Route path="Reports" element={<Reports />} />
        <Route path="Transactions" element={<Transactions />} />
        <Route path="Transactions/Add" element={<AddTransaction />} />
        <Route path="Transactions/Edit/:id" element={<EditTransaction />} />
        <Route path="Refunds/Add/:id" element={<AddRefund />} />
        <Route path="Refunds/Edit/:id" element={<EditRefund />} />
        <Route path="BulkImport" element={<BulkImport />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
