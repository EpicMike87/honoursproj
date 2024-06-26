import React, { useState } from 'react';

const JSONUpload = () => {
  const [file, setFile] = useState(null);
  const [dataName, setDataName] = useState(null);
  const [headings, setHeadings] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDataName(null);
    setHeadings(null);
  };

  const handleUpload = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/json-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload JSON data');
      }

      const result = await response.json();

      if (result && result.headings) {
        setHeadings(result.headings);
      }

      if (result && result.dataName) {
        setDataName(result.dataName);
      }
    } catch (error) {
      console.error('Error during JSON file upload:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Upload-container">
      <h2>Upload JSON</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Confirm'}
      </button>

      {dataName && (
        <div>
          <h3 id="data-name">Data Name: {dataName}</h3>
        </div>
      )}

      {headings && (
        <div>
          <h3 id="attributes-heading">Attributes:</h3>
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

export default JSONUpload;
