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

  const generateLineChartData = () => {
    try {
      if (!lineChartData || !Array.isArray(lineChartData.data_values) || !Array.isArray(lineChartData.headings)) {
        throw new Error('Line chart data is not in the expected format');
      }

      const { data_values, headings } = lineChartData;

      const isValidAttribute = attribute => headings.includes(attribute);

      const xData = [];
      const yData1 = [];
      const yData2 = [];

      data_values.forEach(row => {
        if (isValidAttribute(xTimeSeries) && isValidAttribute(yHeading1)) {
          xData.push(row[xTimeSeries]);
          yData1.push(row[yHeading1]);
        }

        if (yHeading2 && isValidAttribute(yHeading2)) {
          yData2.push(row[yHeading2]);
        }
      });

      return { xData, yData1, yData2 };
    } catch (error) {
      console.error('Error generating chart data:', error.message);
      return { xData: [], yData1: [], yData2: [] };
    }
  };

  const { xData, yData1, yData2 } = generateLineChartData();

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
