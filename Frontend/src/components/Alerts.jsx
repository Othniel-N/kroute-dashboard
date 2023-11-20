import React, { useState } from 'react'
import axios from 'axios'

const Alerts = () => {
  
  const [slackUrl, setSlackUrl] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleSlackUrlChange = (event) => {
    setSlackUrl(event.target.value);
  };

  const handleCheckAndNotify = async () => {
    try {
      const response = await axios.get(`http://192.168.0.66:4000/api/alerts/pendingpods?slackUrl=${slackUrl}`);
      setNotificationMessage(response.data.message);
    } catch (error) {
      console.error('Error checking and notifying:', error);
      setNotificationMessage('Error checking and notifying. Please check the console for details.');
    }
  };

  return (
    <div>
      <h1>Slack Notifier</h1>
      <div>
        <label>Slack Webhook URL:</label>
        <input type="text" value={slackUrl} onChange={handleSlackUrlChange} />
      </div>
      <div>
        <button onClick={handleCheckAndNotify}>Check and Notify</button>
      </div>
      <div>
        <p>{notificationMessage}</p>
      </div>
    </div>
  );
};

export default Alerts;