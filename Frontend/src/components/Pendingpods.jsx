import React, { useState, useEffect } from 'react';
import './Service.css'

const PodTable = () => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);


  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.68:4000/api/services/ppods'); // Update the URL according to your backend setup
        const result = await response.json();
        setData(result.pendingPods);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.68:4000/api/services/running-pods-not-ready'); // Update the URL according to your backend setup
        const result = await response.json();
        setData1(result.runningPodsNotReady);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="services-container">
      <h2 style={{ padding: '15px' }}>Pods which is having error with Image, Persistent volume, toleration etc..</h2>
      <table className="services-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Namespace</th>
            <th>Name</th>
            <th>Logs</th>
          </tr>
        </thead>
        <tbody>
          {data.map((pod, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{pod.namespace}</td>
              <td>{pod.podName}</td>
              <td>
                {pod.events.length > 0 ? (
                  <ul>
                    {pod.events.map((event, eventIndex) => (
                      <li key={eventIndex} style={{ color: "red" }}>
                        Reason: &nbsp;{event.Reason.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{color:"green"}}>Reason: Pending</p>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <h2 style={{ padding: '15px', marginTop: '100px' }}>Pods with Crashloopbackoff, error while creating container</h2>
      <table className="services-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Namespace</th>
            <th>Name</th>
            <th>Logs</th>
          </tr>
        </thead>
        <tbody>
          {data1.map((pod, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{pod.namespace}</td>
              <td>{pod.podName}</td>
              <td>
                <ul>
                  {pod.events.map((event, eventIndex) => (
                    <li key={eventIndex} style={{ color: "red" }}>Reason: &nbsp;{event.Reason.message}</li>
                  ))}
                  {/* {pod.events.map((event, eventIndex) => (
                    <li key={eventIndex} style={{color:"Red"}}>Reason:&nbsp;{event.Reason.reason}</li>
                  ))} */}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PodTable;
