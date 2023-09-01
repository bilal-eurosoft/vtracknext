'use client'
import { useState } from "react"
export default function LiveTracking() {

  interface MyObject {
    name: string;
    age: number;
  }
  const myArray: MyObject[] = [
    { name: "ABU-878", age: 30 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 35 },
  ];

  const names: string[] = myArray.map((myArray) => myArray.name);
  console.log(names)
  return <div>

    <div className="flex flex-row">
      <div className="basis-1/4 h-screen bg-gray-50">

        <div className="flex flex-row px-4 py-3 bg-[#00B56C] h-12">
          <div className="basic-10">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">  <circle cx="11" cy="11" r="8" />  <line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>

          <div className="basis-40">
            <input type="text" id="first_name" className="bg-transparent outline-none text-white w-full px-1 py-1 placeholder-gray-100 " placeholder="John" required />
          </div>

          <div className="basis-40">
            <p className="text-sm text-white ms-9 pt-1.5">Show (1) Vehicles</p>
          </div>

        </div>

        <div className="flex flex-row px-4 py-3 bg-gray-600 h-12">
          <div className="basic-40">
            <p className="text-white">Vehicle Summary:</p>
          </div>

          <div className="basis-3"></div>

          <div className="basis-40 ">
            <div className="flex flex-row">

              <div className="basic-10">
                <svg className="h-6 w-3 text-green-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" /></svg>
              </div>

              <div className="basic-10">
                <p className="text-white">0  &nbsp;&nbsp;</p>
              </div>

              <div className="basic-10">
                <svg className="h-6 w-3 text-yellow-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" /></svg>
              </div>

              <div className="basic-10">
                <p className="text-white">0&nbsp;&nbsp; </p>
              </div>

              <div className="basic-10">
                <svg className="h-6 w-3 text-red-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" /></svg>
              </div>

              <div className="basic-10">
                <p className="text-white">1  </p>
              </div>

            </div>
          </div>

        </div>


        <div className="flex flex-row  mt-2 px-4 py-6 bg-white ">

          <div className="basis-9/12">
            <p ><b className="text-[#CF000F] ">ABU-878</b></p>
          </div>

          <div className="basis-20">
            <button className="text-white bg-[#CF000F] p-1">Parked</button>
          </div>
          <div className="basis-20 ms-1">
            <div className="flex flex-row">

              <div className="basic-10">
                <p className="text-black">0 Kpk  &nbsp;&nbsp;</p>
              </div>

              <div className="basic-5">
                <svg className="h-6 w-3 text-red-500 " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"  >  <circle cx="12" cy="12" r="10" /></svg><br></br><br></br>
              </div>

            </div>
          </div>
        </div>

        <div className="bg-white -mt-5 px-4 pb-7 border-b-2 border-[#00B56C]">
          <p className="text-gray-400 text-sm ">August 24 2023 01:33:51pm</p>
        </div>

        <div className="flex flex-row  mt-2 px-4 py-6 bg-white ">

          <div className="basis-9/12">
            <p ><b className="text-green-500 ">Test</b></p>
          </div>

          <div className="basis-20">
            <button className="text-white bg-green-500 p-1">Parked</button>
          </div>
          <div className="basis-20 ms-1">
            <div className="flex flex-row">

              <div className="basic-10">
                <p className="text-black">0 Kpk  &nbsp;&nbsp;</p>
              </div>

              <div className="basic-5">
                <svg className="h-6 w-3 text-green-500 " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"  >  <circle cx="12" cy="12" r="10" /></svg><br></br><br></br>
              </div>

            </div>
          </div>
        </div>

        <div className="bg-white -mt-5 px-4 pb-7 border-b-2 border-[#00B56C]">
          <p className="text-gray-400 text-sm ">August 24 2023 01:33:51pm</p>
        </div>

      </div>
      <div className="basis-full ">

        <iframe className="w-full h-screen" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14480.14584461658!2d67.01494291377836!3d24.86260426589045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6d06bea525%3A0xca5759c73e8b99ce!2sSaddar%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1693470315983!5m2!1sen!2s" loading="lazy"></iframe>
      </div>
    </div>

  </div>
}
