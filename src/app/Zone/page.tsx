"use client"
import { useRouter } from "next/navigation";

export default function Zone() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/AddZone')
  }
  return <div>
    <form>
      <div className="mx-4">
        <p className="bg-[#00B56C] px-4 py-1 text-white">Zone</p>
        <div className="grid lg:grid-cols-2 md:grid-cols-2  gap-6 pt-5 px-5 bg-green-50 ">
          <div className="lg:col-span-1">
            <label className="">Zone name</label>
            <input type="text" className="block py-2 px-0 w-full text-sm text-grayLight bg-white-10 border-0 border-2 border-gray-200 appearance-none px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none " placeholder="Enter Zone Name " required />
          </div>
          <div className="lg:col-span-1 md:col-span-1 col-span-1">
            <label className="">Zone sort name</label>
            <input type="text" className="block py-2 px-0 w-full text-sm text-grayLight bg-white-10 border-0 border-2 border-grayLight-200 appearance-none px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none " placeholder="Enter Zone Name " required />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 md:grid-cols-2  gap-6 pt-5 px-5 bg-green-50 ">
          <div className="lg:col-span-1">
            <label>Geofence</label>
            <select className="block py-2 px-0 w-full text-sm text-grayLight bg-white-10 border-0 border-2 border-gray-200 appearance-none px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 outline-none " placeholder="Enter Zone Name " required >
              <option>TEst</option>
              <option>TEst</option>
            </select>
          </div>
          <div className="lg:col-span-1 md:col-span-1 col-span-1">
            <label className="">Zone Type</label><br></br>
            <button className=" border-2 border-grayLight px-4 h-10">Circle</button>
            <button className=" border-2 border-grayLight px-4 h-10">Polygon</button>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 md:grid-cols-2  gap-6 pt-5 px-5 bg-green-50 ">
          <div className="lg:col-span-1">
            <div className="text-start">
              <button className="text-white px-4 h-10 bg-[#00B56C] mr-3">Search</button>
              <button className="text-gray px-7 h-10 bg-white border-2 border-gray-200">Clear</button>
            </div>
          </div>
          <div className="lg:col-span-1 md:col-span-1 col-span-1">

            <div className="lg:text-end sm:text-start text-start ">
              <button className="text-white px-4 h-10 bg-[#00B56C] mr-3" onClick={handleClick}>Add Zone</button>
              <button className="text-gray px-7 h-10 bg-white border-2 border-gray-200">Delete Zone</button>
            </div>
            <br></br>
          </div>
        </div>
      </div><br></br>
    </form>
    <div className="bg-gray-100  mx-4">
      <p className="bg-[#00B56C] px-4 py-1 text-white ">Zone</p>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Color
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Accesories
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label className="sr-only">checkbox</label>
                </div>
              </td>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4">
                Silver
              </td>
              <td className="px-6 py-4">
                Laptop
              </td>

              <td className="flex items-center px-6 py-4 space-x-3">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input id="checkbox-table-search-2" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label className="sr-only">checkbox</label>
                </div>
              </td>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Microsoft Surface Pro
              </th>
              <td className="px-6 py-4">
                White
              </td>
              <td className="px-6 py-4">
                Laptop PC
              </td>
              <td className="flex items-center px-6 py-4 space-x-3">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input id="checkbox-table-search-3" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label className="sr-only">checkbox</label>
                </div>
              </td>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Magic Mouse 2
              </th>
              <td className="px-6 py-4">
                Black
              </td>
              <td className="px-6 py-4">
                Accessories
              </td>
              <td className="flex items-center px-6 py-4 space-x-3">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input id="checkbox-table-search-3" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label className="sr-only">checkbox</label>
                </div>
              </td>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Apple Watch
              </th>
              <td className="px-6 py-4">
                Black
              </td>
              <td className="px-6 py-4">
                Watches
              </td>
              <td className="flex items-center px-6 py-4 space-x-3">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
}