import React, { useState, useEffect } from 'react';
import Histogram from '../services/Histogram';

const Visualise = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileHeadings, setSelectedFileHeadings] = useState([]);

  useEffect(() => {
    console.log('Fetching uploaded files...');
    fetch('http://localhost:5000/api/get-uploaded-filenames')
      .then(response => response.json())
      .then(data => {
        console.log('Received data:', data);
        setUploadedFileNames(data.filenames);
      })
      .catch(error => console.error('Error fetching uploaded files:', error));
  }, []);

  useEffect(() => {
    if (selectedFile) {
      console.log(`Fetching headings for ${selectedFile}...`);
      fetch(`http://localhost:5000/api/get-headings?file=${selectedFile}`)
        .then(response => response.json())
        .then(data => {
          console.log('Received headings data:', data);
          setSelectedFileHeadings(data.headings);
        })
        .catch(error => console.error('Error fetching headings:', error));
    }
  }, [selectedFile]);

  return (
    <div>
      <h1>Select Data</h1>
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
          {selectedFileHeadings.length > 0 && (
            <div>
              <h3>Headings:</h3>
              <ul>
                {selectedFileHeadings.map((heading, index) => (
                  <li key={index}>{heading}</li>
                ))}
              </ul>
              <Histogram selectedFile={selectedFile} />
            </div>
          )}
        </div>
      )}

      <button>Generate Graph</button>
    </div>
  );
};

export default Visualise;
