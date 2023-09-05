'use client'
import { useState } from "react"
export default function JourneyReplay() {
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
  return <div style={{height:'90vh'}}>
    <p className="bg-[#00B56C] px-4 py-1 text-white">JourneyReplay</p>
    <div className="grid lg:grid-cols-2  md:grid-cols-4  px-4 text-start">
      <div className="lg:col-span-1 md:col-span-3  py-5">
        <div className="grid lg:grid-cols-12 md:grid-cols-12 gap-5">
          <div className="lg:col-span-2 md:col-span-3">
            <select className=" w-full bg-transparent border-2 p-1 outline-none border-[#00B56C]-600">
              <option>Select Vehicle</option>
            </select>
          </div>
          <div className="lg:col-span-2 md:col-span-2 mt-1">
            <input type="radio" className="w-5 h-4  " name="bilal" />
            <label className=" " > &nbsp;&nbsp;Today</label>
          </div>
          <div className="lg:col-span-2 md:col-span-3 mt-1">
            <input type="radio" className="w-5 h-4  " name="bilal" />
            <label className=" " > &nbsp;&nbsp;Yesterday</label>
          </div>
          <div className="lg:col-span-2 md:col-span-2 mt-1">
            <input type="radio" className="w-5 h-4  " name="bilal" />
            <label className=" " > &nbsp;&nbsp;Week</label>
          </div>
          <div className="lg:col-span-2 md:col-span-2 mt-1">
            <input type="radio" className="w-5 h-4  " name="bilal" />
            <label className=" " > &nbsp;&nbsp;Custom</label>
          </div>
          <div className="lg:col-span-2 md:col-span-3 mt-1">
            <button className="bg-[#00B56C] px-5 text-white">Search</button>
          </div>
        </div>
      </div>
      <div className="col-span-1"></div>
    </div>
    <div className="grid lg:grid-cols-5  sm:grid-cols-5 md:grid-cols-5 grid-cols-1">
      <div className="lg:col-span-1 md:col-span-1 sm:col-span-4  col-span-4 bg-gray-200">
        <p className="bg-[#00B56C] px-4 py-1 text-white">Tips(0)</p>
      </div>
      <div className="lg:col-span-4  md:col-span-4  sm:col-span-5 col-span-4 ">
        <iframe style={{ height: '47em' }} className="w-full  overflow-hidden" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14480.14584461658!2d67.01494291377836!3d24.86260426589045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6d06bea525%3A0xca5759c73e8b99ce!2sSaddar%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1693470315983!5m2!1sen!2s" loading="lazy"></iframe>
      </div>
    </div>
  </div >
}
// export default function JourneyReplay() {
//   return <div>
//     <p className="bg-[#00B56C] px-4 py-1 text-white">Journey Replay</p>
//     <div className="flex flex-row px-4 py-6 ">
//       <div className="grid grid-cols-1 mr-8">
//         <select className=" bg-transparent border-2 p-1 outline-none border-[#00B56C]-600">
//           <option>Select Vehicle</option>
//           <option>Uk</option>
//           <option>Uk</option>
//         </select>
//       </div>
//       <div className="grid grid-cols-3">
//         <input type="radio" className="w-5 h-5 mt-1 " name="bilal" />
//         <label className="-ms-1 text-sm mt-1" >Today</label>
//       </div>
//       <div className="grid grid-cols-3">
//         <input type="radio" className="w-5 h-5 mt-1" name="bilal" />
//         <label className="-ms-3 text-sm mt-1" >Yesterday</label>
//       </div>
//       <div className="grid grid-cols-3">
//         <input type="radio" className="w-5 h-5 mt-1" name="bilal" />
//         <label className="-ms-1 text-sm mt-1" >Week</label>
//       </div>
//       <div className="grid grid-cols-7">
//         <input type="radio" className="w-5 h-5 mt-1" name="bilal" id="html" />
//         <label className="-ms-1 text-sm mt-1" >Custom</label>
//       </div>
//       <div className="grid grid-cols-2">
//         <button className="bg-[#00B56C] px-5 text-white">Search</button>
//       </div>
//     </div>
//     <div className="flex flex-row">
//       <div className="basis-1/4  bg-gray-50">
//         <p className="bg-[#00B56C] px-4 py-1 text-white">Tips(0)</p>
//       </div>
//       <div className="basis-full ">
//         <iframe className="w-full "  style={{ height: '80vh' }} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14480.14584461658!2d67.01494291377836!3d24.86260426589045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6d06bea525%3A0xca5759c73e8b99ce!2sSaddar%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1693470315983!5m2!1sen!2s" loading="lazy"></iframe>
//       </div>
//     </div>
//   </div>
// }
