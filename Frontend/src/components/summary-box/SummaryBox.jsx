import React, { useEffect, useState } from 'react'
import './summary-box.scss'
import Box from '../box/Box'
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { colors } from '../../constants'
import axios from 'axios';
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const SummaryBox = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
      // Define the URL of your backend API
      const apiUrl = 'http://localhost:4000/api/namespaces';
  
      // Fetch data using Axios
      axios.get(apiUrl)
        .then(response => {
          // Update the state with the fetched data
          setData(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, []);

    return (
        <Box>
            <div className='summary-box'>
                <div className="summary-box__info">
                    <div className="summary-box__info__title">
                        <div>Pending Pods</div>
                        <span>For more Details view pending section </span>
                    </div>
                    <div>
                        {/* <div className="summary-box__info__value"> */}
                        {/* {item.value} */}
                        {/* </div> */}
                        {data.map((data, index) => (
                            <div key={index} className="summary-box__info__value">
                                {data.namespace}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="summary-box__chart">
                    <CircularProgressbarWithChildren
                        value='1'
                        // {item.percent}
                        strokeWidth={10}
                        styles={buildStyles({
                            pathColor: data.percent < 50 ? colors.red : colors.purple,
                            trailColor: 'transparent',
                            strokeLinecap: 'round'
                        })}
                    >
                        <div className="summary-box__chart__value">
                            {/* {item.percent}% */}
                        </div>
                    </CircularProgressbarWithChildren>
                </div>
            </div>
        </Box>
    )
}

export default SummaryBox

export const SummaryBoxSpecial = ({ item }) => {
    const chartOptions = {
        responsive: true,
        scales: {
            xAxis: {
                display: false
            },
            yAxis: {
                display: false
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        elements: {
            point: {
                radius: 0
            }
        }
    }

    const chartData = {
        labels: item.chartData.labels,
        datasets: [
            {
                label: 'Revenue',
                data: item.chartData.data,
                borderColor: '#fff',
                tension: 0.5
            }
        ]
    }
    return (
        <Box purple fullheight>
            <div className="summary-box-special">
                <div className="summary-box-special__title">
                    {item.title}
                </div>
                <div className="summary-box-special__value">
                    {item.value}
                </div>
                <div className="summary-box-special__chart">
                    <Line options={chartOptions} data={chartData} width={`250px`} />
                </div>
            </div>
        </Box>
    )
}
