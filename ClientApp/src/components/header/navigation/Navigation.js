import React from "react";
import { Link } from "react-router-dom";

import FullLogo from "../../../assets/images/example.png";

export const Navigation = (props) => {
  const buttonStyle = {
    textDecoration: "none",
  };

  return (
    <div className="header">
      <div className="container">
        <div className="logo">
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
