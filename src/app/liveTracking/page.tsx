'use client'

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicCarMap = dynamic(() => import('../../components/Layouts/CarmapLayout'), {
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
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data from the API');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log('Error fetching data');
    return [];
  }
}


const LiveTracking = () => {
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


  return (
    <>

      <div className="grid lg:grid-cols-5  sm:grid-cols-5 md:grid-cols-5 grid-cols-1">

        <div className="lg:col-span-1 md:col-span-2 sm:col-span-4   col-span-4 bg-gray-200">

          <div className="grid grid-cols-2 bg-[#00B56C] py-3">
            <div className="lg:col-span-1">
              <div className="grid grid-cols-6">

                <div className="lg:col-span-1">
                  <svg className="h-5 w-5 ms-1 mt-1 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">  <circle cx="11" cy="11" r="8" />  <line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </div>

                <div className="lg:col-span-5 col-span-5">
                  <input type="text" className="bg-transparent text-white w-full px-1 py-1 placeholder-gray-100 border-none outline-none" placeholder="John" required />
                </div>

              </div>

            </div>
            <div className="lg:col-span-1 col-span-1">
              <h1 className="text-center text-white ms-8">Show(1) Vehicles</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 text-center bg-gray-600 py-4 text-white">

            <div className="lg:col-span-1">
              <h1>Vehicle Summary:</h1>
            </div>

            <div className="lg:col-span-1">
              <div className="grid grid-cols-10">
                <div className="lg:col-span-1">
                  <svg className="h-6 w-3 text-green-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" /></svg>
                </div>

                <div className="lg:col-span-1">
                  0
                </div>


                <div className="lg:col-span-1"></div>

                <div className="lg:col-span-1">
                  <svg className="h-6 w-3 text-yellow-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" /></svg>
                </div>

                <div className="lg:col-span-1">
                  0
                </div>
                <div className="lg:col-span-1"></div>

                <div className="lg:col-span-1">
                  <svg className="h-6 w-3 text-red-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" /></svg>
                </div>

                <div className="lg:col-span-1">
                  1
                </div>
              </div>
            </div>

          </div>
{carData.map((item) => (


          <div className="grid lg:grid-cols-3 grid-cols-3 text-center py-5 mt-2 bg-white border-b-2 border-[#00B56C]">

            <div className="lg:col-span-1 col-span-1">
              <p ><b className="text-[#CF000F] ">{"abu-878"}</b></p>
            </div>

            <div className="lg:col-span-1 col-span-1">
              <button className="text-white bg-green-500 p-1 -mt-1">Parked</button>

            </div>

            <div className="lg:col-span-1 col-span-1">
              <div className="grid grid-cols-4">

                <div className="lg:col-span-2 col-span-2">
                  0Kpk
                </div>

                <div className="lg:col-span-1">
                  <svg className="h-6 w-3 text-green-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" /></svg>
                </div>

              </div>
            </div>

            <div className="grid lg:grid-cols-4">
              <div className="lg:col-span-5 ">
                <p className="w-full mt-10">August 24 2</p>
              </div>
            </div>

          </div>
))}
        </div>

        <div className="lg:col-span-4  md:col-span-3  sm:col-span-5 col-span-4 ... bg-red-500">
          {carData.length !== 0 && <DynamicCarMap carData={carData} />}
        </div>

      </div>

    </>
  );
};

export default LiveTracking;

