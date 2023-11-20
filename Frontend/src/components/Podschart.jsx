import React, { useState, useEffect } from 'react';

const FlexContainer = ({ data }) => {
  const [flexContainers, setFlexContainers] = useState(1);

  useEffect(() => {
    // Update the number of flex containers when data changes
    setFlexContainers(data.length || 1);
  }, [data]);

  const flexRows = [];
  for (let i = 0; i < flexContainers; i += 4) {
    const rowData = data.slice(i, i + 4);
    flexRows.push(rowData);
  }

  return (
    <div>
      <h4>No.of Pods in Each Namespaces</h4>
      {flexRows.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', background: rowIndex % 2 === 0 ? '#f0f0f0' : '#e0e0e0' }}>
          {row.map((item, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                border: '1px solid #ccc',
                margin: '8px',
                padding: '16px',
                background: 'linear-gradient(to bottom right, #972239, #db6885)',
                color: 'white',
              }}
            >
              {/* Render your data here */}
              {item && (
                <div>
                  {item.title} &nbsp; &rarr; &nbsp; <strong>{item.description}</strong>
                  {/* Add more properties based on your actual data structure */}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FlexContainer;
