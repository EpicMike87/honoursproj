import React from "react";
import { Link, Outlet } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="navigation-section">
      <div className="nav-buttons">
        <Link to="/" className="nav-button">
          Home
        </Link>
        <Link to="data" className="nav-button">
          My Data
        </Link>
        <Link to="csv" className="nav-button">
          Upload CSV
        </Link>
        <Link to="json" className="nav-button">
          Upload JSON
        </Link>
        <Link to="xml" className="nav-button">
          Upload XML
        </Link>
        <Link to="clean" className="nav-button">
          Clean Data
        </Link>
        <Link to="visualise" className="nav-button">
          Visualise
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default Navigation;
