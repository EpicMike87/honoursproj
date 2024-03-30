import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Navigation from "./components/Navigation";
import CSVUpload from "./components/CSVUpload";
import JSONUpload from "./components/JSONUpload";
import XMLUpload from "./components/XMLUpload";
import Visualise from "./components/Visualise";
//import Placeholder from "./components/Placeholder";
import DataClean from "./components/Dataclean";
import DataPage from "./components/Datapage";

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
              <Route path="/xml" element={<XMLUpload />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/clean" element={<DataClean />} />
              <Route path="/visualise" element={<Visualise />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
