import React from "react";
import { Link, Outlet } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="navigation-section">
      <div className="nav-buttons">
        <Link to="/" className="nav-button">
          Home
        </Link>
        <Link to="csv" className="nav-button">
          Upload CSV
        </Link>
        <Link to="json" className="nav-button">
          Upload JSON
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default Navigation;
