import React, { useState, useEffect } from 'react';

const DataPage = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState(null);

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

  const handleButtonClick = (fileName) => {
    console.log(`Button clicked for file: ${fileName}`);
    setSelectedFileName(fileName);
  };

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
                  <button onClick={() => handleButtonClick(fileName)}>{fileName}</button>
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
            <p>The table for the selected data will go here.</p>
          </>
        ) : (
          <p>Select a file to display data.</p>
        )}
      </div>
    </div>
  );
};

export default DataPage;
