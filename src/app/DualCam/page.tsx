"use client";
import React from "react";
import { Dialog } from "@material-tailwind/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { videoList } from "@/utils/API_CALLS";
import { pictureVideoDataOfVehicleT } from "@/types/videoType";
import Loading from "../loading";
import Image from "next/image";
export default function DualCam() {
  const [pictureVideoDataOfVehicle, setPictureVideoDataOfVehicle] = useState<
    pictureVideoDataOfVehicleT[]
  >([]);
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [openSecond, setOpenSecond] = React.useState(false);
  const [singleImage, setSingleImage] = useState<any>();
  const [singleVideo, setSingleVideo] = useState<any>();
  const [loading, setLaoding] = useState(false);

  const handleOpen = (item: any) => {
    setOpen(!open);
    setSingleImage(item.path);
  };

  const handleOpenSecond = (item: any) => {
    setOpenSecond(!openSecond);
    setSingleVideo(item.path);
  };
  useEffect(() => {
    const vehicleListData = async () => {
      try {
        setLaoding(true);
        if (session) {
          const response = await videoList({
            token: session?.accessToken,
            clientId: session?.clientId,
          });
          setPictureVideoDataOfVehicle(response);
        }
        setLaoding(false);
      } catch (error) {
        console.error("Error fetching zone data:", error);
      }
    };
    vehicleListData();
  }, [session]);

  return (
    <div>
      <p className="bg-green px-4 py-1 text-white mb-10 font-bold">
        View Image & Videos
      </p>
      <div className="grid lg:grid-cols-6  md:grid-cols-4  px-4 text-start gap-5 ">
        <div className="col-span-1 mt-1">
          <select className=" w-full bg-transparent border-2 p-1 outline-none border-grayLight ">
            <option>Select Vehicle</option>
          </select>
        </div>
        <div className="col-span-1">
          <p className="text-sm">Camera Type</p>
          <label className="text-sm">
            <input
              type="radio"
              className="w-3 h-3 form-radio text-green"
              name="period"
              value="yesterday"
            />
            &nbsp;Front
          </label>
          <label className="text-sm">
            <input
              type="radio"
              className="w-3 h-3 form-radio text-green lg:ms-5"
              name="period"
              value="yesterday"
            />
            &nbsp;Back
          </label>
          <label className="text-sm">
            <input
              type="radio"
              className="w-3 h-3 form-radio text-green lg:ms-5"
              name="period"
              value="yesterday"
            />
            &nbsp;Both
          </label>
        </div>
        <div className="col-span-2">
          <p className="text-sm">Type</p>
          <label className="text-sm">
            <input
              type="radio"
              className="w-3 h-3 form-radio text-green"
              name="period"
              value="yesterday"
            />
            &nbsp;Photo
          </label>
          <label className="text-sm">
            <input
              type="radio"
              className="w-3 h-3 form-radio text-green lg:ms-5"
              name="period"
              value="yesterday"
            />
            &nbsp;Video
          </label>
          <label className="text-sm">
            <input
              type="radio"
              className="w-3 h-3 form-radio text-green lg:ms-5"
              name="period"
              value="yesterday"
            />
            &nbsp;Both
          </label>
        </div>

        <div className="lg:col-span-1 md:col-span-3  py-5">
          <div className="grid lg:grid-cols-12 md:grid-cols-12 gap-5">
            {/* <div className="lg:col-span-3 md:col-span-3 px-2">
              <select className=" w-full bg-transparent border-2 p-1 outline-none border-grayLight ">
                <option>Select Vehicle</option>
              </select>
            </div> */}
            {/* <div className="lg:col-span-2 md:col-span-2 mt-1">
              <input type="radio" className="w-5 h-4  " name="bilal" />
              <label className=" "> &nbsp;&nbsp;Today</label>
            </div>
            <div className="lg:col-span-2 md:col-span-3 mt-1">
              <input type="radio" className="w-5 h-4  " name="bilal" />
              <label className=" "> &nbsp;&nbsp;Yesterday</label>
            </div>
            <div className="lg:col-span-2 md:col-span-2 mt-1">
              <input type="radio" className="w-5 h-4  " name="bilal" />
              <label className=" "> &nbsp;&nbsp;Week</label>
            </div>
            <div className="lg:col-span-2 md:col-span-2 mt-1">
              <input type="radio" className="w-5 h-4  " name="bilal" />
              <label className=" "> &nbsp;&nbsp;Custom</label>
            </div> */}
            {/* <div className="lg:col-span-2 md:col-span-3 mt-1">
              <button className="bg-[#00B56C] px-5 text-white">Search</button>
            </div> */}
          </div>
        </div>
        <div className="col-span-1"></div>
      </div>

      <div className="grid lg:grid-cols-6  md:grid-cols-4  px-4 text-start gap-5 mt-3">
        <div className="col-span-2">
          <p className="text-sm">Date</p>
          <label className="text-sm">
            <input
              type="radio"
              className="w-3 h-3 form-radio text-green"
              name="period"
              value="yesterday"
            />
            &nbsp;Today
          </label>
          <label className="text-sm">
            <input
              type="radio"
              className="w-3 h-3 form-radio text-green lg:ms-5"
              name="period"
              value="yesterday"
            />
            &nbsp;Yesterday
          </label>
          <label className="text-sm">
            <input
              type="radio"
              className="w-3 h-3 form-radio text-green lg:ms-5"
              name="period"
              value="yesterday"
            />
            &nbsp;Week
          </label>

          <label className="text-sm">
            <input
              type="radio"
              className="w-3 h-3 form-radio text-green lg:ms-5"
              name="period"
              value="yesterday"
            />
            &nbsp;Custom
          </label>
        </div>
        <div className="col-span-2">
          <button className="bg-green px-5 py-2 text-white mt-2">Search</button>
        </div>

        <div className="lg:col-span-1 md:col-span-3  py-5">
          <div className="grid lg:grid-cols-12 md:grid-cols-12 gap-5">
            {/* <div className="lg:col-span-3 md:col-span-3 px-2">
              <select className=" w-full bg-transparent border-2 p-1 outline-none border-grayLight ">
                <option>Select Vehicle</option>
              </select>
            </div> */}
            {/* <div className="lg:col-span-2 md:col-span-2 mt-1">
              <input type="radio" className="w-5 h-4  " name="bilal" />
              <label className=" "> &nbsp;&nbsp;Today</label>
            </div>
            <div className="lg:col-span-2 md:col-span-3 mt-1">
              <input type="radio" className="w-5 h-4  " name="bilal" />
              <label className=" "> &nbsp;&nbsp;Yesterday</label>
            </div>
            <div className="lg:col-span-2 md:col-span-2 mt-1">
              <input type="radio" className="w-5 h-4  " name="bilal" />
              <label className=" "> &nbsp;&nbsp;Week</label>
            </div>
            <div className="lg:col-span-2 md:col-span-2 mt-1">
              <input type="radio" className="w-5 h-4  " name="bilal" />
              <label className=" "> &nbsp;&nbsp;Custom</label>
            </div> */}
            {/* <div className="lg:col-span-2 md:col-span-3 mt-1">
              <button className="bg-[#00B56C] px-5 text-white">Search</button>
            </div> */}
          </div>
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* <div className="grid lg:grid-cols-2  md:grid-cols-4  px-4 text-start">
      <div className="col-span-1"></div>
    </div>
    <div className="grid lg:grid-cols-5  sm:grid-cols-5 md:grid-cols-5 grid-cols-1" style={{ height: '49em' }}>
      <div className="lg:col-span-1 md:col-span-1 sm:col-span-4  col-span-4 bg-bgLight">
        <p className="bg-green px-4 py-1 text-white">Tips(0)</p>
        <div className="grid lg:grid-cols-3 text-center mt-5">
          <div className="lg:col-span-1">
            <p className="text-red font-bold">Abu-878</p>
          </div>
          <div className="lg:col-span-1">
            <button className="text-white bg-red p-1 -mt-1 shadow-lg">
              Parked
            </button>
          </div>
          <div className="col-span-1">
            <div className="grid grid-cols-4">
              <div className="lg:col-span-3 col-span-2">
                23Mph
              </div>
              <div className="lg:col-span-1">
                <svg
                  className={`h-6 w-3 text-red mr-2`}
                  viewBox="0 0 24 24"
                  fill='red'
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-4  md:col-span-4  sm:col-span-5 col-span-4  ">
        {loading ? <Loading /> : <div className="grid grid-cols-2 mx-10 gap-5">
          <div className="col-span-1 shadow-lg overflow-y-scroll" style={{ height: '49em' }}>
            <div className="bg-green shadow-lg sticky top-0">
              <h1 className="text-center text-5xl text-white font-serif pt-3 " >Image</h1><hr className="w-36 ms-auto mr-auto pb-5 text-white"></hr>
            </div>
            <div className="grid grid-cols-5 text-center pt-5">
              <div className="col-span-1">
                <p className="font-bold">S.No</p>
              </div>
              <div className="col-span-1">
                <p className="font-bold">Car.No</p>
              </div>
              <div className="col-span-2">
                <p className="font-bold">Date</p>
              </div>
              <div className="col-span-1">
                <p className="font-bold">Check</p>
              </div>
            </div>
            {pictureVideoDataOfVehicle.map((item: pictureVideoDataOfVehicleT, index) => {
              if (item.fileType === 1) {
                return <div className="grid grid-cols-5 text-center pt-5">
                  <div className="col-span-1 mt-2">
                    <p>{index + 1}</p>
                  </div>
                  <div className="col-span-1 mt-2">
                    <p>{item.Vehicle}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm mt-2">
                      {new Date(item?.dateTime).toLocaleString("en-US", {
                        timeZone: session?.timezone
                      })}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => {
                        handleOpen(item)
                      }} className="text-white bg-green py-2 px-5 ">
                      Image
                    </button>
                  </div>
                </div>
              }
            })}
          </div>
          <Dialog open={open} handler={handleOpen} className="w-3/6 ms-auto mr-auto bg-bgLight">
            <Image src={singleImage} className="w-full h-screen" alt="" />
          </Dialog>
          <div className="col-span-1 shadow-lg  overflow-y-scroll" style={{ height: '49em' }}>
            <div className="bg-green shadow-lg sticky top-0">
              <h1 className="text-center text-5xl text-white font-serif pt-3 ">Video</h1><hr className="w-36 ms-auto mr-auto pb-5 text-white"></hr>
            </div>
            <div className="grid grid-cols-5 text-center pt-5">
              <div className="col-span-1">
                <p className="font-bold">S.No</p>
              </div>
              <div className="col-span-1">
                <p className="font-bold">Car.No</p>
              </div>
              <div className="col-span-2">
                <p className="font-bold">Date</p>
              </div>
              <div className="col-span-1">
                <p className="font-bold">Check</p>
              </div>
            </div>
            {pictureVideoDataOfVehicle.map((item: pictureVideoDataOfVehicleT, index) => {
              if (item.fileType === 2) {
                return <div className="grid grid-cols-5 text-center pt-5">
                  <div className="col-span-1 mt-2">
                    <p>{index + 1}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-sm mt-2">{item.Vehicle}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm mt-2">
                      {new Date(item?.dateTime).toLocaleString("en-US", {
                        timeZone: session?.timezone,
                      })}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <button onClick={() => handleOpenSecond(item)} className="text-white bg-green py-2 px-5 ">
                      Video
                    </button>
                    <Dialog open={openSecond} handler={handleOpenSecond} className="w-3/6 ms-auto mr-auto bg-bgLight">
                      <video muted loop autoPlay src={singleVideo} className="h-screen"></video>
                    </Dialog>
                  </div>
                </div>
              }
            })}
          </div>
        </div>
        }
      </div>
    </div> */}
    </div>
  );
}
