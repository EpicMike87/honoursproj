import React from 'react';
import Plot from 'react-plotly.js';

const HistogramRender = ({ histogramData, column, binSize }) => {
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

      console.log('Histogram Map:', histogramMap);

      const xData = Array.from(histogramMap.keys());
      const yData = Array.from(histogramMap.values());

      console.log('xData:', xData);
      console.log('yData:', yData);

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
    <div>
      <Plot
        data={[
          {
            x: xData,
            y: yData,
            type: 'histogram',
          },
        ]}
        layout={{ width: 600, height: 400, title: 'Histogram' }}
      />
    </div>
  );
};

export default HistogramRender;
