import React, { useState } from 'react';

const XMLUpload = () => {
  const [file, setFile] = useState(null);
  const [headings, setHeadings] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/xml-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload XML file');
      }

      const result = await response.json();

      if (result && result.headings) {
        setHeadings(result.headings);
      }
    } catch (error) {
      console.error('Error during XML file upload:', error.message);
    }
  };

  return (
    <div>
      <h2>Upload XML</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Confirm</button>

      {headings && (
        <div>
          <h3>XML File Headings:</h3>
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

export default XMLUpload;
