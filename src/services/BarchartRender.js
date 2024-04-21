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

  const groupDataByTime = (data, xTimeSeries, yHeading, timeGrouping) => {
    if (!Array.isArray(data) || !xTimeSeries || !yHeading) {
      return { xData: [], yData: [] };
    }

    const groupedData = new Map();

    data.forEach(row => {
      const xValue = row[xTimeSeries];
      const yValue = parseFloat(row[yHeading] || 0);

      let key;

      if (timeGrouping === 'none') {
        key = xValue || 'Unknown';
      } else {
        key = getDateKey(xValue, timeGrouping);
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, []);
      }

      groupedData.get(key).push(yValue);
    });

    let xData = [];
    let yData = [];

    groupedData.forEach((values, key) => {
      xData.push(key);

      if (timeGrouping === 'none') {
        yData.push(values.length);
      } else {
        const total = values.reduce((sum, value) => sum + value, 0);
        yData.push(total);
      }
    });

    return { xData, yData };
  };

  const getDateKey = (timestamp, timeGrouping) => {
    if (!timestamp) return 'Unknown';

    const date = new Date(timestamp);
    
    switch (timeGrouping) {
      case 'day':
        return date.toISOString().slice(0, 10);
      case 'month':
        return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
      case 'year':
        return `${date.getUTCFullYear()}`;
      default:
        return 'Unknown';
    }
  };

  const { xData, yData } = groupDataByTime(barChartData.data_values, xTimeSeries, yHeading, timeGrouping);

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
