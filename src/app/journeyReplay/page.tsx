"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
  TravelHistoryByBucketV2,
  TripsByBucketAndVehicle,
  getClientSettingByClinetIdAndToken,
  getCurrentAddress,
  getZoneListByClientId,
  vehicleListByClientId,
} from "@/utils/API_CALLS";
import { useSession } from "next-auth/react";
import { DeviceAttach } from "@/types/vehiclelistreports";
import { zonelistType } from "@/types/zoneType";
import { ClientSettings } from "@/types/clientSettings";
import { replayreport } from "@/types/IgnitionReport";
import TripsByBucket, { TravelHistoryData } from "@/types/TripsByBucket";
import L, { LatLng, LatLngTuple, map } from "leaflet";
import { Marker } from "react-leaflet/Marker";
import { Toaster, toast } from "react-hot-toast";
import { useMap } from "react-leaflet";
import {
  Tripaddressresponse,
  calculateZoomCenter,
  createMarkerIcon,
} from "@/utils/JourneyReplayFunctions";
import { StopAddressData } from "@/types/StopDetails";

const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((module) => module.Polyline),
  { ssr: false }
);
const Polygon = dynamic(
  () => import("react-leaflet/Polygon").then((module) => module.Polygon),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet/Circle").then((module) => module.Circle),
  { ssr: false }
);

export default function JourneyReplay() {
  const { data: session } = useSession();
  const [vehicleList, setVehicleList] = useState<DeviceAttach[]>([]);
  const [zoneList, setZoneList] = useState<zonelistType[]>([]);
  const [clientsetting, setClientsetting] = useState<ClientSettings[] | null>(
    null
  );
  const [dataresponse, setDataResponse] = useState<TripsByBucket[]>();
  const [TravelHistoryresponse, setTravelHistoryresponse] = useState<
    TravelHistoryData[]
  >([]);
  const [isCustomPeriod, setIsCustomPeriod] = useState(false);
  const [mapcenter, setMapcenter] = useState<LatLngTuple | null>(null);
  const [mapcenterToFly, setMapcenterToFly] = useState<LatLngTuple | null>(
    null
  );
  const [zoomToFly, setzoomToFly] = useState(10);
  const [zoom, setzoom] = useState(10);
  const [polylinedata, setPolylinedata] = useState<[number, number][]>([]);
  const [Ignitionreport, setIgnitionreport] = useState<replayreport>({
    TimeZone: session?.timezone || "",
    VehicleReg: "",
    clientId: session?.clientId || "",
    fromDateTime: "",
    period: "",
    toDateTime: "",
    unit: session?.unit || "",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [carPosition, setCarPosition] = useState<LatLng | null>(null);
  const [carMovementInterval, setCarMovementInterval] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [speedFactor, setSpeedFactor] = useState(1);
  const [showZones, setShowZones] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [TripAddressData, setTripAddressData] = useState("");
  const [stopDetails, setStopDetails] = useState<StopAddressData[]>([]);
  const [progressWidth, setProgressWidth] = useState(0);

  const SetViewOnClick = ({ coords }: { coords: any }) => {
    if (isPaused) {
      setMapcenterToFly(null);
      setzoomToFly(0);
    }

    const map = useMap();
    if (coords) {
      if (coords) {
        if (speedFactor == 2) {
          map.setView(coords, 16);
        } else if (speedFactor == 4) {
          map.setView(coords, 15);
        } else if (speedFactor == 6) {
          map.setView(coords, 14);
        } else {
          map.setView(coords, 17);
        }
      }
    }
    return null;
  };

  const SetViewfly = ({ coords, zoom }: { coords: any; zoom: number }) => {
    const map = useMap();
    if (coords) {
      map.flyTo(coords, zoom);
    }

    return null;
  };

  const tick = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setSpeedFactor(1);

    if (!carMovementInterval) {
      if (currentPositionIndex >= polylinedata.length) {
        setCurrentPositionIndex(0);
      }
    }
  };

  const stopTick = () => {
    setIsPlaying(false);
    setIsPaused(false);

    if (carMovementInterval) {
      clearInterval(carMovementInterval);
      setCarMovementInterval(undefined);
    }

    if (polylinedata.length > 0) {
      setCarPosition(new L.LatLng(polylinedata[0][0], polylinedata[0][1]));
    }
    setCurrentPositionIndex(0);
  };
  const pauseTick = async () => {
    setIsPlaying(false);
    setIsPaused(true);

    if (carMovementInterval) {
      clearInterval(carMovementInterval);
      setCarMovementInterval(undefined);
    }
    if (carPosition && session) {
      const Dataresponse = await Tripaddressresponse(
        carPosition?.lat,
        carPosition?.lng,
        session?.accessToken
      );
      setTripAddressData(Dataresponse);
    }
  };

  useEffect(() => {
    if (isPlaying && !isPaused) {
      const totalSteps = TravelHistoryresponse.length - 1;
      let step = currentPositionIndex;

      const currentData = TravelHistoryresponse[step];
      const nextData = TravelHistoryresponse[step + 1];

      if (currentData && nextData) {
        const currentLatLng = new L.LatLng(currentData.lat, currentData.lng);
        const nextLatLng = new L.LatLng(nextData.lat, nextData.lng);

        const totalObjects = TravelHistoryresponse.length;
        let numSteps;
        let stepSize: number;
        if (speedFactor == 2) {
          numSteps = 190;
          stepSize = (1 / numSteps) * speedFactor * 0.9;
        } else if (speedFactor == 4) {
          numSteps = 380;
          stepSize = (1 / numSteps) * speedFactor * 0.9;
        } else if (speedFactor == 6) {
          numSteps = 560;
          stepSize = (1 / numSteps) * speedFactor * 0.9;
        } else {
          numSteps = 100;
          stepSize = (1 / numSteps) * speedFactor * 0.9;
        }

        let progress: number = 0;
        let animationId: number;

        const updatePosition = () => {
          if (progress < 1) {
            const interpolatedLatLng = new L.LatLng(
              currentLatLng.lat +
                (nextLatLng.lat - currentLatLng.lat) * progress,
              currentLatLng.lng +
                (nextLatLng.lng - currentLatLng.lng) * progress
            );

            setMapcenter([interpolatedLatLng.lat, interpolatedLatLng.lng]);
            progress += stepSize * speedFactor;

            animationId = requestAnimationFrame(updatePosition);
            setCarPosition(interpolatedLatLng);
            const newProgress = Math.round(
              ((currentPositionIndex + 1.8) / totalObjects) * 100
            );
            setProgressWidth(newProgress);
          } else {
            step++;
            setCurrentPositionIndex(step);

            if (step < totalSteps) {
              progress = 0;
            } else {
              setIsPlaying(false);
              const { zoomlevel, centerLat, centerLng } = calculateZoomCenter(
                TravelHistoryresponse
              );

              setMapcenterToFly([centerLat, centerLng]);
              setzoomToFly(zoomlevel);
              setzoom(zoomlevel);
            }
          }
        };

        animationId = requestAnimationFrame(updatePosition);
        return () => {
          cancelAnimationFrame(animationId);
        };
      }
    } else if (isPaused) {
      pauseTick();
    } else {
      stopTick();
    }
  }, [
    isPlaying,
    currentPositionIndex,
    isPaused,
    TravelHistoryresponse,
    speedFactor,
  ]);

  useEffect(() => {
    if (polylinedata.length > 0) {
      setCarPosition(new L.LatLng(polylinedata[0][0], polylinedata[0][1]));
      setMapcenter([polylinedata[0][0], polylinedata[0][1]]);
    }
  }, [polylinedata]);

  useEffect(() => {
    const vehicleListData = async () => {
      try {
        if (session) {
          const Data = await vehicleListByClientId({
            token: session.accessToken,
            clientId: session?.clientId,
          });
          setVehicleList(Data);
        }
      } catch (error) {
        console.error("Error fetching zone data:", error);
      }
    };
    vehicleListData();
    (async function () {
      if (session) {
        const allzoneList = await getZoneListByClientId({
          token: session?.accessToken,
          clientId: session?.clientId,
        });
        setZoneList(allzoneList);
      }
    })();

    (async function () {
      if (session) {
        const clientSettingData = await getClientSettingByClinetIdAndToken({
          token: session?.accessToken,
          clientId: session?.clientId,
        });

        if (clientSettingData) {
          const centervalue = await clientSettingData?.[0].PropertyValue;

          if (centervalue) {
            const match = centervalue.match(/\{lat:([^,]+),lng:([^}]+)\}/);
            if (match) {
              const lat = parseFloat(match[1]);
              const lng = parseFloat(match[2]);

              if (!isNaN(lat) && !isNaN(lng)) {
                setMapcenter([lat, lng]);
              }
            }
          }
          setClientsetting(clientSettingData);
          const clientZoomSettings = clientsetting?.filter(
            (el) => el?.PropertDesc === "Zoom"
          )[0]?.PropertyValue;
          const zoomLevel = clientZoomSettings
            ? parseInt(clientZoomSettings)
            : 13;
          setzoom(zoomLevel);
        }
      }
    })();
  }, []);

  useEffect(() => {
    const clientZoomSettings = clientsetting?.filter(
      (el) => el?.PropertDesc === "Zoom"
    )[0]?.PropertyValue;
    const zoomLevel = clientZoomSettings ? parseInt(clientZoomSettings) : 11;
    setzoom(zoomLevel);
  }, [clientsetting]);

  let currentTime = new Date().toLocaleString("en-US", {
    timeZone: session?.timezone,
  });

  let timeOnly = currentTime.split(",")[1].trim();
  timeOnly = timeOnly.replace(/\s+[APap][Mm]\s*$/, "");

  const [hours, minutes, seconds] = timeOnly
    .split(":")
    .map((part) => part.trim());

  const formattedHours = hours.padStart(2, "0");
  const formattedMinutes = minutes.padStart(2, "0");
  const formattedSeconds = seconds.padStart(2, "0");
  const currentDate = new Date().toISOString().split("T")[0];
  const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  const parsedDateTime = new Date(currentTime);
  const formattedDateTime = `${parsedDateTime
    .toISOString()
    .slice(0, 10)}TO${timeOnly}`;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (session) {
      const { VehicleReg, period } = Ignitionreport;

      if (VehicleReg && period) {
        let newdata = {
          ...Ignitionreport,
        };
        const timestart: string = "00:00:00";
        const timeend: string = "23:59:59";

        if (isCustomPeriod) {
          newdata = {
            ...newdata,
            fromDateTime: `${Ignitionreport.fromDateTime}T${timestart}Z`,
            toDateTime: `${Ignitionreport.toDateTime}T${timeend}Z`,
          };
        } else {
          newdata = {
            ...newdata,

            fromDateTime: `${currentDate}T${timestart}Z`,
            toDateTime: `${currentDate}T${timeend}Z`,
          };
        }

        setIgnitionreport(newdata);

        try {
          const response = await toast.promise(
            TripsByBucketAndVehicle({
              token: session.accessToken,

              payload: newdata,
            }),
            {
              loading: "Loading...",
              success: "",
              error: "",
            },
            {
              style: {
                border: "1px solid #00B56C",
                padding: "16px",
                color: "#1A202C",
              },
              success: {
                duration: 10,
                iconTheme: {
                  primary: "#00B56C",
                  secondary: "#FFFAEE",
                },
              },
              error: {
                duration: 10,
                iconTheme: {
                  primary: "#00B56C",
                  secondary: "#FFFAEE",
                },
              },
            }
          );
          setDataResponse(response.data);

          if (response.success === true) {
            toast.success(`${response.message}`, {
              style: {
                border: "1px solid #00B56C",
                padding: "16px",
                color: "#1A202C",
              },
              duration: 4000,
              iconTheme: {
                primary: "#00B56C",
                secondary: "#FFFAEE",
              },
            });
          } else {
            toast.error(`${response.message}`, {
              style: {
                border: "1px solid red",
                padding: "16px",
                color: "red",
              },
              iconTheme: {
                primary: "red",
                secondary: "white",
              },
            });
          }
        } catch (error) {
          console.error(`Error calling API for ${newdata}:`, error);
        }
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setIgnitionreport((prevReport: any) => ({
      ...prevReport,
      [name]: value,
    }));

    if (name === "period" && value === "custom") {
      setIsCustomPeriod(true);
    } else if (name === "period" && value != "custom") {
      setIsCustomPeriod(false);
    }
  };

  const handleCustomDateChange = (fieldName: string, date: string) => {
    setIgnitionreport((prevReport: any) => ({
      ...prevReport,
      [fieldName]: date,
    }));
  };

  const handleDivClick = async (
    TripStart: TripsByBucket["TripStart"],
    TripEnd: TripsByBucket["TripEnd"]
  ) => {
    try {
      setIsPlaying(false);
      if (session) {
        let newresponsedata = {
          ...Ignitionreport,
          fromDateTime: `${TripStart}`,
          toDateTime: `${TripEnd}`,
        };

        const TravelHistoryresponseapi = await toast.promise(
          TravelHistoryByBucketV2({
            token: session.accessToken,

            payload: newresponsedata,
          }),
          {
            loading: "Loading...",
            success: "",
            error: "",
          },
          {
            style: {
              border: "1px solid #00B56C",
              padding: "16px",
              color: "#1A202C",
            },
            success: {
              duration: 10,
              iconTheme: {
                primary: "#00B56C",
                secondary: "#FFFAEE",
              },
            },
            error: {
              duration: 10,
              iconTheme: {
                primary: "#00B56C",
                secondary: "#FFFAEE",
              },
            },
          }
        );

        setTravelHistoryresponse(TravelHistoryresponseapi.data);
      }
    } catch (error) {
      console.error(`Error calling API for:`, error);
    }
  };

  useEffect(() => {
    if (TravelHistoryresponse && TravelHistoryresponse.length > 0) {
      setPolylinedata(
        TravelHistoryresponse.map((item: TravelHistoryData) => [
          item.lat,
          item.lng,
        ])
      );

      const { zoomlevel, centerLat, centerLng } = calculateZoomCenter(
        TravelHistoryresponse
      );
      setMapcenterToFly([centerLat, centerLng]);
      setzoomToFly(zoomlevel);
    }
  }, [TravelHistoryresponse]);

  useEffect(() => {
    (async function () {
      let unit: string;
      if (session?.unit == "Mile") {
        unit = "Mph";
      } else {
        unit = "Kph";
      }
      const stopPoints = TravelHistoryresponse.filter((x) => {
        return x.speed === `0 ${unit}`;
      });

      const stopDetailsArray: StopAddressData[] = [];

      for (const point of stopPoints) {
        const { lat, lng } = point;
        try {
          if (session) {
            const Data = await getCurrentAddress({
              token: session.accessToken,
              lat: lat,
              lon: lng,
            });

            stopDetailsArray.push(Data);
          }
        } catch (error) {
          console.error("Error fetching zone data:", error);
        }
      }

      const seen: Record<string | number, boolean> = {};

      const uniqueStopDetailsArray = stopDetailsArray.filter((item) => {
        const key = item.place_id;
        if (!seen[key]) {
          seen[key] = true;
          return true;
        }
        return false;
      });

      setStopDetails(uniqueStopDetailsArray);
    })();
  }, [TravelHistoryresponse]);

  const getSpeedAndDistance = () => {
    if (
      currentPositionIndex >= 0 &&
      currentPositionIndex < TravelHistoryresponse.length
    ) {
      const item = TravelHistoryresponse[currentPositionIndex];
      return {
        speed: item.speed,
        distanceCovered: item.distanceCovered,
      };
    }
    return null;
  };

  const getCurrentAngle = () => {
    if (
      currentPositionIndex >= 0 &&
      currentPositionIndex < TravelHistoryresponse.length
    ) {
      return TravelHistoryresponse[currentPositionIndex].angle;
    }
    return 0;
  };

  const handleZoneClick = () => {
    if (showZones == false) {
      setShowZones(true);
    } else {
      setShowZones(false);
    }
  };

  return (
    <>
      <div style={{ height: "90vh" }}>
        <p className="bg-[#00B56C] px-4 py-1 text-white">JourneyReplay</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{
              width: `${Math.round(progressWidth)}%`,
            }}
          >
            {Math.round(progressWidth)}%
          </div>
        </div>
        <div className="grid lg:grid-cols-2  md:grid-cols-4  px-4 text-start">
          <div className="lg:col-span-1 md:col-span-3  py-5">
            <div className="grid lg:grid-cols-12 md:grid-cols-12 gap-5">
              <div className="lg:col-span-2 md:col-span-3">
                <select
                  className=" w-full bg-transparent border-2 p-1 outline-none border-[#00B56C]-600"
                  onChange={handleInputChange}
                  name="VehicleReg"
                  value={Ignitionreport.VehicleReg}
                >
                  <option>Select Vehicle</option>
                  {vehicleList.map((item: DeviceAttach) => (
                    <option key={item.id} value={item.vehicleReg}>
                      {item.vehicleReg}
                    </option>
                  ))}
                </select>
              </div>

              <div className=" grid lg:grid-cols-8  mb-5 md:grid-cols-6 sm:grid-cols-5 gap-5 lg:text-center lg:mx-52 md:mx-24 sm:mx-10  flex justify-center">
                <div className="lg:col-span-2 md:col-span-2 sm:col-span-2">
                  <label>
                    <input
                      type="radio"
                      className="w-5 h-4 form-radio  "
                      style={{ accentColor: "green" }}
                      name="period"
                      value="today"
                      checked={Ignitionreport.period === "today"}
                      onChange={handleInputChange}
                    />
                    &nbsp;&nbsp;Today
                  </label>
                </div>
                <div className="lg:col-span-2 md:col-span-2 sm:col-span-2">
                  <label>
                    <input
                      type="radio"
                      className="w-5 h-4 form-radio text-green"
                      name="period"
                      value="yesterday"
                      style={{ accentColor: "green" }}
                      checked={Ignitionreport.period === "yesterday"}
                      onChange={handleInputChange}
                    />
                    &nbsp;&nbsp;Yesterday
                  </label>
                </div>

                <div className="lg:col-span-2 md:col-span-2">
                  <label>
                    <input
                      type="radio"
                      className="w-5 h-4"
                      name="period"
                      value="week"
                      style={{ accentColor: "green" }}
                      checked={Ignitionreport.period === "week"}
                      onChange={handleInputChange}
                    />
                    &nbsp;&nbsp;Week
                  </label>
                </div>

                <div className="lg:col-span-2 md:col-span-2">
                  <label>
                    <input
                      type="radio"
                      className="w-5 h-4"
                      name="period"
                      value="custom"
                      style={{ accentColor: "green" }}
                      checked={Ignitionreport.period === "custom"}
                      onChange={handleInputChange}
                    />
                    &nbsp;&nbsp;Custom
                  </label>
                </div>
              </div>
            </div>
            {isCustomPeriod && (
              <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 mt-5 mb-8  grid-cols-2 pt-5 px-10 gap-2 flex justify-center ">
                <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 col-span-2 lg:mt-0 md:mt-0 sm:mt-0 mt-4 ">
                  <label className="text-labelColor">
                    From Date: &nbsp;&nbsp;
                    <input
                      type="date"
                      className="ms-1 h-8 lg:w-4/6 w-full  text-labelColor  outline-green border border-grayLight px-1"
                      name="fromDateTime"
                      placeholder="Select Date"
                      autoComplete="off"
                      value={Ignitionreport.fromDateTime}
                      defaultValue={currentDate}
                      onChange={(e) =>
                        handleCustomDateChange("fromDateTime", e.target.value)
                      }
                    />
                  </label>
                </div>
                <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 col-span-2 lg:mt-0 md:mt-0 sm:mt-0 mt-4 ">
                  <label className="text-labelColor">
                    To Date: &nbsp;&nbsp;
                    <input
                      type="date"
                      className="h-8 lg:w-4/6 w-full  text-labelColor  outline-green border border-grayLight px-1"
                      name="toDateTime"
                      value={Ignitionreport.toDateTime}
                      onChange={(e) =>
                        handleCustomDateChange("toDateTime", e.target.value)
                      }
                    />
                  </label>
                </div>
              </div>
            )}
            <div className="text-white h-20 flex justify-center items-center">
              <button
                onClick={handleSubmit}
                className={`bg-green py-2 px-5 mb-5`}
              >
                Submits
              </button>
            </div>
            <div>
              {" "}
              stop details{stopDetails.length}
              {stopDetails.map((item: StopAddressData) => (
                <div key={item.place_id}>
                  <p className="text-black bg-[#00B56C]">{item.display_name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1"></div>
        </div>

        <button className={`bg-green py-2 px-5 mb-5`} onClick={tick}>
          Play
        </button>
        <button className={`bg-red py-2 px-5 mb-5`} onClick={stopTick}>
          Stop
        </button>
        <button className={`bg-yellow py-2 px-5 mb-5`} onClick={pauseTick}>
          Pause
        </button>

        {isPlaying && (
          <select
            className={`bg-blue py-2 px-5 mb-5`}
            value={speedFactor}
            onChange={(e) => setSpeedFactor(Number(e.target.value))}
          >
            <option value={1}>1X Speed</option>
            <option value={2}>2X Speed</option>
            <option value={4}>4X Speed</option>
            <option value={6}>6X Speed</option>
          </select>
        )}
        {isPaused && (
          <p className={`bg-yellow py-2 px-5 mb-5`}>{TripAddressData}</p>
        )}
        {isPlaying || isPaused ? (
          <div>
            <p className="text-black bg-[#00B56C]">
              Speed: {getSpeedAndDistance()?.speed} Distance Covered:{" "}
              {getSpeedAndDistance()?.distanceCovered}
            </p>
          </div>
        ) : null}
        <button className={`bg-blue py-2 px-5 mb-5`} onClick={handleZoneClick}>
          Show all zones
        </button>

        <div className="grid lg:grid-cols-5  sm:grid-cols-5 md:grid-cols-5 grid-cols-1">
          <div className="lg:col-span-1 md:col-span-1 sm:col-span-4 col-span-4 bg-gray-200">
            <p className="bg-[#00B56C] px-4 py-1 text-white">
              Tips{dataresponse?.length}
            </p>
            {dataresponse?.map((item: TripsByBucket, index: number) => (
              <button
                key={index}
                className="border p-4 my-4 rounded-md"
                onClick={() => handleDivClick(item.TripStart, item.TripEnd)}
              >
                <h2 className="text-xl font-semibold">Trip {index + 1}</h2>
                <div className="flex items-center mt-2">
                  <label className="mr-2">Duration:</label>

                  <span className="mx-2">{item.TripDurationHr} Hours</span>

                  <span className="mx-2">{item.TripDurationMins} Min</span>
                </div>
                <div className="mt-2">
                  <label>Distance:</label>
                  <span>{item.TotalDistance}</span>
                </div>
                <div className="mt-2">
                  <label>Location Start:</label>
                  <span>{item.StartingPoint}</span>
                </div>
                <div className="mt-2">
                  <label>Trip Start:</label>
                  <span>{item.TripStart}</span>
                </div>
                <div className="mt-2">
                  <label>Location End:</label>
                  <span>{item.EndingPoint}</span>
                </div>
                <div className="mt-2">
                  <label>Trip End:</label>
                  <span>{item.TripEnd}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-4 md:col-span-4 sm:col-span-5 col-span-4">
            <div style={{ height: "48em" }} className="w-full overflow-hidden">
              {mapcenter !== null && (
                <MapContainer
                  id="map"
                  zoom={zoom}
                  center={mapcenter}
                  className="z-10 "
                  style={{ height: "75em" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a>'
                  />

                  <Polyline
                    pathOptions={{ color: "red", weight: 12 }}
                    positions={polylinedata}
                  />
                  {isPlaying ? (
                    <SetViewOnClick coords={mapcenter} />
                  ) : (
                    <SetViewfly coords={mapcenterToFly} zoom={zoomToFly} />
                  )}

                  {showZones &&
                    zoneList.map(function (singleRecord) {
                      return singleRecord.zoneType == "Circle" ? (
                        <>
                          <Circle
                            center={[
                              Number(singleRecord.centerPoints.split(",")[0]),
                              Number(singleRecord.centerPoints.split(",")[1]),
                            ]}
                            radius={Number(singleRecord.latlngCordinates)}
                          />
                        </>
                      ) : (
                        <Polygon
                          positions={JSON.parse(singleRecord.latlngCordinates)}
                        />
                      );
                    })}

                  {carPosition && (
                    <Marker
                      position={carPosition}
                      icon={createMarkerIcon(getCurrentAngle())}
                    ></Marker>
                  )}
                  {TravelHistoryresponse.length > 0 && (
                    <div>
                      <Marker
                        position={[
                          TravelHistoryresponse[0].lat,
                          TravelHistoryresponse[0].lng,
                        ]}
                        icon={
                          new L.Icon({
                            iconUrl:
                              "https://img.icons8.com/fluent/48/000000/marker-a.png",
                            iconAnchor: [22, 47],
                            popupAnchor: [1, -34],
                          })
                        }
                      ></Marker>

                      <Marker
                        position={[
                          TravelHistoryresponse[
                            TravelHistoryresponse.length - 1
                          ].lat,
                          TravelHistoryresponse[
                            TravelHistoryresponse.length - 1
                          ].lng,
                        ]}
                        icon={
                          new L.Icon({
                            iconUrl:
                              "https://img.icons8.com/fluent/48/000000/marker-b.png",
                            iconAnchor: [22, 47],
                            popupAnchor: [1, -34],
                          })
                        }
                      ></Marker>
                    </div>
                  )}
                </MapContainer>
              )}
            </div>
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
}

/*  useEffect(() => {
    if (isPlaying && !isPaused) {
      const totalSteps = TravelHistoryresponse.length - 1;
      let step = currentPositionIndex;

      const currentData = TravelHistoryresponse[step];
      const nextData = TravelHistoryresponse[step + 1];

      if (currentData && nextData) {
        const currentLatLng = new L.LatLng(currentData.lat, currentData.lng);
        const nextLatLng = new L.LatLng(nextData.lat, nextData.lng);

        const totalObjects = TravelHistoryresponse.length;
        const numSteps = 100;
        const stepSize = (1 / numSteps) * speedFactor * 4;
        let progress: number = 0;
        let animationId: number;

        const updatePosition = () => {
          if (progress < 1) {
            const interpolatedLatLng = new L.LatLng(
              currentLatLng.lat +
                (nextLatLng.lat - currentLatLng.lat) * progress,
              currentLatLng.lng +
                (nextLatLng.lng - currentLatLng.lng) * progress
            );

            setMapcenter([interpolatedLatLng.lat, interpolatedLatLng.lng]);
            progress += stepSize ;
            setProgressWidth(Number(progress.toFixed(2)));
            animationId = requestAnimationFrame(updatePosition);
            setCarPosition(interpolatedLatLng);
            const newProgress = Math.round(
              ((currentPositionIndex + 1.8) / totalObjects) * 100
            );
            setProgressWidth(newProgress);
          } else {
            step++;
            setCurrentPositionIndex(step);

            if (step < totalSteps) {
              progress = 0;
            } else {
              setIsPlaying(false);
              const { zoomlevel, centerLat, centerLng } = calculateZoomCenter(
                TravelHistoryresponse
              );

              setMapcenterToFly([centerLat, centerLng]);
              setzoomToFly(zoomlevel);
              setzoom(zoomlevel);
            }
          }
        };

        animationId = requestAnimationFrame(updatePosition);
        return () => {
          cancelAnimationFrame(animationId);
        };
      }
    } else if (isPaused) {
      pauseTick();
    } else {
      stopTick();
    }
  }, [
    isPlaying,
    currentPositionIndex,
    isPaused,
    TravelHistoryresponse,
    speedFactor,
  ]);
 */
