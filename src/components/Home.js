import React, { useState, useEffect } from 'react';

const Home = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);

  useEffect(() => {
    console.log('Fetching uploaded files...');
    fetch('http://localhost:5000/api/get-uploaded-filenames')
      .then(response => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data);
        setUploadedFileNames(data.filenames);
      })
      .catch(error => console.error('Error fetching uploaded filenames:', error));
  }, []);

  return (
    <div>
      <h1>List of Datasets</h1>
      {uploadedFileNames.length > 0 ? (
        <div>
          <p>Uploaded Files:</p>
          <ul>
            {uploadedFileNames.map((fileName, index) => (
              <li key={index}>{fileName}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
};

export default Home;
