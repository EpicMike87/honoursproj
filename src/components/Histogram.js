import React from 'react';
import HistogramRender from '../services/HistogramRender';

const Histogram = ({ loadingFiles, error, uploadedFileNames, selectedFile, setSelectedFile, loadingHeadings, selectedFileHeadings, handleColumnSelect, handleBinSizeChange, generateHistogram, histogramData, selectedColumn, binSize }) => {
  return (
        <div className="Histogram-section">
          <h2>Histogram</h2>
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

          {selectedFile && (
            <div>
              <h2>Selected File: {selectedFile}</h2>
              {loadingHeadings && <p>Loading headings...</p>}
              {selectedFileHeadings && selectedFileHeadings.length > 0 && (
                <div>
                  <h3>Headings:</h3>
                  <label>Select Column:</label>
                  <select onChange={handleColumnSelect}>
                    <option value="">Select Column</option>
                    {selectedFileHeadings.map((heading, index) => (
                      <option key={index} value={heading}>
                        {heading}
                      </option>
                    ))}
                  </select>
                  <label>Bin Size:</label>
                  <input type="number" min="1" value={binSize} onChange={handleBinSizeChange} />
                  {selectedColumn && (
                    <div>
                      <button onClick={generateHistogram}>Generate Histogram</button>
                      {histogramData && <HistogramRender histogramData={histogramData} column={selectedColumn} binSize={binSize} />}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
  );
};

export default Histogram;
