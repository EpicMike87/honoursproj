import React from 'react';
import BarchartRender from '../services/BarchartRender';

const Barchart = ({ loadingFiles, error, uploadedFileNames, setSelectedFile, selectedColumn, generateBarChart, barChartData }) => {
  return (
    <div className="Barchart-section">
      <h2>Bar Chart</h2>
      {loadingFiles && <p>Loading uploaded files...</p>}
      {error && <p>Error: {error}</p>}
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
      {selectedColumn && (
        <div>
          <button onClick={generateBarChart}>Generate Bar Chart</button>
          {barChartData && <BarchartRender barChartData={barChartData} />}
        </div>
      )}
    </div>
  );
};

export default Barchart;
