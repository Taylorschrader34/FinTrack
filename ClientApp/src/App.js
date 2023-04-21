import React from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/pages/Layout";
import Home from "./components/pages/Home";
import NoPage from "./components/pages/NoPage";
import Reports from "./components/pages/report/Reports";

import "./App.css";

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
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
