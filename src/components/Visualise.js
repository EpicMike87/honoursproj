import React from 'react';
import Histogram from './Histogram';
import BarChart from './Barchart';
import LineChart from './Linechart';
import SortedTable from './SortedTable';

const Visualise = () => {
  return (
    <div className="Visualise-container">
      <h1 className="Visualise-heading">Visualise Data</h1>

      <div className="Visualise-columns">
      
        <div className="Visualise-column">
          <Histogram />
          <LineChart />
        </div>
        
        <div className="Visualise-column">
          <BarChart />
          <SortedTable />
        </div>
      </div>
    </div>
  );
};

export default Visualise;
