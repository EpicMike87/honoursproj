import React, { useState, useEffect } from 'react';
import HistogramRender from '../services/HistogramRender';

const Histogram = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedFileAttributes, setSelectedFileAttributes] = useState([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [binSize, setBinSize] = useState(1);
  const [error, setError] = useState(null);
  const [histogramData, setHistogramData] = useState(null);
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
      setLoadingAttributes(true);
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
            throw new Error('Failed to fetch attributes');
          }
          return response.json();
        })
        .then(data => {
          setSelectedFileAttributes(data.headings);
          setLoadingAttributes(false);
        })
        .catch(error => {
          setError(error.message);
          setLoadingAttributes(false);
        });
    }
  }, [selectedFile]);

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
  };

  const handleColumnSelect = event => {
    setSelectedColumn(event.target.value);
  };

  const handleBinSizeChange = event => {
    setBinSize(parseInt(event.target.value));
  };

  const generateHistogram = async () => {
    try {
      let apiUrl;
      const fileType = selectedFile.split('.').pop().toLowerCase();

      if (fileType === 'csv') {
        apiUrl = `http://localhost:5000/api/get-csv-data-values?file=${selectedFile}&column=${selectedColumn}&binSize=${binSize}`;
      } else if (fileType === 'json') {
        apiUrl = `http://localhost:5000/api/get-json-data-values?file=${selectedFile}&column=${selectedColumn}&binSize=${binSize}`;
      } else if (fileType === 'xml') {
        apiUrl = `http://localhost:5000/api/get-xml-data-values?file=${selectedFile}&column=${selectedColumn}&binSize=${binSize}`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to get data values');
      }
      const data = await response.json();
      setHistogramData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="Histogram-section">
      <h2>Histogram</h2>
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
                id={`histogram-button-${fileName}`}
                onClick={() => handleFileSelect(fileName)}>{fileName}
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
          <h2>Selected File for Histogram: {selectedFile}</h2>
          {loadingAttributes && <p>Loading attributes...</p>}
          {selectedFileAttributes && selectedFileAttributes.length > 0 && (
            <div>
              <h3>Select Attribute for Histogram:</h3>
              <label> Select Attribute: </label>
              <select
                id="histogram-attribute"
                onChange={handleColumnSelect}>
                <option
                value="">Select Attribute
                </option>
                {selectedFileAttributes.map((attribute, index) => (
                  <option key={index} value={attribute}>
                    {attribute}
                  </option>
                ))}
              </select>
              <label> Bin Size: </label>
              <input
              id="histogram-binsize"
              type="number"
              min="1"
              value={binSize} onChange={handleBinSizeChange}
              />
              {selectedColumn && (
                <div>
                  <button
                  class="generate-button"
                  id="generate-histogram-button"
                  onClick={generateHistogram}>Generate Histogram
                  </button>
                  <div class="render-section" id="histogram-render">
                  {histogramData && <HistogramRender histogramData={histogramData} column={selectedColumn} binSize={binSize} />}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Histogram;
