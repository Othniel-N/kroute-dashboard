import React, { useEffect, useState } from 'react';
import './flexContainer.css';
import axios from 'axios';
import BarChart from '../components/serviceChart';
import PodsinEach from '../components/Noofpods';
import apiconfig from '../configs/endpointconfig';

const FlexContainer = () => {

    const [data, setData] = useState([]);
    const [pending, setPending] = useState([]);
    const [namespace, setNamespace] = useState([]);



    useEffect(() => {
        // Define the URL of your backend API

        // Fetch data using Axios
        axios.get(apiconfig.apiUrl7)
            .then(response => {
                // Update the state with the fetched data
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        // Define the URL of your backend API

        // Fetch data using Axios
        axios.get(apiconfig.apiUrl8)
            .then(response => {
                // Update the state with the fetched data
                setPending(response.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        // Define the URL of your backend API

        // Fetch data using Axios
        axios.get(apiconfig.apiUrl9)
            .then(response => {
                // Update the state with the fetched data
                setNamespace(response.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    ;

    const text = "Total Running Pods in Your cluster ";
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let index = 0;

        const intervalId = setInterval(() => {
            setDisplayText(text.substring(0, index));
            index++;

            if (index > text.length) {
                clearInterval(intervalId);
            }
        }, 100); // Adjust the interval for the typing speed

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [text]);

    const textpending = "See pending section for details ";
    const [displayTextpen, setDisplayTextpen] = useState('');

    useEffect(() => {
        let index = 0;

        const intervalId = setInterval(() => {
            setDisplayTextpen(textpending.substring(0, index));
            index++;

            if (index > textpending.length) {
                clearInterval(intervalId);
            }
        }, 100); // Adjust the interval for the typing speed

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [textpending]);

    const totalnmaespace = "Total Namespaces in your cluster";
    const [totalnamespace, setTotalnamespace] = useState('');

    useEffect(() => {
        let index = 0;

        const intervalId = setInterval(() => {
            setTotalnamespace(totalnmaespace.substring(0, index));
            index++;

            if (index > totalnmaespace.length) {
                clearInterval(intervalId);
            }
        }, 100); // Adjust the interval for the typing speed

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [totalnmaespace]);

    return (
        <div>
            <div className="flex-container">
                <div className="flex-box1">
                    <div className='pendingpods'>
                        <h3>Total Pods</h3>
                        <h4 className="h4circle">
                            {data.map((data, index) => (
                                <div key={index} className="summary-box__info__value">
                                    <div className="blinking-text">{data.totalcount}</div>                                </div>
                            ))}
                        </h4>
                    </div>
                    <div className='pp'>
                        <p>{displayText}</p>
                    </div>
                </div>
                <div className="flex-box2">
                    <div className='pendingpods'>
                        <h3>Pending Pods</h3>
                        <h4 className="h4circle">
                            {pending.map((pending, index) => (
                                <div key={index} className="summary-box__info__value">
                                    <div className="blinking-text">{pending.totalcount}</div>
                                </div>
                            ))}
                        </h4>
                    </div>
                    <div className='pp'>
                        <p>{displayTextpen}</p>
                    </div>
                </div>
                <div className="flex-box3">
                    <div className='pendingpods'>
                        <h3>Total Namespaces</h3>
                        <h4 className="h4circle">
                            {namespace.map((namespace, index) => (
                                <div key={index} className="summary-box__info__value">
                                    <div className="blinking-text">{namespace.totalcount}</div>
                                </div>
                            ))}
                        </h4>
                    </div>
                    <div className='pp'>
                        <p>{totalnamespace}</p>
                    </div>
                </div>
            </div>
            <BarChart />
            <PodsinEach />
        </div>

    );
};

export default FlexContainer;

