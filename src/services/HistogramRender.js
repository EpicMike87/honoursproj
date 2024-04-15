import React, { useRef, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const HistogramRender = ({ histogramData, column, binSize }) => {
  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const updateChartWidth = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.clientWidth;
        const calculatedWidth = containerWidth * 0.98;
        setChartWidth(calculatedWidth);
      }
    };

    updateChartWidth();
    window.addEventListener('resize', updateChartWidth);

    return () => {
      window.removeEventListener('resize', updateChartWidth);
    };
  }, []);

  const generateHistogramData = () => {
    try {
      const dataValues = histogramData && histogramData.data_values;
      if (!Array.isArray(dataValues)) {
        throw new Error('Data values are not in the expected format');
      }
  
      const columnValues = dataValues.map(row => row[column]);
      const minValue = Math.min(...columnValues);
      const maxValue = Math.max(...columnValues);
      const numBins = Math.ceil((maxValue - minValue) / binSize);
  
      const bins = [];
      const counts = Array(numBins).fill(0);
  
      columnValues.forEach(value => {
        const binIndex = Math.floor((value - minValue) / binSize);
        counts[binIndex]++;
      });
  
      for (let i = 0; i < numBins; i++) {
        const binStart = minValue + i * binSize;
        const binEnd = binStart + binSize - 1;
        const binLabel = `${binStart}-${binEnd}`;
        bins.push(binLabel);
      }
  
      return { xData: bins, yData: counts };
    } catch (error) {
      console.error(error.message);
      return { xData: [], yData: [] };
    }
  };
  
  const { xData, yData } = generateHistogramData();

  if (!xData || !yData) {
    return <p>Error generating histogram data</p>;
  }

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }}>
      <Plot
        data={[
          {
            x: xData,
            y: yData,
            type: 'bar',
          },
        ]}
        layout={{
          width: chartWidth,
          height: 500,
          title: `Histogram of ${column}`,
          xaxis: { title: column },
          yaxis: { title: 'Frequency' },
        }}
      />
    </div>
  );
};

export default HistogramRender;
