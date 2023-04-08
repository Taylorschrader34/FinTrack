import React from "react";
import { Link } from "react-router-dom";

import "./Reports.css";
import MonthlyReport from "./reports/MonthlyReport";
import YearlyReport from "./reports/YearlyReport";

const Reports = ({ reportType }) => {
  const buttonStyle = {
    textDecoration: "none",
  };

  let reportToRender;

  switch (reportType) {
    case "monthly":
      reportToRender = <MonthlyReport />;
      break;
    case "yearly":
      reportToRender = <YearlyReport />;
      break;
    default:
      reportToRender = <div>Select a Report</div>;
  }

  return (
    <div className="reportsContainer">
      <div
        className="reportsSidenav"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Link to={"/Reports/Monthly"} style={buttonStyle}>
          Monthly
        </Link>
        <Link to={"/Reports/Yearly"} style={buttonStyle}>
          Yearly
        </Link>
      </div>
      <div className="reportsBody">{reportToRender}</div>
    </div>
  );
};

export default Reports;
