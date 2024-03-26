import React from 'react';
import Histogram from './Histogram';
import Barchart from './Barchart';

const Visualise = () => {
  return (
    <div className="Visualise-container">
      <h1 className="Visualise-heading">Visualise Data</h1>

      <div className="Visualise-columns">
      
        <div className="Visualise-column">
          <Histogram />
        </div>
        
        <div className="Visualise-column">
          <Barchart />
        </div>
      </div>
    </div>
  );
};

export default Visualise;
