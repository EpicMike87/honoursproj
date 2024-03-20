import React, { useState, useEffect } from 'react';
import Histogram from '../services/Histogram';

const Visualise = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedFileHeadings, setSelectedFileHeadings] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingHeadings, setLoadingHeadings] = useState(false);
  const [binSize, setBinSize] = useState(1);
  const [error, setError] = useState(null);
  const [histogramData, setHistogramData] = useState(null);

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
      fetch(`http://localhost:5000/api/get-headings?file=${selectedFile}`)
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

  const handleColumnSelect = (event) => {
    setSelectedColumn(event.target.value);
  };

  const handleBinSizeChange = (event) => {
    setBinSize(parseInt(event.target.value));
  };

  const generateHistogram = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-data-values?file=${selectedFile}&column=${selectedColumn}&binSize=${binSize}`);
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
    <div className="Visualise-container">
      <h1 className="Visualise-heading">Visualise Data</h1>

      <div className="Visualise-columns">
        <div className="Visualise-column">
          <h2>Histogram</h2>
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
              {selectedFileHeadings.length > 0 && (
                <div>
                  <h3>Headings:</h3>
                  <label>Select Column:</label>
                  <select onChange={handleColumnSelect}>
                    <option value="">Select Column</option>
                    {selectedFileHeadings.map((heading, index) => (
                      <option key={index} value={heading}>
                        {heading}
                      </option>
                    ))}
                  </select>
                  <label>Bin Size:</label>
                  <input type="number" min="1" value={binSize} onChange={handleBinSizeChange} />
                  {selectedColumn && (
                    <div>
                      <button onClick={generateHistogram}>Generate Histogram</button>
                      {histogramData && <Histogram histogramData={histogramData} column={selectedColumn} binSize={binSize} />}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="Visualise-column">
          <h2>Column 2</h2>
          <p>Some more visualisations will go here.</p>
        </div>

        <div className="Visualise-column">
          <h2>Column 3</h2>
          <p>Some more visualisations will go here.</p>
        </div>
      </div>
    </div>
  );
};

export default Visualise;
