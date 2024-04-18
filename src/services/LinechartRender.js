import React, { useRef, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const LinechartRender = ({ lineChartData, xTimeSeries, yHeading1, yHeading2 }) => {
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

  const groupDataByTime = (data) => {
    if (!Array.isArray(data)) {
      return { xData: [], yData1: [], yData2: [] };
    }

    const xData = data.map(row => row[xTimeSeries]);
    const yData1 = data.map(row => parseFloat(row[yHeading1] || 0));
    const yData2 = yHeading2 ? data.map(row => parseFloat(row[yHeading2] || 0)) : [];

    return { xData, yData1, yData2 };
  };

  const { xData, yData1, yData2 } = groupDataByTime(lineChartData.data_values);

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
