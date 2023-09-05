
'use client'
import { useState } from "react"
export default function DualCam() {

  interface MyObject {
    name: string;
    age: number;
  }
  const myArray: MyObject[] = [
    { name: "ABU-878", age: 30 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 35 },
  ];

  // const names: string[] = myArray.map((myArray) => myArray.name);
  // console.log(names)


  return <div >
    <p className="bg-[#00B56C] px-4 py-1 text-white">Video List</p>
    <div className="grid lg:grid-cols-2  md:grid-cols-1 sm:grid-cols-1  px-4 text-start">
      <div className="lg:col-span-1 md:col-span-1  py-5">
        <div className="grid lg:grid-cols-12 md:grid-cols-12 sm:grid-cols-12 gap-3">

          <div className="lg:col-span-2 md:col-span-3 sm:col-span-4 ">
            <label className="text-sm text-[#00B56C]" >From</label><br></br>
            <input type="date" className="mr-1 outline-none border-b-2 border-gray-400 w-full" name="bilal" />
          </div>

          <div className="lg:col-span-2 md:col-span-3 sm:col-span-4">
            <label className=" text-sm text-[#00B56C]" >To</label><br></br>
            <input type="date" className="mr-1 outline-none border-b-2 border-gray-400  w-full" name="bilal" />
          </div>

          <div className="lg:col-span-3 md:col-span-3 sm:col-span-4 mt-6">
            <select className="w-full mr-1 outline-none border-b-2 border-gray-400">
              <option>TESt</option>
              <option>TESt</option>
            </select>
          </div>

          <div className="lg:col-span-1 md:col-span-2 sm:col-span-2 mt-5">
            <input type="radio" className="w-3 h-3" name="bilal" />
            <label className="text-sm "> Both</label>
          </div>

          <div className="lg:col-span-1 md:col-span-2 sm:col-span-2 mt-5">
            <input type="radio" className="w-3 h-3  " name="bilal" />
            <label className="text-sm "> photo</label>
          </div>

          <div className="lg:col-span-1 md:col-span-2  sm:col-span-2 mt-5">
            <input type="radio" className="w-3 h-3" name="bilal" />
            <label className="text-sm "> video</label>
          </div>

          <div className="lg:col-span-1 md:col-span-1 ">
            <button className="bg-[#00B56C] px-5 py-1 text-white text-start mt-3">Search</button>
          </div>

        </div>
      </div>

      <div className="col-span-1"></div>

    </div>
    <div className="grid lg:grid-cols-5  sm:grid-cols-5 md:grid-cols-5 grid-cols-1">

      <div className="lg:col-span-1 md:col-span-1 sm:col-span-4  col-span-4 bg-white">
        <p className="bg-[#00B56C] px-4 py-1 text-white">Tips(0)</p>
      </div>

      <div className="lg:col-span-4  md:col-span-4  sm:col-span-5 col-span-4 ">
        <iframe style={{ height: '45.8em' }} className="w-full  overflow-hidden" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14480.14584461658!2d67.01494291377836!3d24.86260426589045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6d06bea525%3A0xca5759c73e8b99ce!2sSaddar%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1693470315983!5m2!1sen!2s" loading="lazy"></iframe>
      </div>

    </div>

  </div >
}







// export default function DualCam() {
//   return <div>
//     <p className="bg-[#00B56C] px-4 py-1 text-white">Video List</p>
//     <div className="grid grid-cols-3 mt-5">

//       <div className=" w-full  mx-4">

//         <label className=" text-sm text-[#00B56C]" >From</label><br></br>
//         <input type="date" className="mr-1 outline-none border-b-2 border-gray-400" name="bilal" />

//         <label className=" text-sm " style={{ marginTop: '-20%' }} >To</label>
//         <input type="date" className="mr-1 outline-none border-b-2 border-gray-400" name="bilal" />

//         <select className=" bg-transparent border-2 p-1 px-10 outline-none border-[#00B56C]-600">
//           <option>Select Vehicle</option>
//           <option>Uk</option>
//           <option>Uk</option>
//         </select>

//       </div>

//       <div className=" w-full ">

//         <p className="text-[#00B56C] ">File Type</p>

//         <input type="radio" className="w-3 h-3 mt-1 " name="bilal" />
//         <label className=" text-sm mt-1 ms-1" >Both</label> &nbsp;&nbsp;&nbsp;&nbsp;

//         <input type="radio" className="w-3 h-3 mt-1 " name="bilal" />
//         <label className=" text-sm mt-1 ms-1" >Photo</label> &nbsp;&nbsp;&nbsp;&nbsp;


//         <input type="radio" className="w-3 h-3 mt-1 " name="bilal" />
//         <label className=" text-sm mt-1 ms-1" >Video</label> &nbsp;&nbsp;&nbsp;&nbsp;

//         <button className="bg-[#00B56C] px-5 py-1 text-white text-start">Search</button>

//       </div>

//     </div>

//     <div className="flex flex-row px-4 py-6 ">
//     </div>


//     <div className="flex flex-row">

//       <div className="basis-1/4 bg-gray-50">
//         <p className="bg-[#00B56C] px-4 py-1 text-white">Media(0)</p>
//       </div>

//       <div className="basis-full ">

//         <iframe className="w-full" style={{ height: '75vh' }} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14480.14584461658!2d67.01494291377836!3d24.86260426589045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6d06bea525%3A0xca5759c73e8b99ce!2sSaddar%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1693470315983!5m2!1sen!2s" loading="lazy"></iframe>

//       </div>

//     </div>

//   </div>
// }
