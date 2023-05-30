import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import FullLogo from "../../../assets/images/example.png";

export const Navigation = (props) => {
  const [environment, setEnvironment] = useState(null);

  useEffect(() => {
    const fetchAppSettings = async () => {
      try {
        const response = await fetch(`/appSettings/GetAppSettings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setEnvironment(data.environment);
      } catch (error) {
        console.error("Error fetching app settings:", error);
      }
    };

    fetchAppSettings();
  }, []);

  const buttonStyle = {
    textDecoration: "none",
  };

  return (
    <div className="header">
      <div className="container">
        <div className="logo">
          {environment}
          <Link to={"/"}>
            <img src={FullLogo} />
          </Link>
        </div>
        <div className="navigation">
          <ul>
            <li>
              <Link to="/" style={buttonStyle}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/Transactions" style={buttonStyle}>
                Transactions
              </Link>
            </li>
            <li>
              <Link to="/Reports" style={buttonStyle}>
                Reports
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

Navigation.propTypes = {};
