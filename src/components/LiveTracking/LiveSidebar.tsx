import { VehicleData } from "@/types/vehicle";

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
  return (
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
          <h1 className="text-center text-white ">
            Show({carData?.length}) Vehicles
          </h1>
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

            <div className="lg:col-span-1">{`${countPause}`}</div>
            <div className="lg:col-span-1"></div>

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

            <div className="lg:col-span-1">{`${countParked}`}</div>
          </div>
        </div>
      </div>
      {carData?.map((item: VehicleData) => {
        return (
          <div
            key={item?.IMEI}
            className="grid lg:grid-cols-3 grid-cols-3 text-center py-5 mt-2 bg-white border-b-2 border-[#00B56C] cursor-pointer"
            onClick={() => {
              setSelectedVehicle(item);
            }}
          >
            <div className="lg:col-span-1 col-span-1">
              <p>
                {item.gps.speed === 0 && item.ignition === 0 ? (
                  <b className="text-red-500 ">{item?.vehicleReg}</b>
                ) : item.gps.speed > 0 && item.ignition === 1 ? (
                  <b className="text-green-500 ">{item?.vehicleReg}</b>
                ) : (
                  <b className="text-yellow-500 ">{item?.vehicleReg}</b>
                )}
              </p>
            </div>

            <div className="lg:col-span-1 col-span-1">
              {item.gps.speed === 0 && item.ignition === 0 ? (
                <>
                  <button className="text-white bg-red-500 p-1 -mt-1">
                    Parked
                  </button>
                </>
              ) : item.gps.speed > 0 && item.ignition === 1 ? (
                <button className="text-white bg-green-500 p-1 -mt-1">
                  Moving
                </button>
              ) : (
                <button className="text-white bg-yellow-500 p-1 -mt-1">
                  Pause
                </button>
              )}
            </div>

            <div className="lg:col-span-1 col-span-1">
              <div className="grid grid-cols-4">
                <div className="lg:col-span-2 col-span-2">
                  {item.gps.speed} Mph
                </div>
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
                ) : (
                  <div className="lg:col-span-1">
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
                )}
              </div>
            </div>
            <p className="w-72 mt-10  text-start  px-4 text-gray-500">
              {item.timestamp}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default LiveSidebar;
