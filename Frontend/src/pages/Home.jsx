import React, { useEffect, useState } from 'react'
import { data } from '../constants';
import Axios from 'axios'

const Home = () => {

    const [data, setData] = useState([])

    const getData = async () => {
        const response = await Axios.get("http://192.168.0.66:4000/api/namespaces/")
        setData(response.data);
    }

    useEffect (() => {
      getData()
    },[]);

    return (
        // <div>{data}</div>
        <div>
        {data.map((item, index) => (
                <div key={index}>
                    <p>Name: {item.Name}</p>
                    <p>IP: {item.IP[0].ip}</p>
                    <p>Port: {item.Port[0].port}</p>
                </div>
            ))}
        </div>
    )
}

export default Home


