import React from 'react';

const TableCSV = ({ headings, rows }) => {
  return (
    <>
      {headings && headings.length > 0 ? (
        <table>
          <thead>
            <tr>
              {headings.map((heading, index) => (
                <th key={index}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(rows) && rows.slice(0, 25).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headings.map((heading, columnIndex) => (
                  <td key={columnIndex}>
                    {row[heading] !== null && row[heading] !== undefined ? row[heading] : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available for the selected dataset.</p>
      )}
    </>
  );
};

const TableJSON = ({ dataValues }) => {
  const renderTable = (dataValues) => {
    if (!Array.isArray(dataValues) || dataValues.length === 0) {
      return null;
    }
    const headings = Object.keys(dataValues[0]);

    return (
      <table>
        <thead>
          <tr>
            {headings.map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataValues.slice(0, 25).map((item, index) => (
            <tr key={index}>
              {renderRow(item, headings)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderRow = (item, headings) => {
    return headings.map((heading, index) => (
      <td key={index}>
        {typeof item[heading] === 'object' ? renderNestedData(item[heading]) : item[heading]}
      </td>
    ));
  };

  const renderNestedData = (data) => {
    if (!data || typeof data !== 'object') {
      return null;
    }

    return Object.values(data).map((value, index) => (
      <div key={index}>
        {typeof value === 'object' ? renderNestedData(value) : value}
      </div>
    ));
  };

  return (
    <div>
      {renderTable(dataValues)}
    </div>
  );
};

const TableXML = ({ dataValues }) => {
  const renderTable = (dataValues) => {
    if (!dataValues || !Array.isArray(dataValues) || dataValues.length === 0) {
      return <p>No data available for the selected dataset.</p>;
    }

    try {
      const headings = Object.keys(dataValues[0]);
      return (
        <table>
          <thead>
            <tr>
              {headings.map((heading, index) => (
                <th key={index}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataValues.slice(0, 25).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headings.map((heading, cellIndex) => (
                  <td key={cellIndex}>{row[heading]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } catch (error) {
      console.error('Error rendering XML data:', error);
      return <p>Error rendering XML data.</p>;
    }
  };

  return (
    <div>
      {renderTable(dataValues)}
    </div>
  );
};

export { TableCSV, TableJSON, TableXML };