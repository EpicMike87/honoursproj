import React, { useState, useEffect, useCallback } from 'react';

const Histogram = ({ selectedFile, selectedColumn }) => {
  const [histogramData, setHistogramData] = useState([]);

  const generateHistogram = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-histogram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selected_file: selectedFile,
          selected_column: selectedColumn,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate histogram');
      }

      const data = await response.json();
      console.log('Received histogram data:', data.histogram_data);

      setHistogramData(prevHistogramData => [...prevHistogramData, ...data.histogram_data]);
    } catch (error) {
      console.error('Error generating histogram:', error.message);
    }
  }, [selectedFile, selectedColumn]);

  useEffect(() => {
    if (selectedFile && selectedColumn) {
      generateHistogram();
    }
  }, [generateHistogram, selectedFile, selectedColumn]);

  return (
    <div>
      <h3>Histogram:</h3>
      <ul>
        {histogramData.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    </div>
  );
};

export default Histogram;
