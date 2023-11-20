import React, { useState, useEffect } from 'react';
import './Service.css'; // Import your CSS file
import apiconfig from '../configs/endpointconfig';

const ServicesList = () => {
  const [serviceData, setServiceData] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('');

  // Simulating fetching data from the backend
  useEffect(() => {
    const fetchData = async () => {
      // Replace with your actual data fetching logic
      // For now, using a mock API endpoint
      const response = await fetch(apiconfig.apiUrl4);
      const jsonData = await response.json();
      setServiceData(jsonData);
    };

    fetchData();
  }, []);

  const namespaces = [...new Set(serviceData.map((service) => service.Namespace))];

  const handleNamespaceChange = (event) => {
    setSelectedNamespace(event.target.value);
  };

  const filteredServices = selectedNamespace
    ? serviceData.filter((service) => service.Namespace === selectedNamespace)
    : serviceData;

  return (
    <div className="services-container">
      <h2 style={{padding: '5px'}}>Services</h2>

      {/* Dropdown for selecting namespace */}
      <div style={{paddingBottom: '25px'}}>
      <label>
        <select value={selectedNamespace} onChange={handleNamespaceChange} className='selectbutton'>
          <option value="" >All</option>
          {namespaces.map((namespace, index) => (
            <option key={index} value={namespace}>
              {namespace}
            </option>
          ))}
        </select>
      </label>
      </div>

      <table className="services-table">
        <thead>
          <tr>
            <th>Namespace</th>
            <th>Name</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service, index) => (
            <tr key={index}>
              <td>{service.Namespace}</td>
              <td>{service.Name}</td>
              <td>
                {service.IP?.map((ip, ipIndex) => (
                  <a
                    key={ipIndex}
                    href={`http://${ip.ip}:${service.Port[ipIndex]?.port}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color:"#138af2"}}
                  >
                    {ip.ip}:{service.Port[ipIndex]?.port}
                  </a>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default ServicesList;
