import React, { useState, useEffect } from 'react';

const CSVUpload = () => {
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
      setUploading(true);

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
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (headings) {
      console.log('Column Headings:', headings);
      console.log('Data Name:', dataName);
    }
  }, [headings, dataName]);

  return (
    <div className="Upload-container">
      <h2>Upload CSV</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        Confirm
      </button>
      {uploading && <p>Uploading...</p>}
      {dataName && (
        <div>
          <h3>Data Name: {dataName}</h3>
        </div>
      )}
      {headings && (
        <div>
          <h3>Attributes:</h3>
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
