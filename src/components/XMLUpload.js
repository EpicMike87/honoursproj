import React, { useState } from 'react';

const XMLUpload = () => {
  const [file, setFile] = useState(null);
  const [dataName, setDataName] = useState(null);
  const [headings, setHeadings] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDataName(null);
    setHeadings(null);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
        setUploading(true);

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

      if (result && result.dataName) {
        setDataName(result.dataName);
      }

    } catch (error) {
      console.error('Error during XML file upload:', error.message);
    }
  };

  return (
    <div className="Upload-container">
      <h2>Upload XML</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        Confirm
      </button>
      {headings && (
        <div>
          <h3 id="data-name">Data Name: {dataName}</h3>
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
