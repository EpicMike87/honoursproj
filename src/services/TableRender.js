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
            {Array.isArray(rows) && rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headings.map((heading, columnIndex) => (
                    <td key={columnIndex}>{row[heading]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headings.length}>
                  No data available for the selected dataset.
                </td>
              </tr>
            )}
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

    // Extract headings from the first item
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
          {dataValues.map((item, index) => (
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
  // Implementation for XML data format
};

export { TableCSV, TableJSON, TableXML };
