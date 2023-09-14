"use client";
import { useState } from "react";
export default function DualCam() {
  interface MyObject {
    name: string;
    age: number;
  }
  return (
    <div>
      <p className="bg-[#00B56C] px-4 py-1 text-white">Video List</p>
      <div className="grid lg:grid-cols-2  md:grid-cols-4  px-4 text-start">
        <div className="lg:col-span-1 md:col-span-3  py-5">
          <div className="grid lg:grid-cols-12 md:grid-cols-12 gap-3">


            <div className="lg:col-span-2 md:col-span-2 sm:col-span-2 mt-5">
              <input type="radio" className="w-3 h-3" name="bilal" />
              <label className="text-sm "> Both</label>
            </div>

            <div className="lg:col-span-2 md:col-span-2 sm:col-span-2 mt-5">
              <input type="radio" className="w-3 h-3  " name="bilal" />
              <label className="text-sm "> photo</label>
            </div>

            <div className="lg:col-span-2 md:col-span-2  sm:col-span-2 mt-5">
              <input type="radio" className="w-3 h-3" name="bilal" />
              <label className="text-sm "> video</label>
            </div>

            <div className="lg:col-span-1 md:col-span-1 ">
              <button className="bg-[#00B56C] px-5 py-1 text-white text-start mt-3">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-1"></div>
      </div>
      <div className="grid lg:grid-cols-5  sm:grid-cols-5 md:grid-cols-5 grid-cols-1" style={{ height: '46em' }}>
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

        <div className="lg:col-span-4  md:col-span-4  sm:col-span-5 col-span-4 ">

          <h1 className="text-center text-5xl font-serif mt-20">Image</h1><hr className="w-36 ms-auto mr-auto"></hr>
          <div className="grid grid-cols-3 text-center mt-10 gap-10 mx-5">
            <div className="col-span-1">
              <a>It is a long established fact that a reader will be distracted by the readable content of a page</a>
            </div>
            <div className="col-span-1">
              <a>It is a long established fact that a reader will be distracted by the readable content of a page</a>
            </div>
            <div className="col-span-1">
              <a>It is a long established fact that a reader will be distracted by the readable content of a page</a>
            </div>
          </div>

          <h1 className="text-center text-5xl font-serif mt-20">Video</h1><hr className="w-36 ms-auto mr-auto"></hr>
          <div className="grid grid-cols-3 text-center mt-5 gap-10 mx-5">
            <div className="col-span-1">
              <a>It is a long established fact that a reader will be distracted by the readable content of a page</a>
            </div>
            <div className="col-span-1">
              <a>It is a long established fact that a reader will be distracted by the readable content of a page</a>
            </div>
            <div className="col-span-1">
              <a>It is a long established fact that a reader will be distracted by the readable content of a page</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
