import React, { useRef, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const LinechartRender = ({ lineChartData, xTimeSeries, yHeading1, yHeading2, timeGrouping }) => {
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
      return { xData: [], yData1: [], yData2: [] };
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

    const yData1 = [...groupedData.values()].map(group => {
      const total = group.reduce((sum, row) => sum + parseFloat(row[yHeading1] || 0), 0);
      return total;
    });

    const yData2 = yHeading2
      ? [...groupedData.values()].map(group => {
          const total = group.reduce((sum, row) => sum + parseFloat(row[yHeading2] || 0), 0);
          return total;
        })
      : [];

    return { xData, yData1, yData2 };
  };

  const { xData, yData1, yData2 } = groupDataByTime(lineChartData.data_values, timeGrouping);

  if (!xData.length || !yData1.length) {
    return <p>Error generating line chart data</p>;
  }

  const plotData = [
    {
      x: xData,
      y: yData1,
      type: 'scatter',
      mode: 'lines+markers',
      name: yHeading1,
    },
  ];

  if (yData2.length > 0) {
    plotData.push({
      x: xData,
      y: yData2,
      type: 'scatter',
      mode: 'lines+markers',
      name: yHeading2 || 'Y2 Data',
    });
  }

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }}>
      <Plot
        data={plotData}
        layout={{
          width: chartWidth,
          height: 500,
          xaxis: {
            type: 'category',
            title: xTimeSeries,
          },
          yaxis: {
            title: 'Value',
          },
          legend: {
            orientation: 'h',
            y: -0.2,
          },
        }}
      />
    </div>
  );
};

export default LinechartRender;
