import React from "react";
import { Link, Outlet } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="navigation-section">
      <div className="nav-buttons">
        <Link to="/" className="nav-button" id="home-button">
          Home
        </Link>
        <Link to="data" className="nav-button" id="mydata-button">
          My Data
        </Link>
        <Link to="csv" className="nav-button" id="uploadcsv-button">
          Upload CSV
        </Link>
        <Link to="json" className="nav-button" id="uploadjson-button">
          Upload JSON
        </Link>
        <Link to="xml" className="nav-button" id="uploadxml-button">
          Upload XML
        </Link>
        <Link to="clean" className="nav-button" id="cleandata-button">
          Clean Data
        </Link>
        <Link to="visualise" className="nav-button" id="visualise-button">
          Visualise
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default Navigation;
