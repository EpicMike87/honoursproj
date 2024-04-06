import React, { useState, useEffect } from 'react';
import LineChartRender from '../services/LinechartRender';

const LineChart = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedXHeading, setSelectedXHeading] = useState(null);
  const [selectedYHeading1, setSelectedYHeading1] = useState(null);
  const [selectedYHeading2, setSelectedYHeading2] = useState(null);
  const [selectedFileHeadings, setSelectedFileHeadings] = useState([]);
  const [loadingHeadings, setLoadingHeadings] = useState(false);
  const [error, setError] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(false);

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

  useEffect(() => {
    if (selectedFile) {
      setLoadingHeadings(true);
      const fileType = selectedFile.split('.').pop().toLowerCase();
      let apiUrl;
      if (fileType === 'csv') {
        apiUrl = `http://localhost:5000/api/get-csv-data-values?file=${selectedFile}`;
      } else if (fileType === 'json') {
        apiUrl = `http://localhost:5000/api/get-json-data-values?file=${selectedFile}`;
      } else if (fileType === 'xml') {
        apiUrl = `http://localhost:5000/api/get-xml-data-values?file=${selectedFile}`;
      }

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch headings');
          }
          return response.json();
        })
        .then(data => {
          setSelectedFileHeadings(data.headings);
          setLoadingHeadings(false);
        })
        .catch(error => {
          setError(error.message);
          setLoadingHeadings(false);
        });
    }
  }, [selectedFile]);

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
  };

  const handleXHeadingSelect = event => {
    setSelectedXHeading(event.target.value);
  };

  const handleYHeading1Select = event => {
    setSelectedYHeading1(event.target.value);
  };

  const handleYHeading2Select = event => {
    setSelectedYHeading2(event.target.value);
  };

  const generateLineChart = async () => {
    try {
      let apiUrl;
      const fileType = selectedFile.split('.').pop().toLowerCase();

      if (fileType === 'csv') {
        apiUrl = `http://localhost:5000/api/get-csv-data-values?file=${selectedFile}&xHeading=${selectedXHeading}&yHeading1=${selectedYHeading1}&yHeading2=${selectedYHeading2}`;
      } else if (fileType === 'json') {
        apiUrl = `http://localhost:5000/api/get-json-data-values?file=${selectedFile}&xHeading=${selectedXHeading}&yHeading1=${selectedYHeading1}&yHeading2=${selectedYHeading2}`;
      } else if (fileType === 'xml') {
        apiUrl = `http://localhost:5000/api/get-xml-data-values?file=${selectedFile}&xHeading=${selectedXHeading}&yHeading1=${selectedYHeading1}&yHeading2=${selectedYHeading2}`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to get data values');
      }
      const data = await response.json();
      setLineChartData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="LineChart-section">
      <h2>Line Chart</h2>
      {loadingFiles && <p>Loading uploaded files...</p>}
      {error && <p>Error: {error}</p>}
      {uploadedFileNames.length > 0 ? (
        <div>
          <p>Uploaded Files:</p>
          <ul>
            {uploadedFileNames.map((fileName, index) => (
              <li key={index}>
                <button className='Visualise-filename' onClick={() => handleFileSelect(fileName)}>{fileName}</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No files uploaded yet.</p>
      )}
      {selectedFile && (
        <div>
          <h2>Selected File: {selectedFile}</h2>
          {loadingHeadings && <p>Loading headings...</p>}
          {selectedFileHeadings && selectedFileHeadings.length > 0 && (
            <div>
              <h3>Select Attributes for Line Chart:</h3>
              <label> Select X-axis Attribute: </label>
              <select onChange={handleXHeadingSelect}>
                <option value="">Select X-axis Heading</option>
                {selectedFileHeadings.map((heading, index) => (
                  <option key={index} value={heading}>
                    {heading}
                  </option>
                ))}
              </select>
              <label> Select Y-axis Attribute 1: </label>
              <select onChange={handleYHeading1Select}>
                <option value="">Select Y-axis Attribute</option>
                {selectedFileHeadings.map((heading, index) => (
                  <option key={index} value={heading}>
                    {heading}
                  </option>
                ))}
              </select>
              <label>Select Y-axis Attribute 2 (optional): </label>
              <select onChange={handleYHeading2Select}>
                <option value="">Select Y-axis Attribute (optional)</option>
                {selectedFileHeadings.map((heading, index) => (
                  <option key={index} value={heading}>
                    {heading}
                  </option>
                ))}
              </select>
              {(selectedXHeading && selectedYHeading1) && (
                <div>
                  <button onClick={generateLineChart}>Generate Line Chart</button>
                  {lineChartData && (
                    <LineChartRender
                      lineChartData={lineChartData}
                      xTimeSeries={selectedXHeading}
                      yHeading1={selectedYHeading1}
                      yHeading2={selectedYHeading2}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LineChart;
