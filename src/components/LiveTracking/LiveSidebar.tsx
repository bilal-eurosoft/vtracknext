import { VehicleData } from "@/types/vehicle";
import { getCurrentAddressOSM } from "@/utils/getCurrentAddressOSM";
import { useEffect, useState } from "react";
import { ActiveStatus } from "../General/ActiveStatus";
import { useSession } from "next-auth/react";

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
  const [filteredData, setFilteredData] = useState<VehicleData[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  useEffect(() => {
    const filtered = carData.filter((data) =>
      data.vehicleReg.toLowerCase().startsWith(searchData.search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchData.search, carData]);

  return (
    <div className="lg:col-span-1 md:col-span-2 sm:col-span-4  col-span-4  ">
      <div className="grid grid-cols-2 bg-green py-3 ">
        <div className="lg:col-span-1 sticky top-0">
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
                name="search"
                className="text-sm bg-transparent text-white w-full px-1 py-1 placeholder-white border-b border-black outline-none"
                placeholder="Vehicle Reg."
                required
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 col-span-1 ">
          <p className="text-center text-sm font-bold text-white mt-1">
            Show({carData?.length}) Vehicles
          </p>
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
      <div className="overflow-y-scroll " style={{ height: "46.8em" }}>
        {filteredData?.map((item: VehicleData) => {
          return (
            <div className="hover:bg-bgLight cursor-pointer pt-2">
              <div
                key={item?.IMEI}
                className="grid lg:grid-cols-3 grid-cols-3 text-center py-5      "
                onClick={() => {
                  setSelectedVehicle(item);
                }}
              >
                <div className="lg:col-span-1 col-span-1">
                  <p>
                    {item.gps.speed === 0 && item.ignition === 0 ? (
                      <b className="text-red ">{item?.vehicleReg}</b>
                    ) : item.gps.speed > 0 && item.ignition === 1 ? (
                      <b className="text-green">{item?.vehicleReg}</b>
                    ) : (
                      <b className="text-yellow ">{item?.vehicleReg}</b>
                    )}
                  </p>
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
                    {/*  )} */}
                  </div>
                </div>
              </div>

              <p className="lg:text-start md:text-start sm:text-start text-center px-4  mt-5 pb-5 text-sm border-b-2 border-green text-green">
                {item.timestamp}
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
      </div>
    </div>
  );
};

export default LiveSidebar;
