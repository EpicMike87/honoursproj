import React, { useRef, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const BarchartRender = ({ barChartData, xTimeSeries, yHeading }) => {
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
        }}
      />
    </div>
  );
};

export default BarchartRender;
