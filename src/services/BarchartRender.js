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

    const groupedData = new Map();

    data.forEach(row => {
      const timestamp = new Date(row[xTimeSeries]);
      let key;

      switch (timeGrouping) {
        case 'day':
          key = timestamp.toISOString().slice(0, 10);
          break;
        case 'month':
          key = `${timestamp.getUTCFullYear()}-${timestamp.getUTCMonth() + 1}`;
          break;
        case 'year':
          key = `${timestamp.getUTCFullYear()}`;
          break;
        default:
          key = timestamp.toISOString().slice(0, 10);
          break;
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, []);
      }
      groupedData.get(key).push(row);
    });

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
