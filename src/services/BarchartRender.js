import React, { useRef, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const BarchartRender = ({ barChartData, xTimeSeries, yHeading, timeGrouping }) => {
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

  const groupDataByTime = (data, timeGrouping) => {
    if (!Array.isArray(data)) {
      return [];
    }

    // Create a map to store grouped data
    const groupedData = new Map();

    // Group data based on the specified time grouping
    data.forEach(row => {
      const timestamp = new Date(row[xTimeSeries]);
      let key;

      switch (timeGrouping) {
        case 'day':
          key = timestamp.toISOString().slice(0, 10); // Group by date (YYYY-MM-DD)
          break;
        case 'month':
          key = `${timestamp.getUTCFullYear()}-${timestamp.getUTCMonth() + 1}`; // Group by month (YYYY-MM)
          break;
        case 'year':
          key = `${timestamp.getUTCFullYear()}`; // Group by year (YYYY)
          break;
        default:
          key = timestamp.toISOString().slice(0, 10); // Default to daily grouping
          break;
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, []);
      }
      groupedData.get(key).push(row);
    });

    // Convert grouped data map to arrays of xData and yData
    const xData = [...groupedData.keys()];
    const yData = [...groupedData.values()].map(group => {
      const total = group.reduce((sum, row) => sum + parseFloat(row[yHeading] || 0), 0);
      return total;
    });

    return { xData, yData };
  };

  const { xData, yData } = groupDataByTime(barChartData.data_values, timeGrouping);

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
          xaxis: {
            type: 'category',
          },
          width: chartWidth,
          height: 500,
        }}
      />
    </div>
  );
};

export default BarchartRender;
