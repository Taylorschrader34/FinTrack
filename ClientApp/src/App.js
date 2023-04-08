import React from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/pages/Layout";
import Home from "./components/pages/Home";
import { FetchData } from "./components/pages/FetchData";
import { Counter } from "./components/pages/Counter";
import NoPage from "./components/pages/NoPage";
import Reports from "./components/pages/report/Reports";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="Counter" element={<Counter />} />
        <Route path="Fetch-Data" element={<FetchData />} />
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
