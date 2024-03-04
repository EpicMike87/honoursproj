import React from 'react';

const Table = ({ headings, rows }) => {
  console.log('Received headings:', headings);
  console.log('Received rows:', rows);

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

export default Table;
