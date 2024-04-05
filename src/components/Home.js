import React from 'react';

const Home = () => {
  return (
    <div className="Home-container">
      <h1 className="Home-heading">User Guide</h1>

      <div className="Home-columns">
        <div className="Home-column">
          <h2>Upload your Data</h2>
          <p className="Home-content">
          Upload your data to the application. Currently supported formats are:
          <li>CSV</li>
          <li>JSON</li>
          <li>XML</li>
          </p>
        </div>

        <div className="Home-column">
          <h2>Clean your Data</h2>
          <p className="Home-content">
          Clean your data for more accurate analysis by improving data quality. This application can:
<li>Check for null values.</li>
<li>Check for outliers in values.</li>
<li>Remove rows with undesirable entries.</li>
<li>Replace the undesirable entries with calculated averages.</li>
          </p>
        </div>

        <div className="Home-column">
          <h2>Visualise your Data</h2>
          <p className="Home-content">
          The application allows you to create visualisations to better understand the data and receive useful insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
