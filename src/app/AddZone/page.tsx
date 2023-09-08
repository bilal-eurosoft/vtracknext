'use client'
export default function AddZone() {
  return <div className="mx-8 mt-8 shadow-lg bg-bgLight h-5/6 ">
    <p className="bg-[#00B56C] px-4 py-1 text-white">Zone Entry</p>
    <div className="grid lg:grid-cols-6  sm:grid-cols-5 md:grid-cols-5 grid-cols-1 pt-8 ">
      <div className="lg:col-span-1 md:col-span-1 sm:col-span-4  col-span-4 bg-gray-200 mx-5">
        <label className="text-gray text-sm"><span className="text-red">*</span> Please Enter Zone Name: </label>
        <input type="text" className="  block py-2 px-0 w-full text-sm text-grayLight bg-white-10 border border-grayLight appearance-none px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-green mb-5" placeholder="Enter Zone Name " required />
        <label className="text-gray text-sm"><span className="text-red">*</span> Geofence: </label>
        <select className="block py-2 px-0 w-full text-sm text-grayLight bg-white-10 border border-grayLight  px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 outline-green mb-5" placeholder="Enter Zone Name " required >
          <option>TEst</option>
          <option>TEst</option>
        </select>
        <label className="text-gray text-sm"><span className="text-red">*</span> Zone Short Name: </label>
        <input type="text" className="  block py-2 px-0 w-full text-sm text-grayLight bg-white-10 border border-grayLight appearance-none px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-green mb-5" placeholder="Enter Zone Name " required />
        <div className="flex justify-center">
          <div className="grid lg:grid-cols-2 grid-cols-2 bg-green w-24">
            <div className="col-span-1">
              <svg className="h-10 py-3 w-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />  <polyline points="17 21 17 13 7 13 7 21" />  <polyline points="7 3 7 8 15 8" /></svg>
            </div>
            <div className="col-span-1">
              <button className="text-white  h-10 bg-[#00B56C] -ms-2">Save</button>
            </div>
          </div>
        </div>
        <br></br>
      </div>
      <div className="lg:col-span-5  md:col-span-4  sm:col-span-5 col-span-4 mx-3">
        <label className="text-gray text-sm">please enter text to search </label>
        <input type="text" className="  block py-2 px-0 w-full text-sm text-grayLight bg-white-10 border border-grayLight appearance-none px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-green mb-5" placeholder="Search" required />
        <div className="flex justify-start">
          <div className="grid lg:grid-cols-2 grid-cols-2 bg-green w-auto">
            <div className="col-span-1">
              <svg className="h-10 py-3 w-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />  <polyline points="17 21 17 13 7 13 7 21" />  <polyline points="7 3 7 8 15 8" /></svg>
            </div>
            <div className="col-span-1">
              <button className="text-white  h-10 bg-[#00B56C] -ms-2 mx-4">Redrow</button>
            </div>
          </div>
        </div>
        <iframe style={{ height: '34em' }} className="w-full  mt-4 overflow-hidden" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14480.14584461658!2d67.01494291377836!3d24.86260426589045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6d06bea525%3A0xca5759c73e8b99ce!2sSaddar%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1693470315983!5m2!1sen!2s" loading="lazy"></iframe>
      </div>
    </div>
  </div >
}
