import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <>
    <div className = "wrapper">
    <BrowserRouter>
      <Routes>
        <Route key="home" path="/" element={<Home />} />
        <Route key="upload" path="/upload" element={<FileUpload />} />
      </Routes>
    </BrowserRouter>
    </div>
    </>
  );
}

export default App;