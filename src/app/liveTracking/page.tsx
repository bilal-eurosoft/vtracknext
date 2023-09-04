"use client";
// livetrack.tsx
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import uniqueDataByIMEIAndLatestTimestamp from "@/utils/uniqueDataByIMEIAndLatestTimeStamp";
import { VehicleData } from "@/types/vehicle";
import { getVehicleDataByClientId } from "@/utils/API_CALLS";
import { useSession } from "next-auth/react";
import { socket } from "@/utils/socket";

const DynamicCarMap = dynamic(
  () => import("../../components/Layouts/LiveMapLayout"),
  {
    ssr: false,
  }
);




const LiveTracking = () => {
  const { data: session } = useSession();
  const [carData, setCarData] = useState<VehicleData[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFirstTimeFetchedFromGraphQL, setIsFirstTimeFetchedFromGraphQL] =
    useState(false);
  const [lastDataReceivedTimestamp, setLastDataReceivedTimestamp] = useState(
    new Date()
  );

  // This useEffect is responsible for checking internet connection in the browser.
  useEffect(() => {
    function onlineHandler() {
      setIsOnline(true);
    }

    function offlineHandler() {
      setIsOnline(false);
    }

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (session?.clientId) {
        const data = await getVehicleDataByClientId(session?.clientId);
        let currentData;
        if (data?.data?.Currentlocation?.Value) {
          currentData = JSON.parse(
            data?.data?.Currentlocation?.Value
          )?.cacheList;
          // call a filter function here to filter by IMEI and latest time stamp
          setCarData(currentData);
          setIsFirstTimeFetchedFromGraphQL(true);
        }
      }
    }
    fetchData();
  }, [session?.clientId]);

  // This useEffect is responsible for fetching data from the GraphQL Server.
  // Runs if:
  // Data is not being recieved in last 60 seconds from socket.

  const fetchTimeoutGraphQL = 60 * 1000; //60 seconds
  useEffect(() => {
    const dataFetchHandler = () => {
      // Does not run for the first time when page is loaded
      if (isFirstTimeFetchedFromGraphQL) {
        const now = new Date();
        const elapsedTimeInSeconds = Math.floor(
          (now.getTime() - lastDataReceivedTimestamp.getTime()) / 1000
        );
        if (elapsedTimeInSeconds <= fetchTimeoutGraphQL) {
          if (session?.clientId) {
            getVehicleDataByClientId(session?.clientId);
          }
        }
      }
    };
    const interval = setInterval(dataFetchHandler, fetchTimeoutGraphQL); // Runs every fetchTimeoutGraphQL seconds

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, [
    isFirstTimeFetchedFromGraphQL,
    session?.clientId,
    lastDataReceivedTimestamp,
    fetchTimeoutGraphQL,
  ]);

  // This useEffect is responsible for getting the data from socket and updating it into the state.
  useEffect(() => {
    if (isOnline && session?.clientId) {
      try {
        socket.io.opts.query = { clientId: session?.clientId };
        socket.connect();
        socket.on("message", (data: { cacheList: VehicleData[]; } | null | undefined) => {
          if (data === null || data === undefined) {
            return;
          }
          const uniqueData = uniqueDataByIMEIAndLatestTimestamp(data?.cacheList);
          setCarData(uniqueData);
          setLastDataReceivedTimestamp(new Date());
        });
      } catch (err) {
        console.log("Socket Error", err);
      }
    }

    if (!isOnline) {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [isOnline, session?.clientId]);

  return (
    <>
      <div className="grid lg:grid-cols-5  sm:grid-cols-5 md:grid-cols-5 grid-cols-1">
        <div className="lg:col-span-1 md:col-span-2 sm:col-span-4  col-span-4 bg-gray-200 h-screen overflow-y-scroll">
          <div className="grid grid-cols-2 bg-[#00B56C] py-3">
            <div className="lg:col-span-1">
              <div className="grid grid-cols-6">
                <div className="lg:col-span-1">
                  <svg
                    className="h-5 w-5 ms-1 mt-1 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <circle cx="11" cy="11" r="8" />{" "}
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>

                <div className="lg:col-span-5 col-span-5">
                  <input
                    type="text"
                    className="bg-transparent text-white w-full px-1 py-1 placeholder-gray-100 border-none outline-none"
                    placeholder="John"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1 col-span-1">
              <h1 className="text-center text-white ">Show({carData.length}) Vehicles</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 text-center bg-gray-600 py-4 text-white">
            <div className="lg:col-span-1">
              <h1>Vehicle Summary:</h1>
            </div>

            <div className="lg:col-span-1">
              <div className="grid grid-cols-10">

                <div className="lg:col-span-1">
                  <svg
                    className="h-6 w-3 text-green-500 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>

                <div className="lg:col-span-1">0</div>

                <div className="lg:col-span-1"></div>

                <div className="lg:col-span-1">
                  <svg
                    className="h-6 w-3 text-yellow-500 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>

                <div className="lg:col-span-1">0</div>
                <div className="lg:col-span-1"></div>

                <div className="lg:col-span-1">
                  <svg
                    className="h-6 w-3 text-red-500 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>

                <div className="lg:col-span-1">1</div>
              </div>
            </div>
          </div>
          {carData.map((item: VehicleData) => {
            return (
              <div
                key={item?.IMEI}
                className="grid lg:grid-cols-3 grid-cols-3 text-center py-5 mt-2 bg-white border-b-2 border-[#00B56C]"
              >
                <div className="lg:col-span-1 col-span-1">
                  <p>
                    <b className="text-[#CF000F] ">{item?.vehicleNo}</b>
                  </p>
                </div>

                <div className="lg:col-span-1 col-span-1">
                  {item.gps.speed === 0 && item.ignition === 0 ? (
                    <>
                      <button className="text-white bg-red-500 p-1 -mt-1">Parked</button>


                    </>
                  ) : item.gps.speed > 0 && item.ignition === 1 ? (
                    <button className="text-white bg-green-500 p-1 -mt-1">Moving</button>
                  ) : (
                    <button className="text-white bg-yellow-500 p-1 -mt-1">Pause</button>
                  )}
                </div>

                <div className="lg:col-span-1 col-span-1">
                  <div className="grid grid-cols-4">
                    <div className="lg:col-span-2 col-span-2">{item.gps.speed}</div>
                    {item.gps.speed === 0 && item.ignition === 0 ? (
                      <div className="lg:col-span-1">
                        <svg
                          className="h-6 w-3 text-red-500 mr-2"
                          viewBox="0 0 24 24"
                          fill="red"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                    ) : item.gps.speed > 0 && item.ignition === 1 ? (
                      <div className="lg:col-span-1">
                        <svg
                          className="h-6 w-3 text-green-500 mr-2"
                          viewBox="0 0 24 24"
                          fill="green"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                    ) : <div className="lg:col-span-1">
                      <svg
                        className="h-6 w-3 text-yellow-500 mr-2"
                        viewBox="0 0 24 24"
                        fill="yellow"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    }

                  </div>
                </div>
                <p className="w-72 mt-10  text-start  px-4 text-gray-500">{item.timestamp}</p>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-4  md:col-span-3  sm:col-span-5 col-span-4 ">
          {carData.length !== 0 && <DynamicCarMap carData={carData} />}
        </div>
      </div>
    </>
  );
};

export default LiveTracking;


