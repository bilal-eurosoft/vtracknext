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
import L, { LatLng, LatLngTuple } from "leaflet";
import { Marker } from "react-leaflet/Marker";
import { Toaster, toast } from "react-hot-toast";
import { useMap } from "react-leaflet";
import {
  Tripaddressresponse,
  calculateZoomCenter,
  createMarkerIcon,
} from "@/utils/JourneyReplayFunctions";
import { StopAddressData } from "@/types/StopDetails";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Tooltip, Button } from "@material-tailwind/react";

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
  const [getShowRadioButton, setShowRadioButton] = useState(false);
  const [getShowdetails, setShowDetails] = useState(false);
  const [getShowICon, setShowIcon] = useState(false);
  const [getCheckedInput, setCheckedInput] = useState<any>(false);
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
  const currentTimeasia = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Karachi",
  });
  const [date, time] = currentTimeasia.split(", ");

  let timeOnly = currentTime.split(",")[1].trim();
  timeOnly = timeOnly.replace(/\s+[APap][Mm]\s*$/, "");

  const [hours, minutes, seconds] = timeOnly
    .split(":")
    .map((part) => part.trim());
  let stopDetailsHour = Number(hours);

  stopDetailsHour = (stopDetailsHour - 7 + 12) % 12;

  const newAmPm = stopDetailsHour >= 12 ? "AM" : "PM";
  let stopDetailTime = `${stopDetailsHour}:${minutes}:${seconds} ${newAmPm}`;

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
  const handleClick = () => {
    setShowRadioButton(!getShowRadioButton);
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

  const handleShowDetails = () => {
    setShowDetails(!getShowdetails);
    setShowIcon(!getShowICon);
  };

  const handleChangeChecked = () => {
    setCheckedInput(!getCheckedInput);
  };

  return (
    <>
      <div style={{ height: "90vh" }}>
        <p className="bg-[#00B56C] px-4 py-1 text-white">JourneyReplay</p>

        <div className="grid lg:grid-cols-10  md:grid-cols-4  gap-5 px-4 text-start pt-4 bg-bgLight">
          <div className="lg:col-span-1 md:col-span-3">
            <select
              className=" h-8  w-full  text-labelColor  outline-green border border-grayLight px-1"
              onChange={handleInputChange}
              name="VehicleReg"
              value={Ignitionreport.VehicleReg}
            >
              <option value="" disabled selected hidden>
                Select Vehicle
              </option>
              {vehicleList.map((item: DeviceAttach) => (
                <option key={item.id} value={item.vehicleReg}>
                  {item.vehicleReg}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-3 md:col-span-3  pt-2">
            {getShowRadioButton ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2  -mt-5  grid-cols-2  px-10 gap-5 flex justify-center ">
                <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 col-span-2 lg:mt-0 md:mt-0 sm:mt-0  ">
                  <label className="text-green">
                    From
                    <input
                      type="date"
                      className="ms-1  w-full  text-labelColor  outline-green border-b border-gray px-1"
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
                <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 col-span-2  ">
                  <label className="text-green">
                    To
                    <br></br>
                    <input
                      type="date"
                      className=" w-full  text-labelColor  outline-green border-b border-gray px-1"
                      name="toDateTime"
                      value={Ignitionreport.toDateTime}
                      onChange={(e) =>
                        handleCustomDateChange("toDateTime", e.target.value)
                      }
                    />
                  </label>
                </div>
                <div className="lg:col-span-1">
                  <button
                    className="text-green ms-5  text-2xl "
                    onClick={() => setShowRadioButton(false)}
                  >
                    x
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 md:grid-cols-12 gap-5">
                <div className="lg:col-span-2 md:col-span-2 sm:col-span-2">
                  <label className="text-sm color-labelColor ">
                    <input
                      type="radio"
                      className="w-5 h-4 form-radio  "
                      style={{ accentColor: "green" }}
                      name="period"
                      value="today"
                      checked={Ignitionreport.period === "today"}
                      onChange={handleInputChange}
                    />
                    &nbsp;Today
                  </label>
                </div>

                <div className="lg:col-span-2  md:col-span-2 sm:col-span-2  lg:-ms-4 ">
                  <label className="text-sm color-labelColor w-full ">
                    <input
                      type="radio"
                      className="w-4   h-4 form-radio text-green"
                      name="period"
                      value="yesterday"
                      style={{ accentColor: "green" }}
                      checked={Ignitionreport.period === "yesterday"}
                      onChange={handleInputChange}
                    />
                    &nbsp;Yesterday
                  </label>
                </div>

                <div className="lg:col-span-2 md:col-span-2 ">
                  <label className="text-sm color-labelColor ">
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

                <div className="lg:col-span-3 md:col-span-2 ">
                  <label className="text-sm color-labelColor ">
                    <input
                      type="radio"
                      className="w-5 h-4"
                      name="period"
                      value="custom"
                      style={{ accentColor: "green" }}
                      checked={Ignitionreport.period === "custom"}
                      onChange={handleInputChange}
                      onClick={handleClick}
                    />
                    &nbsp;&nbsp;Custom
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className=" col-span-1 text-white h-16 flex justify-center items-center">
            <button
              onClick={handleSubmit}
              className={`bg-green py-2 px-8 mb-5`}
            >
              Search
            </button>
          </div>
          <div className="col-span-1"></div>
        </div>
        <div className="grid lg:grid-cols-5  sm:grid-cols-5 md:grid-cols-12 sm:grid-cols-12 grid-cols-1">
          <div className="lg:col-span-1 md:col-span-3 sm:col-span-12 col-span-4 ">
            <p className="bg-green px-4 py-1 text-white">
              Trips ({dataresponse?.length})
            </p>
            <div
              style={{ height: "44.4em" }}
              className="overflow-y-scroll overflow-x-hidden bg-bgLight "
            >
              {dataresponse?.map((item: TripsByBucket, index: number) => (
                <button
                  key={index}
                  className=" my-2 "
                  onClick={() => handleDivClick(item.TripStart, item.TripEnd)}
                >
                  {/* <h2 className="text-xl font-semibold">Trip {index + 1}</h2> */}
                  <div className="py-5 hover:bg-tripBg px-5 cursor-pointer">
                    <div className="grid grid-cols-12 gap-10">
                      <div className="col-span-1">
                        <svg
                          className="h-8 w-8 text-green"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <circle cx="7" cy="17" r="2" />{" "}
                          <circle cx="17" cy="17" r="2" />{" "}
                          <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
                        </svg>
                      </div>
                      <div className="col-span-10 ">
                        <p className="text-start font-bold text-sm text-gray">
                          Duration: {item.TripDurationHr} Hour(s){" "}
                          {item.TripDurationMins} Minute(s)
                        </p>
                        <p className=" text-green text-start font-bold text-sm">
                          {" "}
                          Distance: {item.TotalDistance}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-10 mt-5">
                      <div className="col-span-1">
                        <svg
                          className="h-8 w-8 text-green"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div className=" border-l-2 h-10 border-green  mx-4 my-3"></div>
                      </div>
                      <div className="col-span-8 ">
                        <p className="text-start font-bold text-sm text-labelColor">
                          <span className="text-green"> Location Start:</span>{" "}
                          <br></br>{" "}
                          <span className="text-gray">
                            {item.StartingPoint}
                          </span>
                        </p>
                        <p className=" text-gray text-start font-bold text-sm">
                          {" "}
                          Trip Start: {item.TripStart}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-10">
                      <div className="col-span-1">
                        <svg
                          className="h-8 w-8 text-green"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="col-span-8 ">
                        <p className="text-start font-bold text-sm text-labelColor">
                          <span className="text-green"> Location End:</span>{" "}
                          <br></br>
                          <span className="text-gray"> {item.EndingPoint}</span>
                        </p>
                        <p className=" text-gray text-start font-bold text-sm">
                          {" "}
                          Trip End: {item.TripEnd}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div
            className="lg:col-span-4 md:col-span-9 sm:col-span-12 col-span-4"
            style={{ position: "relative" }}
          >
            <div>
              {mapcenter !== null && (
                <MapContainer
                  id="map"
                  zoom={zoom}
                  center={mapcenter}
                  className=" "
                  style={{ height: "80vh", zIndex: "-1" }}
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

            <div
              className="absolute lg:top-4 lg:left-20 lg:right-5 top-4 left-2 right-2 grid lg:grid-cols-10 md:grid-cols-10 sm:grid-cols-10 grid-cols-10 lg:mt-0  mt-20 "
              // style={{
              //   position: "absolute",
              //   top: "2%",
              //   left: "5%",
              //   right: "2%",
              // }}

              // className="absolute lg:left-56 lg:right-20 lg:bottom-0 bottom-2  left-1 right-3"
            >
              <div className="lg:col-span-2 md:col-span-4 sm:col-span-3 col-span-5  ">
                <div className="grid lg:grid-cols-12 md:grid-cols-12 sm:grid-cols-12 grid-cols-12 bg-green py-2 shadow-lg">
                  <div className="lg:col-span-10  md:col-span-10 sm:col-span-10 col-span-10">
                    <p className="text-white px-3 text-lg">
                      Stop Details ({stopDetails.length})
                    </p>
                  </div>
                  <div className="col-span-1 mt-1">
                    {getShowICon ? (
                      <svg
                        className="h-5 w-5 text-white"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        onClick={handleShowDetails}
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-white"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        onClick={handleShowDetails}
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />{" "}
                        <path d="M4 16v2a2 2 0 0 0 2 2h2" />{" "}
                        <path d="M16 4h2a2 2 0 0 1 2 2v2" />{" "}
                        <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />{" "}
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </div>
                </div>

                {getShowdetails ? (
                  <div className="bg-white h-60 overflow-y-scroll">
                    {stopDetails.map((item: StopAddressData) => (
                      <div key={item.place_id}>
                        <p className="text-gray px-3 py-3 text-sm">
                          {item.display_name} {stopDetailTime}
                        </p>
                        <hr className="text-gray"></hr>
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="lg:col-span-7 md:col-span-4 sm:col-span-4  col-span-2"></div>

              <div className="lg:col-span-1  md:col-span-2 sm-col-span-2 col-span-3 text-end  ">
                <div
                  className="grid lg:grid-cols-3  grid-cols-5 sm:grid-cols-3 bg-bgLight  py-3 shadow-lg"
                  onClick={handleZoneClick}
                >
                  <div className="col-span-1  text-center ">
                    <input
                      type="checkbox"
                      className=""
                      onChange={handleChangeChecked}
                      checked={getCheckedInput}
                      style={{ accentColor: "green" }}
                    />
                  </div>
                  <div className="lg:col-span-2 sm:col-span-2 col-span-4 lg:-ms-5">
                    <button className="text-sm" onClick={handleChangeChecked}>
                      <h1 className="lg:-ms-32  sm:-ms-32 -ms-24">
                        {" "}
                        Show zones
                      </h1>
                    </button>
                  </div>
                </div>
                <div
                  className="grid grid-cols-11 mt-3"
                  style={{ justifyContent: "center", display: "flex" }}
                >
                  <div className="col-span-9 bg-bgPlatBtn w-20 h-10 rounded-tr-full rounded-tl-full"></div>
                </div>
              </div>
            </div>
            <div
              className="grid lg:grid-cols-10 grid-cols-10"
              style={{
                position: "absolute",
                top: "15%",
                left: "5%",
                right: "2%",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <div className="col-span-2  lg:w-48 md:w-44 sm:w-44 w-36 rounded-md lg:mt-3 mt-28">
                {isPlaying || isPaused ? (
                  <div>
                    <p className="text-white px-2 py-3 mt-3 bg-bgPlatBtn rounded-md">
                      Speed: {getSpeedAndDistance()?.speed}
                      <br></br> Distance:{" "}
                      {getSpeedAndDistance()?.distanceCovered}
                    </p>
                  </div>
                ) : null}

                {isPaused && (
                  <p className="bg-bgPlatBtn text-white mt-3 px-2 py-3 rounded-md">
                    {TripAddressData}
                  </p>
                )}
              </div>
            </div>

            <div
              // style={{
              //   position: "absolute",
              //   left: "0%",
              //   right: "5%",
              //   bottom: "0%",
              // }}
              className="absolute lg:left-56 lg:right-20 lg:bottom-0 md:bottom-8 bottom-2  left-1 right-3"
            >
              <div className="grid lg:grid-cols-7 md:grid-12 grid-cols-12 lg:gap-5 gap-2 ">
                <div className="lg:col-span-1 md:col-span-3 col-span-3  ">
                  <div className="bg-bgPlatBtn rounded-md">
                    <p className="lg:text-xl text-white text-center font-extralight py-2 text-md mx-1">
                      {time}
                    </p>
                    <p className="text-white text-xs text-center"> {date}</p>
                    <div className=" border-t border-white my-1 lg:w-32 mx-2"></div>
                    <div className="mt-3 pb-3 ms-1">
                      <Tooltip content="Pause" className="bg-black">
                        <button onClick={pauseTick}>
                          <svg
                            className="h-5 w-5 text-white lg:mx-2 lg:ms-5  md:mx-3 sm:mx-3 md:ms-4 sm:ms-6  mx-1 "
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            {" "}
                            <path stroke="none" d="M0 0h24v24H0z" />{" "}
                            <line x1="4" y1="4" x2="4" y2="20" />{" "}
                            <line x1="20" y1="4" x2="20" y2="20" />{" "}
                            <rect x="9" y="6" width="6" height="12" rx="2" />
                          </svg>
                        </button>
                      </Tooltip>
                      <Tooltip content="Play" className="bg-black">
                        <button onClick={tick}>
                          <svg
                            className="h-5 w-5 text-white lg:mx-2  md:mx-3 sm:mx-3 mx-1"
                            viewBox="0 0 24 24"
                            fill="white"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            {" "}
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </button>
                      </Tooltip>
                      <Tooltip content="Stop" className="bg-black">
                        <button onClick={stopTick}>
                          <svg
                            className="h-4   w-4 text-white lg:mx-2 md:mx-3 sm:mx-3 mx-1"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="white"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            {" "}
                            <path stroke="none" d="M0 0h24v24H0z" />{" "}
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                          </svg>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4 col-span-9   ">
                  <div className="grid lg:grid-cols-12 grid-cols-12 gap-1 lg:py-5 py-2 mt-6 pt-4 lg:pt-8 rounded-md  mx-2 px-5 bg-white">
                    <div className="lg:col-span-11 col-span-10">
                      <Box sx={{ width: "100%", color: "red!important" }}>
                        <LinearProgress
                          variant="determinate"
                          value={progressWidth}
                          style={{
                            backgroundColor: "lightgreen",
                            color: "red !important",
                            height: "0.6vh",
                          }}
                        />
                      </Box>
                      <div className="grid grid-cols-12 mt-2">
                        <div className="col-span-11">
                          <p className="text-sm color-labelColor"> 11:20pm</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-sm color-labelColor text-start">
                            10:50pm
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-1 col-span-1 -my-2">
                      {isPlaying && (
                        <select
                          className="text-labelColo outline-green border border-grayLight px-1"
                          value={speedFactor}
                          onChange={(e) =>
                            setSpeedFactor(Number(e.target.value))
                          }
                        >
                          <option value={1}>1x</option>
                          <option value={2}>2x</option>
                          <option value={4}>4x </option>
                          <option value={6}>6x</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
