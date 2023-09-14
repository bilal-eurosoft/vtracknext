"use client";
//zone
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getZoneListByClientId } from "@/utils/API_CALLS";
import { zonelistType } from "@/types/zoneType";
import Link from "next/link";

export default function Zone() {
  const { data: session } = useSession();
  const [zoneList, setZoneList] = useState<zonelistType[]>([]);
  const [active, setActive] = useState(false)
  const [inputs, setInputs] = useState("");

  useEffect(() => {
    (async function () {
      if (session) {
        const allzoneList = await getZoneListByClientId({
          token: session?.accessToken,
          clientId: session?.clientId,
        });
        setZoneList(allzoneList);
      }
    })();
  }, []);

  const router = useRouter();

  function handleSearchClick(e: React.FormEvent<HTMLFormElement>) {
    if (inputs === "") {
      setZoneList(zoneList);
      return;
    }
    e.preventDefault();
    const filterBySearch = zoneList.filter((item) => {
      if (
        item?.zoneName?.toLowerCase().includes(inputs.toLowerCase()) ||
        item?.zoneShortName?.toLowerCase().includes(inputs.toLowerCase()) ||
        item?.zoneType.toLowerCase().includes(inputs.toLowerCase())
      )
        return item;
    });

    setZoneList(filterBySearch);
  }
  const handleClick = () => {
    router.push("/AddZone");
  };


  const toggleBtn = () => {
    setActive(!active)
  }




  return (
    <div className="mt-10 bg-bgLight">
      <form onSubmit={handleSearchClick}>
        <p className="bg-green px-4 py-1 text-white text-sm">Zone Filter</p>
        <div className="grid lg:grid-cols-2 md:grid-cols-2  gap-6 pt-5 px-5 bg-green-50 ">
          <div className="lg:col-span-1">
            <label className="text-sm text-labelColor">Zone Name</label>
            <input
              type="text"
              className="block py-1 mt-2 px-0 w-full text-sm text-labelColor bg-white-10 border border-grayLight appearance-none px-3 dark:text-white text-labelColor  outline-green"
              placeholder="Enter Zone Name "
              required
              onChange={(e) => setInputs(e.target.value)}
            />
          </div>
          <div className="lg:col-span-1 md:col-span-1 col-span-1">
            <label className="text-sm text-labelColor">Zone Short Name</label>
            <input
              type="text"
              className="block py-1 mt-2 px-0 w-full text-sm text-labelColor bg-white-10 border border-grayLight appearance-none px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 text-labelColor  outline-green"
              placeholder="Enter Zone Short Name"
              required
              onChange={(e) => setInputs(e.target.value)}

            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 md:grid-cols-2   gap-6 pt-5 px-5 bg-green-50 ">
          <div className="lg:col-span-1">
            <label className="text-sm text-labelColor">Geofence</label>
            <select
              className="block mt-2 py-1 px-0 w-full text-sm text-labelColor bg-white-10 border border-grayLight  px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 outline-green mb-5 text-labelColor "
              placeholder="Geofence Type "
              required
              style={{ fontSize: '1em' }}
              onChange={(e) => setInputs(e.target.value)}

            >
              <option style={{ height: '20vh' }} >On-Site</option>
              <option >Off-Site</option>
              <option>City-Area</option>
              <option>Restriced-Area</option>
            </select>
          </div>
          <div className="lg:col-span-1 md:col-span-1 col-span-1 text-sm text-labelColor">
            <label className="">Zone Type</label>
            <br></br>
            <span onClick={toggleBtn}>
              {active ? <button className=" mt-3 border border-grayLight px-4 h-8 text-sm text-labelColor bg-white transition duration-300">
                Circle
              </button>
                : <button className=" mt-3 border border-grayLight px-4 h-8 text-sm text-white bg-green transition duration-300" >
                  Circle
                </button>
              }
            </span>
            <span onClick={toggleBtn}>
              {active ? <button className=" mt-3 border border-grayLight px-4 h-8 text-sm text-white bg-green transition duration-300" >
                Polygon
              </button>
                : <button className=" mt-3 border border-grayLight px-4 h-8 text-sm text-labelColor bg-white transition duration-300" >
                  Polygon
                </button>
              }
            </span>

          </div>
        </div>

        <div className="grid grid-cols-2 px-5" >
          <div className="col-span-1">
            <div className="grid grid-cols-8">

              <div className="grid lg:grid-cols-2 grid-cols-3 bg-green shadow-md hover:shadow-gray transition duration-500">
                <div className="col-span-1">
                  <svg className="h-10 py-3 w-full text-white" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="10" cy="10" r="7" />  <line x1="21" y1="21" x2="15" y2="15" /></svg>
                </div>
                <div className="col-span-1">
                  <button className="text-white  h-10 bg-[#00B56C] -ms-4 text-sm" type="submit">Search</button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 grid-cols-3 bg-zonebtnColor shadow-md ms-3 hover:shadow-gray transition duration-500">
                <div className="col-span-1">
                  <svg className="h-10 py-3 w-full text-labelColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />

                  </svg>
                </div>
                <div className="col-span-1">
                  <button className="text-labelColor text-sm  h-10 -ms-3">clear</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 flex justify-end">
            <div className="grid grid-cols-2">

              <div className="grid lg:grid-cols-2 grid-cols-3 bg-green shadow-md hover:shadow-gray transition duration-500" onClick={handleClick}>
                <div className="col-span-1">
                  <svg className="h-10 py-3 w-full text-white" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <rect x="4" y="4" width="16" height="16" rx="2" />  <line x1="9" y1="12" x2="15" y2="12" />  <line x1="12" y1="9" x2="12" y2="15" /></svg>
                </div>
                <div className="col-span-1">
                  <button className="text-white  h-10 bg-[#00B56C] -ms-6 text-sm ">AddZone</button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 grid-cols-3 bg-zonebtnColor shadow-md hover:shadow-gray transition duration-500 ms-3">
                <div className="col-span-1">
                  <svg className="h-10 py-3 w-full text-labelColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <polyline points="3 6 5 6 21 6" />  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </div>
                <div className="col-span-1">
                  <button className="text-labelColor text-sm  h-10  -ms-5 mr-4">DeleteZone</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </form>

      <br></br>
      <div className="bg-gray-100  mx-4  " >
        <p className="bg-[#00B56C] px-4 py-1 text-white ">ZoneTitle</p>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-96 h-96">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-zoneTabelBg dark:bg-gray-700 dark:text-gray-400 ">
              <tr>
                <th scope="col" className="p-4 border-r border-grayLight">
                  <div className="flex items-center ">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 border-r border-grayLight "
                    />
                    <label className="sr-only text-labelColor">checkbox</label>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-labelColor text-md font-bold  font-normal border-r border-grayLight ">
                  zone Name
                </th>
                <th scope="col" className="px-6 py-3 text-labelColor font-bold text-md font-normal border-r border-grayLight">
                  zone Short Name
                </th>
                <th scope="col" className="px-6 py-3 text-labelColor font-bold text-md font-normal border-r border-grayLight">
                  zone Type
                </th>
                <th scope="col" className="px-6 py-3 text-labelColor font-bold text-md font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {zoneList?.map((item: zonelistType) => (
                <tr
                  key={item.id}
                  className="bg-white border-b border-t  border-grayLight  hover:bg-zoneTabelBg"
                >
                  <td className="w-4 p-4  border-r border-grayLight ">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label className="sr-only  text-labelColor text-md font-normal">checkbox</label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4  text-labelColor text-md font-normal border-r border-grayLight"
                  >
                    {item.zoneName}
                  </th>
                  <td className="px-6 py-4 text-labelColor text-md font-normal border-r border-grayLight">{item.zoneShortName}</td>
                  <td className="px-6 py-4 text-labelColor text-md font-normal border-r border-grayLight">{item.zoneType}</td>
                  <td className="flex items-center px-6 py-4 space-x-3">


                    <Link
                      className="font-medium text-green dark:text-blue-500 hover:underline"
                      href={`/AddZone?id=${item.id}`}

                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
