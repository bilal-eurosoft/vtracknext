import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicCarMap = dynamic(() => import('./carMapLayout'), {
    ssr: false,
});
const DynamicCarMapaPI = dynamic(() => import('../../app/liveTracking/page'), {
    ssr: false,
});


async function fetchCarData() {
    try {
        const response = await fetch("https://live.vtracksolutions.com/graphql", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": "https://vtracksolutions.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"query\":\"\\n          query {\\n            Currentlocation(id:\\\"626ab783687a74efc44b28fc\\\"){\\n            id,\\n            Value\\n          }\\n        }\"}",
            "method": "POST"
        }); // Replace 'API_URL_HERE' with your actual API endpoint.
        if (!response.ok) {
            throw new Error('Failed to fetch data from the API');
        }
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


const CarPage = () => {
    const [carData, setCarData] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const data = await fetchCarData();
            let currentData;
            if (data?.data?.Currentlocation?.Value) {
                currentData = JSON.parse(data?.data?.Currentlocation?.Value)?.cacheList
                console.log('currentData', currentData, typeof currentData)
                setCarData(currentData);

            }
        }
        fetchData();
    }, []);
    console.log(carData, 'carData')


    return (
        <div>
            <h1>Car Details</h1>
            {carData.length !== 0 && <DynamicCarMap carData={carData} />}

            {carData.length !== 0 && <DynamicCarMapaPI carData={carData} />}
        </div>
    );
};

export default CarPage;