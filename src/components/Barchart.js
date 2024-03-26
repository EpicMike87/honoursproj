import React, { useState, useEffect } from 'react';
import BarchartRender from '../services/BarchartRender';

const Barchart = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedXHeading, setSelectedXHeading] = useState(null); // State for selected X-axis heading
  const [selectedYHeading, setSelectedYHeading] = useState(null); // State for selected Y-axis heading
  const [selectedFileHeadings, setSelectedFileHeadings] = useState([]);
  const [loadingHeadings, setLoadingHeadings] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [error, setError] = useState(null);
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

  const handleXHeadingSelect = event => {
    setSelectedXHeading(event.target.value);
  };

  const handleYHeadingSelect = event => {
    setSelectedYHeading(event.target.value);
  };

  const generateBarChart = async () => {
    try {
      let apiUrl;
      const fileType = selectedFile.split('.').pop().toLowerCase();

      if (fileType === 'csv') {
        apiUrl = `http://localhost:5000/api/get-csv-data-values?file=${selectedFile}&xHeading=${selectedXHeading}&yHeading=${selectedYHeading}`;
      } else if (fileType === 'json') {
        apiUrl = `http://localhost:5000/api/get-json-data-values?file=${selectedFile}&xHeading=${selectedXHeading}&yHeading=${selectedYHeading}`;
      } else if (fileType === 'xml') {
        apiUrl = `http://localhost:5000/api/get-xml-data-values?file=${selectedFile}&xHeading=${selectedXHeading}&yHeading=${selectedYHeading}`;
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
      {selectedFile && (
        <div>
          <h2>Selected File: {selectedFile}</h2>
          {loadingHeadings && <p>Loading headings...</p>}
          {selectedFileHeadings && selectedFileHeadings.length > 0 && (
            <div>
              <h3>Headings:</h3>
              <label>Select X-axis Heading:</label>
              <select onChange={handleXHeadingSelect}>
                <option value="">Select X-axis Heading</option>
                {selectedFileHeadings.map((heading, index) => (
                  <option key={index} value={heading}>
                    {heading}
                  </option>
                ))}
              </select>
              <label>Select Y-axis Heading:</label>
              <select onChange={handleYHeadingSelect}>
                <option value="">Select Y-axis Heading</option>
                {selectedFileHeadings.map((heading, index) => (
                  <option key={index} value={heading}>
                    {heading}
                  </option>
                ))}
              </select>
              {(selectedXHeading && selectedYHeading) && (
                <div>
                  <button onClick={generateBarChart}>Generate Bar Chart</button>
                  {barChartData && <BarchartRender barChartData={barChartData} />}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Barchart;
