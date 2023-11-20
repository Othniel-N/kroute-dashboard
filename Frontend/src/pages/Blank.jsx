import React, { useEffect, useState } from 'react';
import ServiceChart from '../components/serviceChart';
import PodsinEach from '../components/Noofpods';

const Blank = () => {
    return (
        <div>
            <h1>This is a blank page</h1>
            <ServiceChart />
            {/* Render other components or UI elements as needed */}
            {/* <FlexContainerd data={data} /> */}
            <PodsinEach/>

        </div>
    );
};

export default Blank;
