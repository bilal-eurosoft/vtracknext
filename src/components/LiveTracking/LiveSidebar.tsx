import { VehicleData } from "@/types/vehicle";
import { useEffect, useState } from "react";
import { ActiveStatus } from "../General/ActiveStatus";
import { useSession } from "next-auth/react";
import { zonelistType } from "../../types/zoneType";
import { getZoneListByClientId } from "../../utils/API_CALLS";
import "./index.css";
const LiveSidebar = ({
  carData,
  countMoving,
  countPause,
  countParked,
  setSelectedVehicle,
}: {
  carData: VehicleData[];
  countPause: Number;
  countParked: Number;
  countMoving: Number;
  setSelectedVehicle: any;
}) => {
  const { data: session } = useSession();
  const [searchData, setSearchData] = useState({
    search: "",
  });
  const [filteredData, setFilteredData] = useState<any>([]);

  const [zoneList, setZoneList] = useState<zonelistType[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  useEffect(() => {
    (async function () {
      if (session) {
        const allzoneList = await getZoneListByClientId({
          token: session?.accessToken,
          clientId: session?.clientId,
        });
        setZoneList(allzoneList);
      }
    })();
  }, [session]);

  function isPointInPolygon(point: any, polygon: any) {
    let intersections = 0;
    for (let i = 0; i < polygon.length; i++) {
      const edge = [polygon[i], polygon[(i + 1) % polygon.length]];
      if (rayIntersectsSegment(point, edge)) {
        intersections++;
      }
    }
    return intersections % 2 === 1;
  }
  function rayIntersectsSegment(point: any, segment: any) {
    const [p1, p2] = segment;
    const p = point;
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const t = ((p[0] - p1[0]) * dy - (p[1] - p1[1]) * dx) / (dx * dy);
    return t >= 0 && t <= 1;
  }
  useEffect(() => {
    const zoneLatlog = zoneList.map((item: any) => {
      if (item.zoneType == "Polygon") {
        return [...JSON.parse(item.latlngCordinates)]?.map((item2: any) => {
          return [item2.lat, item2.lng];
        });
      } else {
        return undefined;
      }
    });
    console.log(zoneLatlog);

    const filtered = carData
      .filter((data) =>
        data.vehicleReg
          .toLowerCase()
          .startsWith(searchData.search.toLowerCase())
      )
      .map((item: any) => {
        const i = zoneLatlog.findIndex((zone: any) => {
          if (zone != undefined) {
            return isPointInPolygon(
              [item.gps.latitude, item.gps.longitude],
              zone
            );
          }
        });

        if (i != -1) {
          item.zone = zoneList[i].zoneName;
        }
        return item;
      });

    setFilteredData(filtered);
  }, [searchData.search, carData]);
  const toggleLiveCars = () => {
    setSelectedVehicle(null);
    setIsActiveColor(0);
  };

  const [activeColor, setIsActiveColor] = useState<any>("");
  const handleClickVehicle = (item: any) => {
    setSelectedVehicle(item);
    setIsActiveColor(item.vehicleId);
  };

  console.log(zoneList);
  return (
    <div
      className="lg:col-span-1 md:col-span-2 sm:col-span-4  col-span-4"
      // style={{ height: "50em" }}
    >
      <div className="grid grid-cols-12 bg-green py-3 pe-1 gap-8 ">
        <div className="lg:col-span-7 md:col-span-5 sm:col-span-5 col-span-7 sticky top-0">
          <div className="grid grid-cols-12">
            <div className="lg:col-span-1 md:col-span-1 sm:col-span-1">
              <svg
                className="h-5 w-5 ms-1 mt-1 text-white "
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

            <div className="lg:col-span-11 md:col-span-10 sm:col-span-10   col-span-10 ms-2">
              <input
                type="text"
                name="search"
                className="text-sm bg-transparent text-white w-full px-1 py-1 placeholder-white border-b border-black outline-none w-full"
                placeholder="Vehicle Reg."
                required
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 md:col-span-6 sm:col-span-5 col-span-5 col-span-1 w-full">
          <button
            className="text-center text-sm font-bold text-white mt-1 "
            onClick={toggleLiveCars}
          >
            Show({carData?.length}) Vehicles
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 text-center bg-liveTrackingGrayColor py-4 text-white">
        <div className="lg:col-span-1">
          <p className="text-sm mt-1">Vehicle Summary:</p>
        </div>

        <div className="lg:col-span-1">
          <div className="grid grid-cols-10">
            <div className="lg:col-span-1">
              <svg
                className="h-6 w-3 text-green mr-2"
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

            <div className="lg:col-span-1">{`${countMoving}`}</div>
            <div className="lg:col-span-1"></div>

            <div className="lg:col-span-1">
              <svg
                className="h-6 w-3 text-yellow mr-2"
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

            <div className="lg:col-span-1">{`${countPause}`}</div>
            <div className="lg:col-span-1"></div>

            <div className="lg:col-span-1">
              <svg
                className="h-6 w-3 text-red mr-2"
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

            <div className="lg:col-span-1">{`${countParked}`}</div>
          </div>
        </div>
      </div>
      <div className="overflow-y-scroll" id="scroll_side_bar">
        {filteredData?.map((item: VehicleData, index: any) => {
          return (
            <div
              className="hover:bg-bgLight cursor-pointer pt-2"
              onClick={() => handleClickVehicle(item)}
              key={index}
              style={{
                backgroundColor:
                  activeColor == item.vehicleId ? "rgb(239, 239, 239)" : "",
              }}
            >
              <div
                key={item?.IMEI}
                className="grid lg:grid-cols-3 grid-cols-3 text-center py-2"
              >
                <div className="lg:col-span-1 col-span-1">
                  <div style={{ fontSize: "1.3em" }}>
                    {item.gps.speed === 0 && item.ignition === 0 ? (
                      <p className="text-red ">{item?.vehicleReg}</p>
                    ) : item.gps.speed > 0 && item.ignition === 1 ? (
                      <p className="text-green">{item?.vehicleReg}</p>
                    ) : (
                      <p className="text-yellow ">{item?.vehicleReg}</p>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-1 col-span-1">
                  {item.gps.speed === 0 && item.ignition === 0 ? (
                    <>
                      <button className="text-white bg-red p-1 -mt-1 shadow-lg">
                        Parked
                      </button>
                    </>
                  ) : item.gps.speed > 0 && item.ignition === 1 ? (
                    <button className="text-white bg-green p-1 -mt-1 shadow-lg">
                      Moving
                    </button>
                  ) : (
                    <button className="text-white bg-yellow p-1 -mt-1 shadow-md">
                      Pause
                    </button>
                  )}
                </div>
                <div className="lg:col-span-1 col-span-1">
                  <div className="grid grid-cols-4">
                    <div className="lg:col-span-2 col-span-2">
                      {item.gps.speed} Mph
                    </div>

                    {session?.timezone !== undefined ? (
                      <ActiveStatus
                        currentTime={new Date().toLocaleString("en-US", {
                          timeZone: session.timezone,
                        })}
                        targetTime={item.timestamp}
                      />
                    ) : (
                      <p>Timezone is undefined</p>
                    )}
                  </div>
                </div>
              </div>

              <p className="lg:text-start md:text-start sm:text-start text-center px-4  mt-1 pb-3 text-sm border-b-2 border-green text-green">
                {item.timestamp}
                <br></br>
                Zone Name: {item.zone}
                <br></br>
                <span className="text-labelColor">
                  {item?.OSM?.address?.neighbourhood}

                  {item?.OSM?.address?.road}

                  {item?.OSM?.address?.city}
                </span>
              </p>
            </div>
          );
        })}
        {/* {zoneList.map((item) => {
          return <h2>{item.zoneName}</h2>;
        })} */}
      </div>
    </div>
  );
};

export default LiveSidebar;
