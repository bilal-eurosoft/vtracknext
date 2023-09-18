"use client";
import React from "react";
import { Dialog, DialogFooter } from "@material-tailwind/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import moment from 'moment-timezone';
import { videoList } from "@/utils/API_CALLS";
import { alldata } from "@/types/videoType";

export default function DualCam() {

  const [getData, setData] = useState<alldata[]>([])
  const { data: session } = useSession()
  const [image, setImage] = useState<any>([])
  const [video, setVideo] = useState<any>()
  const [open, setOpen] = React.useState(false);
  const [openSecond, setOpenSecond] = React.useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(
    moment().tz('America/Winnipeg')
  );
  const handleOpen = () => setOpen(!open);
  const handleOpenSecond = () => setOpenSecond(!openSecond);

  interface MyObject {
    name: string;
    age: number;
  }

  useEffect(() => {
    const vehicleListData = async () => {
      try {
        if (session) {
          const Data = await videoList({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjZhYjkxYTY4N2E3NGVmYzQ0YjI4ZmUiLCJ1c2VyTmFtZSI6IkthdXN0dWJoIiwicGFzc3dvcmQiOiJrcEAxMjM0NSEiLCJGdWxsTmFtZSI6IkthdXN0dWJoIFBhdGlsIiwiRW1haWwiOiJpbmZvQGJsdWVsaW5ldHJhbnNpdC5jYSIsImNsaWVudElkIjoiNjI2YWI3ODM2ODdhNzRlZmM0NGIyOGZjIiwidXNlckxhbmd1YWdlIjoiZW5nbGlzaCIsImNsaWVudCI6eyJfaWQiOiI2MjZhYjc4MzY4N2E3NGVmYzQ0YjI4ZmMiLCJjbGllbnROYW1lIjoiQkxVRUxJTkUgVFJBTlNJVCAoQ0FOQURBKSIsImNsaWVudEFkZHJlc3MiOiI4ODAgTG9nYW4gQXZlLCBXaW5uaXBlZywgTWFuaXRvYmEsIFIzRSAxTjgsIENhbmFkYSIsImNvbnRhY3RQZXJzb24iOiJLYXVzdHViaCBQYXRpbCIsImNvbnRhY3ROdW1iZXJzIjoiMTIwNDk5OTcxOTQiLCJ0eXBlb2ZCdXNpbmVzcyI6IkNhYiBTeXN0ZW0iLCJyZXF1aXJlZE5vRGV2aWNlcyI6NzUsInRpbWVab25lIjoiQW1lcmljYS9XaW5uaXBlZyIsImxhbmd1YWdlIjoiZW5nbGlzaCIsImRyaXZlclByb2ZpbGUiOmZhbHNlLCJmZWF0dXJlUG9ydGFsQXBwIjp0cnVlLCJmZWF0dXJlRHJpdmVyQXBwIjpmYWxzZSwiZmVhdHVyZUN1c3RvbWVyQXBwIjpmYWxzZSwiTWFwVHlwZSI6Ik9wZW5TdHJlZXQiLCJ0eXBlT2ZVbml0IjoiTWlsZSIsIl9fdiI6MCwiZGF0ZUZvcm1hdCI6IllZWVktTU0tREQiLCJub3RpZmljYXRpb25kYXRlZm9ybWF0IjoiTU1NTSBkZCB5eXl5Iiwibm90aWZpY2F0aW9udGltZWZvcm1hdCI6ImhoOm1tIHR0IiwidGltZUZvcm1hdCI6IkhIOm1tIiwiR2VvZmVuY2VFbWFpbCI6dHJ1ZSwiR2VvZmVuY2VOb3RpZmljYXRpb24iOnRydWUsIkdlb2ZlbmNlUG9ydGFsIjp0cnVlLCJHZW9mZW5jZVNNUyI6dHJ1ZSwiSGFyc2hBY2NlbGVyYXRpb25Qb3J0YWwiOnRydWUsIkhhcnNoQWNjZWxlcmF0aW9uUHVzaE5vdGlmaWNhdGlvbiI6dHJ1ZSwiSGFyc2hBY2NlbGVyYXRpb25TTVMiOnRydWUsIkhhcnNoQWNjZWxlcmF0aW9ubWFpbCI6dHJ1ZSwiSGFyc2hCcmVha0VtYWlsIjp0cnVlLCJIYXJzaEJyZWFrUG9ydGFsIjp0cnVlLCJIYXJzaEJyZWFrUHVzaE5vdGlmaWNhdGlvbiI6dHJ1ZSwiSGFyc2hCcmVha1NNUyI6dHJ1ZSwiSGFyc2hDb3JuZXJpbmdFbWFpbCI6dHJ1ZSwiSGFyc2hDb3JuZXJpbmdQb3J0YWwiOnRydWUsIkhhcnNoQ29ybmVyaW5nUHVzaE5vdGlmaWNhdGlvbiI6dHJ1ZSwiSGFyc2hDb3JuZXJpbmdTTVMiOnRydWUsIklkZWxpbmdQb3J0YWwiOnRydWUsIklkZWxpbmdQdXNoTm90aWZpY2F0aW9uIjp0cnVlLCJJZGVsaW5nU01TIjp0cnVlLCJJZGVsaW5nbWFpbCI6dHJ1ZSwiSWduaXRpb25PZmZFbWFpbCI6dHJ1ZSwiSWduaXRpb25PZmZQb3J0YWwiOnRydWUsIklnbml0aW9uT2ZmUHVzaE5vdGlmaWNhdGlvbiI6dHJ1ZSwiSWduaXRpb25PZmZTTVMiOnRydWUsIklnbml0aW9uT25FbWFpbCI6dHJ1ZSwiSWduaXRpb25PblBvcnRhbCI6dHJ1ZSwiSWduaXRpb25PblB1c2hOb3RpZmljYXRpb24iOnRydWUsIklnbml0aW9uT25TTVMiOnRydWUsIk92ZXJTcGVlZEVtYWlsIjp0cnVlLCJPdmVyU3BlZWROb3RpZmljYXRpb24iOnRydWUsIk92ZXJTcGVlZFBvcnRhbCI6dHJ1ZSwiT3ZlclNwZWVkU01TIjp0cnVlfSwicmVmcmVzaEtleSI6IlZxa3ZVQkxkSWpSYi8xNjJJTG5iWUE9PSIsImlhdCI6MTY5NDUxNTA4N30.7tWd5ZQaD6k1YOm290E6BSvuGDGhbHotCggAnCzh6Sw",
            clientId: "64e7352d8e7dd0ce514b6d46",
          });
          setData(Data)

        }
      } catch (error) {
        console.error("Error fetching zone data:", error);
      }
    };
    vehicleListData();
  }, [session]);

  useEffect(() => {
    const store = getData.map((item) => {
      if (item.fileType == 2) {
        setVideo(item.path)
      }
      if (item.fileType == 1) {
        setImage(item.path)
      }
    })

  }, [getData])

  useEffect(() => {

    setCurrentDateTime(moment().tz('America/Winnipeg'));

  }, []);

  return (
    <div>
      <p className="bg-[#00B56C] px-4 py-1 text-white mb-10">Video List</p>
      <div className="grid lg:grid-cols-2  md:grid-cols-4  px-4 text-start">
        <div className="col-span-1"></div>
      </div>
      <div className="grid lg:grid-cols-5  sm:grid-cols-5 md:grid-cols-5 grid-cols-1" style={{ height: '49em' }}>
        <div className="lg:col-span-1 md:col-span-1 sm:col-span-4  col-span-4 bg-bgLight">
          <p className="bg-[#00B56C] px-4 py-1 text-white">Tips(0)</p>
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
          <div className="grid grid-cols-2 mx-10 gap-5">
            <div className="col-span-1 shadow-lg overflow-y-scroll" style={{ height: '49em' }}>
              <div className="bg-green">
                <h1 className="text-center text-5xl text-white font-serif pt-3 ">Image</h1><hr className="w-36 ms-auto mr-auto pb-5 text-white"></hr>
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
              {getData.map((item: alldata, index) => {
                return <div className="grid grid-cols-5 text-center pt-5">
                  <div className="col-span-1">
                    <p>{index}</p>
                  </div>
                  <div className="col-span-1">
                    <p>{item.Vehicle}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">
                      {currentDateTime.format('MM DD, YYYY h:mm:ss A')}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <button onClick={handleOpen} className="text-white bg-green py-2 px-5 ">
                      Image
                    </button>
                    <Dialog open={open} handler={handleOpen} className="w-3/6 ms-auto mr-auto bg-bgLight">
                      <img src={image} className="w-full h-screen" alt="" />
                      {/* <DialogFooter>
                        <button
                          onClick={handleOpenSecond}
                          className="text-white bg-red py-2 px-5">
                          <span>Cancel</span>
                        </button>
                      </DialogFooter> */}
                    </Dialog>
                  </div>
                </div>
              })}
            </div>

            <div className="col-span-1 shadow-lg  overflow-y-scroll" style={{ height: '49em' }}>
              <div className="bg-green">
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
              {getData.map((item: alldata, index) => {
                return <div className="grid grid-cols-5 text-center pt-5">
                  <div className="col-span-1">
                    <p>{index}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-sm">{item.Vehicle}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">
                      {currentDateTime.format('MM DD, YYYY h:mm:ss A')}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <button onClick={handleOpenSecond} className="text-white bg-green py-2 px-5 ">
                      Video
                    </button>
                    <Dialog open={openSecond} handler={handleOpenSecond} className="w-3/6 ms-auto mr-auto bg-bgLight">
                      <video muted loop autoPlay src={video} style={{ height: '50em' }}></video>
                      <DialogFooter>
                        <button
                          onClick={handleOpenSecond}
                          className="text-white bg-red py-2 px-5">
                          <span>Cancel</span>
                        </button>
                      </DialogFooter>
                    </Dialog>
                  </div>
                </div>
              })}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}