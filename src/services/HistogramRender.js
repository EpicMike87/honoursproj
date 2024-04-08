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

      const histogramMap = new Map();
      dataValues.forEach(row => {
        const xValue = row[column];
        const binIndex = Math.floor(xValue / binSize) * binSize;
        if (histogramMap.has(binIndex)) {
          histogramMap.set(binIndex, histogramMap.get(binIndex) + 1);
        } else {
          histogramMap.set(binIndex, 1);
        }
      });

      const xData = Array.from(histogramMap.keys());
      const yData = Array.from(histogramMap.values());

      return { xData, yData };
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
            type: 'histogram',
          },
        ]}
        layout={{
          width: chartWidth,
          height: 500,
          title: 'Histogram',
        }}
      />
    </div>
  );
};

export default HistogramRender;
