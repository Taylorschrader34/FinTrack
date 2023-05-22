import React, { useState, useEffect } from "react";
import { Col, Row, Nav, NavItem, NavLink } from "reactstrap";

import MonthlyReports from "./reports/Monthly/MonthlyReports";
import YearlyReport from "./reports/Yearly/YearlyReport";

const Reports = () => {
  const [reportType, setReportType] = useState("monthly");

  let reportToRender;

  switch (reportType) {
    case "monthly":
      reportToRender = <MonthlyReports />;
      break;
    case "yearly":
      reportToRender = <YearlyReport />;
      break;
    default:
      reportToRender = <div>Select a Report</div>;
  }

  const handleReportTypeChange = (type) => {
    setReportType(type);
  };

  return (
    <Row className="reportsContainer">
      <Col md={2} className="reportsSidenav">
        <Nav
          vertical
          className="reportsSidenav"
          style={{ backgroundColor: "black" }}
        >
          <NavItem>
            <NavLink
              onClick={() => handleReportTypeChange("monthly")}
              active={reportType === "monthly"}
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: reportType === "monthly" ? "bold" : "normal",
              }}
            >
              Monthly
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => handleReportTypeChange("yearly")}
              active={reportType === "yearly"}
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: reportType === "yearly" ? "bold" : "normal",
              }}
            >
              Yearly
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <Col md={10} className="reportsBody">
        {reportToRender}
      </Col>
    </Row>
  );
};

export default Reports;
