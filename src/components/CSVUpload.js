import React, { useState } from 'react';

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [dataName, setDataName] = useState(null);
  const [headings, setHeadings] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDataName(null);
    setHeadings(null); // Reset headings when a new file is selected
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/csv-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload data');
      }

      const result = await response.json();

      if (result && result.headings) {
        setHeadings(result.headings);
      }

      if (result && result.dataName) {
        setDataName(result.dataName);
      }
    } catch (error) {
      console.error('Error during file upload:', error.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Confirm</button>

      {dataName && (
        <div>
          <h3>Data Name: {dataName}</h3>
        </div>
      )}

      {headings && (
        <div>
          <h3>Column Headings:</h3>
          <ul>
            {headings.map((heading, index) => (
              <li key={index}>{heading}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CSVUpload;
