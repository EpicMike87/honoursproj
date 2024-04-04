import React, { useState, useEffect } from 'react';
import { TableCSV, TableJSON, TableXML } from '../services/TableRender';

const DataPage = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [dataValues, setDataValues] = useState(null);
  const [headings, setHeadings] = useState(null);

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

  const handleFileNameClick = (fileName) => {
    console.log(`File name clicked: ${fileName}`);
    setSelectedFileName(fileName);
  };

  const handleDeleteFile = async (fileName) => {
    try {
      const response = await fetch('http://localhost:5000/api/delete-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: fileName }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      // Remove the deleted file from the uploadedFileNames state
      setUploadedFileNames(prevFiles => prevFiles.filter(file => file !== fileName));
    } catch (error) {
      console.error('Error deleting file:', error.message);
    }
  };

  useEffect(() => {
    if (selectedFileName) {
      console.log(`Fetching data values for file: ${selectedFileName}`);
      const fileType = selectedFileName.split('.').pop().toLowerCase();
      let apiUrl;
      
      if (fileType === 'csv') {
        apiUrl = `http://localhost:5000/api/get-csv-data-values?file=${selectedFileName}`;
      } else if (fileType === 'json') {
        apiUrl = `http://localhost:5000/api/get-json-data-values?file=${selectedFileName}`;
      } else if (fileType === 'xml') {
        apiUrl = `http://localhost:5000/api/get-xml-data-values?file=${selectedFileName}`;
      }

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          console.log('Received data values:', data);
          setDataValues(data.data_values);
          setHeadings(data.headings || Object.keys(data.data_values[0]));
        })
        .catch(error => console.error('Error fetching data values:', error));
    }
  }, [selectedFileName]);

  return (
    <div className="Data-container">
      <div className="Data-left-column">
        <h1>List of Datasets</h1>
        {uploadedFileNames.length > 0 ? (
          <div>
            <p>Uploaded Files:</p>
            <ul>
              {uploadedFileNames.map((fileName, index) => (
                <li key={index}>
                  <button
                    className="File-name-button"
                    onClick={() => handleFileNameClick(fileName)}
                  >
                    {fileName}
                  </button>
                  <button className="Delete-button" onClick={() => handleDeleteFile(fileName)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>

      <div className="Data-right-column">
        {selectedFileName ? (
          <>
            <h2>{selectedFileName}</h2>
            {dataValues ? (
              <>
                {selectedFileName.endsWith('.csv') && <TableCSV headings={headings} rows={dataValues} />}
                {selectedFileName.endsWith('.json') && <TableJSON dataValues={dataValues} />}
                {selectedFileName.endsWith('.xml') && <TableXML dataValues={dataValues} />}
              </>
            ) : (
              <p>Loading data...</p>
            )}
          </>
        ) : (
          <p>Select a file to display data.</p>
        )}
      </div>
    </div>
  );
};

export default DataPage;
