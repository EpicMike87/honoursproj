import React, { useState } from 'react';

const SortedTableCSV = ({ headings, rows }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
    const sortedRows = rows && rows.length > 0 ? [...rows] : [];
  
    if (sortConfig.key) {
      sortedRows.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  
    const handleSort = (key) => {
      const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      setSortConfig({ key, direction });
    };
  
    return (
      <>
        {headings && headings.length > 0 ? (
          <table>
            <thead>
              <tr>
                {headings.map((heading, index) => (
                  <th key={index} onClick={() => handleSort(heading)}>
                    {heading} {sortConfig.key === heading && (
                      <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.slice(0, 25).map((row, rowIndex) => (
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

  const SortedTableJSON = ({ dataValues }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
    const sortedDataValues = dataValues && dataValues.length > 0 ? [...dataValues] : [];
  
    if (sortConfig.key) {
      sortedDataValues.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  
    const handleSort = (key) => {
      const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      setSortConfig({ key, direction });
    };
  
    const renderTable = () => {
      if (!sortedDataValues || sortedDataValues.length === 0) {
        return <p>No data available for the selected dataset.</p>;
      }
  
      const headings = Object.keys(sortedDataValues[0]);
  
      return (
        <table>
          <thead>
            <tr>
              {headings.map((heading, index) => (
                <th key={index} onClick={() => handleSort(heading)}>
                  {heading} {sortConfig.key === heading && (
                    <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedDataValues.slice(0, 25).map((item, rowIndex) => (
              <tr key={rowIndex}>
                {headings.map((heading, cellIndex) => (
                  <td key={cellIndex}>
                    {typeof item[heading] === 'object' ? renderNestedData(item[heading]) : item[heading]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
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
        {renderTable()}
      </div>
    );
  };

  const SortedTableXML = ({ dataValues }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
    const sortedDataValues = dataValues && dataValues.length > 0 ? [...dataValues] : [];
  
    if (sortConfig.key) {
      sortedDataValues.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  
    const handleSort = (key) => {
      const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      setSortConfig({ key, direction });
    };
  
    const renderTable = () => {
      if (!sortedDataValues || sortedDataValues.length === 0) {
        return <p>No data available for the selected dataset.</p>;
      }
  
      const headings = Object.keys(sortedDataValues[0]);
  
      return (
        <table>
          <thead>
            <tr>
              {headings.map((heading, index) => (
                <th key={index} onClick={() => handleSort(heading)}>
                  {heading} {sortConfig.key === heading && (
                    <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedDataValues.slice(0, 25).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headings.map((heading, cellIndex) => (
                  <td key={cellIndex}>{row[heading]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    };
  
    return (
      <div>
        {renderTable()}
      </div>
    );
  };

export { SortedTableCSV, SortedTableJSON, SortedTableXML };