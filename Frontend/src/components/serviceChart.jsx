import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const BarChart = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: ['Cluster IP Count', 'Node Port Count', 'Load Balancer Count', 'Deployment Count, Replicaset Count', 'Total Nodes'],
    datasets: [{
      label: '# of Counts',
      data: [0, 0, 0], // Initial placeholder values
      borderWidth: 1,
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.0.66:4000/api/namespaces/service');
        const newData = response.data;

        const transformedData = {
          labels: Object.keys(newData[0]),
          datasets: [{
            label: '# of Counts',
            data: Object.values(newData[0]),
            borderWidth: 1,
          }]
        };

        setChartData(transformedData);
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        // maintainAspectRatio: false, // Set to false to make the chart responsive
        responsive: true, // Enable responsiveness
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Visual chart for Counts',
          },
        },
        backgroundColor: getGradient(ctx), // Use a function to generate gradient for the chart background
      }
    });

    return () => {
      myChart.destroy();
    };
  }, [chartData]);

  // Function to generate a linear gradient for the chart background
  function getGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(75,192,192,0.6)');
    gradient.addColorStop(1, 'rgba(75,192,192,0)');
    return gradient;
  }

  return (
    <div>
      <canvas id="myChart" ref={chartRef}></canvas>
      <br></br>
      <br></br>
    </div>
  );
};

export default BarChart;
