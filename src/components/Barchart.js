import React, { useState, useEffect } from 'react';
import BarchartRender from '../services/BarchartRender';

const BarChart = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedXHeading, setSelectedXHeading] = useState(null);
  const [selectedYHeading, setSelectedYHeading] = useState(null);
  const [selectedFileHeadings, setSelectedFileHeadings] = useState([]);
  const [loadingHeadings, setLoadingHeadings] = useState(false);
  const [error, setError] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [timeGrouping, setTimeGrouping] = useState('day');

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

  const handleYHeadingSelect = event => {
    setSelectedYHeading(event.target.value);
  };

  const handleTimeGroupingChange = event => {
    setTimeGrouping(event.target.value);
  };

  const generateBarChart = async () => {
    try {
      let apiUrl;
      const fileType = selectedFile.split('.').pop().toLowerCase();

      if (fileType === 'csv') {
        apiUrl = `http://localhost:5000/api/get-csv-data-values?file=${selectedFile}&xHeading=${selectedXHeading}&yHeading=${selectedYHeading}&timeGrouping=${timeGrouping}`;
      } else if (fileType === 'json') {
        apiUrl = `http://localhost:5000/api/get-json-data-values?file=${selectedFile}&xHeading=${selectedXHeading}&yHeading=${selectedYHeading}&timeGrouping=${timeGrouping}`;
      } else if (fileType === 'xml') {
        apiUrl = `http://localhost:5000/api/get-xml-data-values?file=${selectedFile}&xHeading=${selectedXHeading}&yHeading=${selectedYHeading}&timeGrouping=${timeGrouping}`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to get data values');
      }
      const data = await response.json();
      setBarChartData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="BarChart-section">
      <h2>Bar Chart</h2>
      {loadingFiles && <p>Loading uploaded files...</p>}
      {error && <p>Error: {error}</p>}
      {uploadedFileNames.length > 0 ? (
        <div>
          <p>Uploaded Files:</p>
          <ul>
            {uploadedFileNames.map((fileName, index) => (
              <li key={index}>
                <button
                  className='Visualise-filename'
                  id={`barchart-button-${fileName}`}
                  onClick={() => handleFileSelect(fileName)}>
                  {fileName}
                </button>
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
          {loadingHeadings && <p>Loading attributes...</p>}
          {selectedFileHeadings && selectedFileHeadings.length > 0 && (
            <div>
              <h3>Select Attributes for Bar Chart:</h3>
              <label>Select X-axis Attribute:</label>
              <select
                id="barchart-attribute-x"
                onChange={handleXHeadingSelect}>
                <option value="">Select X-axis Attribute</option>
                {selectedFileHeadings.map((heading, index) => (
                  <option key={index} value={heading}>
                    {heading}
                  </option>
                ))}
              </select>
              <label>Select Y-axis Attribute:</label>
              <select
                id="barchart-attribute-y"
                onChange={handleYHeadingSelect}>
                <option value="">Select Y-axis Attribute</option>
                {selectedFileHeadings.map((heading, index) => (
                  <option key={index} value={heading}>
                    {heading}
                  </option>
                ))}
              </select>
              <div>
                <label>Select Time Grouping:</label>
                <select
                  id="barchart-timeseries"
                  value={timeGrouping}
                  onChange={handleTimeGroupingChange}>
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                  <option value="none">None</option>
                </select>
              </div>
              {selectedXHeading && !selectedYHeading && (
                <div>
                  <button
                    className="generate-button"
                    id="generate-barchart-button"
                    onClick={generateBarChart}>
                    Generate Bar Chart
                  </button>
                  {barChartData && (
                    <div className="render-section" id="barchart-render">
                      <BarchartRender
                        barChartData={barChartData}
                        xTimeSeries={selectedXHeading}
                        yHeading={selectedXHeading}
                        timeGrouping={timeGrouping}
                      />
                    </div>
                  )}
                </div>
              )}
              {(selectedXHeading && selectedYHeading) && (
                <div>
                  <button
                    className="generate-button"
                    id="generate-barchart-button"
                    onClick={generateBarChart}>
                    Generate Bar Chart
                  </button>
                  {barChartData && (
                    <div className="render-section" id="barchart-render">
                      <BarchartRender
                        barChartData={barChartData}
                        xTimeSeries={selectedXHeading}
                        yHeading={selectedYHeading}
                        timeGrouping={timeGrouping}
                      />
                    </div>
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

export default BarChart;
