import React, { useState, useEffect } from 'react';
import { SortedTableCSV, SortedTableJSON, SortedTableXML } from '../services/SortedTableRender';

const SortedTable = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [dataValues, setDataValues] = useState(null);
  const [headings, setHeadings] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching uploaded files...');
    fetch('http://localhost:5000/api/get-uploaded-filenames')
      .then(response => response.json())
      .then(data => {
        console.log('Received data:', data);
        setUploadedFileNames(data.filenames);
      })
      .catch(error => console.error('Error fetching uploaded filenames:', error));
  }, []);

  useEffect(() => {
    if (selectedFileName) {
      console.log(`Fetching data values for file: ${selectedFileName}`);
      const fileType = selectedFileName.split('.').pop().toLowerCase();
      setLoading(true);
      let apiUrl;

      if (fileType === 'csv') {
        apiUrl = `http://localhost:5000/api/get-csv-data-values?file=${selectedFileName}`;
      } else if (fileType === 'json') {
        apiUrl = `http://localhost:5000/api/get-json-data-values?file=${selectedFileName}`;
      } else if (fileType === 'xml') {
        apiUrl = `http://localhost:5000/api/get-xml-data-values?file=${selectedFileName}`;
      }

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch data values');
          }
          return response.json();
        })
        .then(data => {
          console.log('Received data values:', data);
          setDataValues(data.data_values);
          setHeadings(data.headings || Object.keys(data.data_values[0]));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data values:', error);
          setError('Error fetching data values');
          setLoading(false);
        });
    }
  }, [selectedFileName]);

  return (
    <div className="SortedTable-container">
      <h2>Sorted Table</h2>
      {loading && <p>Loading data...</p>}
      {error && <p>Error: {error}</p>}
      {uploadedFileNames.length > 0 ? (
        <div>
          <p>Uploaded Files:</p>
          <ul>
            {uploadedFileNames.map((fileName, index) => (
              <li key={index}>
                <button
                className='Visualise-filename'
                id={`button-${fileName}`}
                onClick={() => setSelectedFileName(fileName)}>{fileName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No files uploaded yet.</p>
      )}
      {selectedFileName && (
        <div>
          <h2>Selected File: {selectedFileName}</h2>
          {dataValues && headings && (
            <>
              {selectedFileName.endsWith('.csv') && (
                <SortedTableCSV headings={headings} rows={dataValues} sortConfig={sortConfig} onSort={setSortConfig} />
              )}
              {selectedFileName.endsWith('.json') && (
                <SortedTableJSON dataValues={dataValues} sortConfig={sortConfig} onSort={setSortConfig} />
              )}
              {selectedFileName.endsWith('.xml') && (
                <SortedTableXML dataValues={dataValues} sortConfig={sortConfig} onSort={setSortConfig} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SortedTable;
