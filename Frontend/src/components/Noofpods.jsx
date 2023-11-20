import React, { useEffect, useState } from 'react';
import FlexContainerd from '../components/Podschart';
import apiconfig from '../configs/endpointconfig';

const PodsinEach = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
      // Simulate fetching data from the backend
      const fetchData = async () => {
        try {
          const response = await fetch(apiconfig.apiUrl1); // Replace with your actual API endpoint
          const jsonData = await response.json();
  
          // Convert the received data to a format that FlexContainer can handle
          const formattedData = jsonData.map((item, index) => ({
            title: Object.keys(item)[0],
            description: `${Object.values(item)[0]} `,
            // Add more properties based on your actual data structure
          }));
  
          setData(formattedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []); // Empty dependency array ensures the effect runs only once, similar to componentDidMount
  


    return (
        <div>
            {/* Render other components or UI elements as needed */}
            <FlexContainerd data={data} />
        </div>
    );
};

export default PodsinEach;
