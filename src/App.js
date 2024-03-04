import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Navigation from "./components/Navigation";
import CSVUpload from "./components/CSVUpload";
import JSONUpload from "./components/JSONUpload";
import Visualise from "./components/Visualise";
import Placeholder from "./components/Placeholder";
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
              <Route path="/xml" element={<Placeholder />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/clean" element={<Placeholder />} />
              <Route path="/visualise" element={<Visualise />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
