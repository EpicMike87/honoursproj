import React, { useState, useEffect } from 'react';

const DataClean = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [dataValues, setDataValues] = useState(null);
  const [missingValueCount, setMissingValueCount] = useState(0);

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
      fetch(`http://localhost:5000/api/get-csv-data-values?file=${selectedFileName}`)
        .then(response => response.json())
        .then(data => {
          console.log('Received data values:', data);
          setDataValues(data.data_values);
          const count = data.data_values.reduce((acc, row) => {
            Object.values(row).forEach(value => {
              if (value === 'missing') {
                acc++;
              }
            });
            return acc;
          }, 0);
          setMissingValueCount(count);
        })
        .catch(error => console.error('Error fetching data values:', error));
    }
  }, [selectedFileName]);

  const handleButtonClick = (fileName) => {
    console.log(`Button clicked for file: ${fileName}`);
    setSelectedFileName(fileName);
  };

  return (
    <div className="DataClean-container">
      <div className="DataClean-left-column">
        <h1>List of Datasets</h1>
        {uploadedFileNames.length > 0 ? (
          <div>
            <p>Uploaded Files:</p>
            <ul>
              {uploadedFileNames.map((fileName, index) => (
                <li key={index}>
                  <button onClick={() => handleButtonClick(fileName)}>{fileName}</button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>

      <div className="DataClean-right-column">
        {selectedFileName ? (
          <>
            <h2>{selectedFileName}</h2>
            {dataValues ? (
              <>
                <p>Total Missing Values: {missingValueCount}</p>
                {/* Display the data values here */}
              </>
            ) : (
              <p>Loading data...</p>
            )}
          </>
        ) : (
          <p>Select a file to check for missing values.</p>
        )}
      </div>
    </div>
  );
};

export default DataClean;
