import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const BarchartRender = ({ dataValues, yHeading, xTimeSeries }) => {
  const [error, setError] = useState(null);
  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);

  useEffect(() => {
    const generateChartData = () => {
      try {
        if (Array.isArray(dataValues)) {
          const xValues = dataValues.map(row => row[xTimeSeries]);
          const yValues = dataValues.map(row => row[yHeading]);
          setXData(xValues);
          setYData(yValues);
        } else {
          throw new Error('Data values are not in the expected format');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    generateChartData();

  }, [dataValues, yHeading, xTimeSeries]);

  if (error) {
    return <p>Error generating chart data: {error}</p>;
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
