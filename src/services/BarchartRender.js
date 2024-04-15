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

  const groupDataByAttribute = (data, attribute) => {
    if (!Array.isArray(data)) {
      return { xData: [], yData: [] };
    }

    const groupedData = new Map();

    data.forEach(row => {
      const valueForAttribute = row[attribute];

      if (!groupedData.has(valueForAttribute)) {
        groupedData.set(valueForAttribute, 0);
      }

      groupedData.set(valueForAttribute, groupedData.get(valueForAttribute) + 1);
    });

    const xData = Array.from(groupedData.keys());
    const yData = Array.from(groupedData.values());

    return { xData, yData };
  };

  const groupDataByTime = (data, timeGrouping, xTimeSeries) => {
    if (!Array.isArray(data)) {
      return { xData: [], yData: [] };
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
        groupedData.set(key, 0);
      }

      groupedData.set(key, groupedData.get(key) + 1);
    });

    const xData = Array.from(groupedData.keys());
    const yData = Array.from(groupedData.values());

    return { xData, yData };
  };

  const { xData, yData } =
    timeGrouping === 'none'
      ? groupDataByAttribute(barChartData.data_values, xTimeSeries || yHeading)
      : groupDataByTime(barChartData.data_values, timeGrouping, xTimeSeries);

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
