import React, { useState, useEffect } from 'react';
import BarchartRender from '../services/BarchartRender';

const Barchart = () => {
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  useEffect(() => {
    setLoadingFiles(true);
    fetch('http://localhost:5000/api/get-uploaded-filenames')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch uploaded filenames');
        }
        return response.json();
      })
      .then(data => {
        setUploadedFileNames(data.filenames);
        setLoadingFiles(false);
      })
      .catch(error => {
        setError(error.message);
        setLoadingFiles(false);
      });
  }, []);

  const generateBarChart = async () => {
    try {
      // Your data fetching and processing logic goes here
      // Example:
      const response = await fetch('http://example.com/api/barChartData');
      if (!response.ok) {
        throw new Error('Failed to fetch bar chart data');
      }
      const data = await response.json();
      setBarChartData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="Barchart-section">
      <h2>Bar Chart</h2>
      {loadingFiles && <p>Loading uploaded files...</p>}
      {error && <p>Error: {error}</p>}
      {uploadedFileNames.length > 0 ? (
        <div>
          <p>Uploaded Files:</p>
          <ul>
            {uploadedFileNames.map((fileName, index) => (
              <li key={index} onClick={() => setSelectedFile(fileName)}>
                {fileName}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No files uploaded yet.</p>
      )}
      {selectedColumn && (
        <div>
          <button onClick={generateBarChart}>Generate Bar Chart</button>
          {barChartData && <BarchartRender barChartData={barChartData} />}
        </div>
      )}
    </div>
  );
};

export default Barchart;
