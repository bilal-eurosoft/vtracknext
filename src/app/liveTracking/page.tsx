"use client";
// livetrack.tsx
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import uniqueDataByIMEIAndLatestTimestamp from "@/utils/uniqueDataByIMEIAndLatestTimestamp";
import { VehicleData } from "@/types/vehicle";
import {
  getClientSettingByClinetIdAndToken,
  getVehicleDataByClientId,
} from "@/utils/API_CALLS";
import { useSession } from "next-auth/react";
import { socket } from "@/utils/socket";
import countCars from "@/utils/countCars";
import LiveSidebar from "@/components/LiveTracking/LiveSidebar";

const LiveMap = dynamic(() => import("@/components/LiveTracking/LiveMap"), {
  loading: () => <p>Map Loading...</p>,
  ssr: false,
});

const LiveTracking = () => {
  const { data: session } = useSession();
  const carData = useRef<VehicleData[]>([]);
  const [clientSettings, setClientSettings] = useState<ClientSettings[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isFirstTimeFetchedFromGraphQL, setIsFirstTimeFetchedFromGraphQL] =
    useState(false);
  const [lastDataReceivedTimestamp, setLastDataReceivedTimestamp] = useState(
    new Date()
  );
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(
    null
  );

  // This useEffect is responsible for checking internet connection in the browser.
  useEffect(() => {
    setIsOnline(navigator.onLine);
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
    (async function () {
      if (session?.clientId) {
        const clientVehicleData = await getVehicleDataByClientId(
          session?.clientId
        );
        if (clientVehicleData?.data?.Currentlocation?.Value) {
          let parsedData = JSON.parse(
            clientVehicleData?.data?.Currentlocation?.Value
          )?.cacheList;
          // call a filter function here to filter by IMEI and latest time stamp
          let uniqueData = uniqueDataByIMEIAndLatestTimestamp(parsedData);
          carData.current = uniqueData;
                setIsFirstTimeFetchedFromGraphQL(true);
        }

        const clientSettingData = await getClientSettingByClinetIdAndToken({
          token: session?.accessToken,
          clientId: session?.clientId,
        });
        if (clientSettingData) {
          setClientSettings(clientSettingData);
        }
      }
    })();
  }, [session]);

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
        socket.on(
          "message",
          (data: { cacheList: VehicleData[] } | null | undefined) => {
            if (data === null || data === undefined) {
              return;
            }
            const uniqueData = uniqueDataByIMEIAndLatestTimestamp(
              data?.cacheList
            );
            carData.current = uniqueData;
            setLastDataReceivedTimestamp(new Date());
          }
        );
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

  const { countParked, countMoving, countPause } = countCars(carData?.current);

  
// scroll down fix 
  const handleWheel = (event: WheelEvent) => {
    if (event.deltaY !== 0) {
      // Scrolling, so set selectedVehicle to null
      setSelectedVehicle(null);
    }
  };

  const handleClick = () => {
    // Click event occurred, so set selectedVehicle to null
    setSelectedVehicle(null);
  };

  useEffect(() => {
    // Add event listeners when the component mounts
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('click', handleClick);

    // Remove event listeners when the component unmounts
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('click', handleClick);
    };
  }, []);




  return (
    <>
      <div className="grid lg:grid-cols-5 sm:grid-cols-5 md:grid-cols-5 grid-cols-1 overflow-y-scroll" >
        <LiveSidebar
          carData={carData.current}
          countMoving={countMoving}
          countPause={countPause}
          countParked={countParked}
          setSelectedVehicle={setSelectedVehicle}
        />

        {carData?.current?.length !== 0 && (
          <LiveMap
            carData={carData?.current}
            clientSettings={clientSettings}
            selectedVehicle={selectedVehicle}
          />
        )}
      </div>
    </>
  );
};

export default LiveTracking;
