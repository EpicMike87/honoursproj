import React from 'react';
import Plot from 'react-plotly.js';

const BarchartRender = ({ barChartData, xTimeSeries, yHeading }) => {
  const generateBarChartData = () => {
    try {
      const dataValues = barChartData && barChartData.data_values;

      if (!Array.isArray(dataValues)) {
        throw new Error('Data values are not in the expected format');
      }

      const xData = [];
      const yData = [];

      dataValues.forEach(row => {
        const xValue = row[xTimeSeries];
        const yValue = row[yHeading];
        xData.push(xValue);
        yData.push(yValue);
      });

      console.log('xData:', xData);
      console.log('yData:', yData);

      return { xData, yData };
    } catch (error) {
      console.error(error.message);
      return { xData: [], yData: [] };
    }
  };

  const { xData, yData } = generateBarChartData();

  if (!xData || !yData) {
    return <p>Error generating bar chart data</p>;
  }

  return (
    <div>
      <Plot
        data={[
          {
            x: xData,
            y: yData,
            type: 'bar',
          },
        ]}
        layout={{ width: 600, height: 400, title: 'Bar Chart' }}
      />
    </div>
  );
};

export default BarchartRender;
