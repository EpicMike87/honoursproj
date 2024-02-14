import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Navigation from "./components/Navigation";
import CSVUpload from "./components/CSVUpload";
import JSONUpload from "./components/JSONUpload";

function App() {
  return (
    <>
      <div className="wrapper">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigation />}>
              <Route path="/" element={<Home />} />
              <Route path="/csv" element={<CSVUpload />} />
              <Route path="/json" element={<JSONUpload />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
