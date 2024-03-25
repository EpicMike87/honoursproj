import React, { useState, useEffect } from 'react';
import Histogram from './Histogram';
import Barchart from './Barchart';

const Visualise = () => {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedFileHeadings, setSelectedFileHeadings] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingHeadings, setLoadingHeadings] = useState(false);
  const [binSize, setBinSize] = useState(1);
  const [error, setError] = useState(null);
  const [histogramData, setHistogramData] = useState(null);
  const [dataValues, setDataValues] = useState([]);
  const [barChartData, setBarChartData] = useState(null);

  useEffect(() => {
    setLoadingFiles(true);
    fetch('http://localhost:5000/api/get-uploaded-filenames')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch uploaded filenames');
        }
        return response.json();
      })
      .then(data => {
        setUploadedFileNames(data.filenames);
        setLoadingFiles(false);
      })
      .catch(error => {
        setError(error.message);
        setLoadingFiles(false);
      });
  }, []);

  useEffect(() => {
    if (selectedFile) {
      setLoadingHeadings(true);

      const fileType = selectedFile.split('.').pop().toLowerCase();
      let apiUrl;

      if (fileType === 'csv') {
        apiUrl = `http://localhost:5000/api/get-csv-data-values?file=${selectedFile}`;
      } else if (fileType === 'json') {
        apiUrl = `http://localhost:5000/api/get-json-data-values?file=${selectedFile}`;
      } else if (fileType === 'xml') {
        apiUrl = `http://localhost:5000/api/get-xml-data-values?file=${selectedFile}`;
      }

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch headings');
          }
          return response.json();
        })
        .then(data => {
          setSelectedFileHeadings(data.headings);
          setLoadingHeadings(false);
          setDataValues(data.data_values);
        })
        .catch(error => {
          setError(error.message);
          setLoadingHeadings(false);
        });
    }
  }, [selectedFile]);

  const handleColumnSelect = event => {
    setSelectedColumn(event.target.value);
  };

  const handleBinSizeChange = event => {
    setBinSize(parseInt(event.target.value));
  };

  const generateHistogram = async () => {
    try {
      let apiUrl;
      const fileType = selectedFile.split('.').pop().toLowerCase();

      if (fileType === 'csv') {
        apiUrl = `http://localhost:5000/api/get-csv-data-values?file=${selectedFile}&column=${selectedColumn}&binSize=${binSize}`;
      } else if (fileType === 'json') {
        apiUrl = `http://localhost:5000/api/get-json-data-values?file=${selectedFile}&column=${selectedColumn}&binSize=${binSize}`;
      } else if (fileType === 'xml') {
        apiUrl = `http://localhost:5000/api/get-xml-data-values?file=${selectedFile}&column=${selectedColumn}&binSize=${binSize}`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to get data values');
      }
      const data = await response.json();
      setHistogramData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const generateBarChart= async () => {
    try {
      let apiUrl;
      const fileType = selectedFile.split('.').pop().toLowerCase();
  
      if (fileType === 'csv') {
        apiUrl = `http://localhost:5000/api/get-csv-data-values?file=${selectedFile}&column=${selectedColumn}&binSize=${binSize}`;
      } else if (fileType === 'json') {
        apiUrl = `http://localhost:5000/api/get-json-data-values?file=${selectedFile}&column=${selectedColumn}&binSize=${binSize}`;
      } else if (fileType === 'xml') {
        apiUrl = `http://localhost:5000/api/get-xml-data-values?file=${selectedFile}&column=${selectedColumn}&binSize=${binSize}`;
      }
  
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to get data values');
      }
      const data = await response.json();
      setBarChartData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="Visualise-container">
      <h1 className="Visualise-heading">Visualise Data</h1>

      <div className="Visualise-columns">
      
        <div className="Visualise-column">
        <Histogram
          loadingFiles={loadingFiles}
          error={error}
          uploadedFileNames={uploadedFileNames}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          loadingHeadings={loadingHeadings}
          selectedFileHeadings={selectedFileHeadings}
          handleColumnSelect={handleColumnSelect}
          handleBinSizeChange={handleBinSizeChange}
          selectedColumn={selectedColumn}
          generateHistogram={generateHistogram}
          histogramData={histogramData}
          binSize={binSize}
        />
        </div>
        
        <div className="Visualise-column">
        <Barchart
          loadingFiles={loadingFiles}
          error={error}
          uploadedFileNames={uploadedFileNames}
          setSelectedFile={setSelectedFile}
          selectedColumn={selectedColumn}
          generateBarChart={generateBarChart}
          barChartData={barChartData}
        />
        </div>
        </div>
    </div>
  );
};

export default Visualise;
