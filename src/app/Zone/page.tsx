"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Link from "next/link";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Toaster, toast } from "react-hot-toast";
import {
  getZoneListByClientId,
  modifyCollectionStatus,
  zonevehicleByZoneId,
  zoneRuleDeleteByZoneId,
  zoneDelete,
  alertSettingCountZone,
  zonenamesearch,
} from "@/utils/API_CALLS";
import { zonelistType } from "@/types/zoneType";
import "./zone.css";

export default function Zone() {
  const [filter, setFilter] = useState<any>("");
  const [filteredItems, setFilteredItems] = useState([]);
  const { data: session } = useSession();
  const [zoneList, setZoneList] = useState<zonelistType[]>([]);
  const [selectedZoneTypeCircle, setselectedZoneTypeCircle] =
    useState<any>(false);
  const [selectedZoneTypPolyGone, setselectedZoneTypePolyGone] =
    useState<any>(false);

  // pagination work
  const [input, setInput] = useState<any>("");
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [filteredZones, setFilteredZones] = useState<zonelistType[]>([]);
  const [selectedZoneType, setSelectedZoneType] = useState<any>("");
  const [selectedZones, setSelectedZones] = useState<zonelistType[]>([]);
  const [liveSearchZoneName, setLiveSearchZoneName] = useState<
    string[] | undefined
  >([]);

  const [searchCriteria, setSearchCriteria] = useState<any>({
    zoneName: "",
    zoneShortName: "",
    GeoFenceType: "",
    zoneType: "",
  });
  const [rowsPerPage, setRowsPerPage] = useState<any>(5);
  const totalPages = Math.ceil(zoneList.length / rowsPerPage);

  const [filterZonepage, setFilterZonePage] = useState(1);
  const [filterZonePerPage, setfilterZonePerPage] = useState(5);
  const lastIndexFilter = filterZonePerPage * filterZonepage;
  const firstIndexFilter = lastIndexFilter - filterZonePerPage;
  const filterZoneResult = filteredZones.slice(
    firstIndexFilter,
    lastIndexFilter
  );
  const totalPagesFilter = Math.ceil(filteredZones.length / filterZonePerPage);

  const handleClickPagination = () => {
    setCurrentPage(input);
  };

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
    e.preventDefault();

    const { zoneName, zoneShortName, GeoFenceType } = searchCriteria;

    const filteredZone = zoneList.filter((zone) => {
      return (
        (zoneName === "" ||
          zone.zoneName.toLowerCase().includes(zoneName.toLowerCase())) &&
        (zoneShortName === "" ||
          zone.zoneShortName
            .toLowerCase()
            .includes(zoneShortName.toLowerCase())) &&
        (GeoFenceType === "" ||
          zone.GeoFenceType.toLowerCase() === GeoFenceType.toLowerCase()) &&
        (selectedZoneType === "" ||
          zone.zoneType.toLowerCase() === selectedZoneType.toLowerCase())
      );
    });

    setFilteredZones(filteredZone);
  }

  const handlePageChangeFiter = (event: any, newPage: any) => {
    setFilterZonePage(newPage);
  };

  const handleClickPaginationFilter = () => {
    setFilterZonePage(input);
  };

  const handleChangeRowsPerPageFilter = (event: any) => {
    setfilterZonePerPage(event.target.value);
    setFilterZonePage(1);
  };
  const handlePageChange = (event: any, newPage: any) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = zoneList.slice(startIndex, endIndex);

  const handleClick = () => {
    router.push("/AddZone");
  };

  const zoneTypeCircle = () => {
    zoneList.map((item) => {
      if (item.zoneType === "Circle") {
        setSelectedZoneType("Circle");
        setselectedZoneTypeCircle(true);
        setselectedZoneTypePolyGone(false);
      }
    });
  };

  const zoneTypePolygone = () => {
    zoneList.map((item) => {
      if (item.zoneType === "Polygon") {
        setSelectedZoneType("Polygon");
        setselectedZoneTypePolyGone(true);
        setselectedZoneTypeCircle(false);
      }
    });
  };

  const handleClear = (item: any) => {
    setSearchCriteria({
      zoneName: "",
      zoneShortName: "",
      GeoFenceType: "",
      zoneType: "",
    });
    // setSelectedZoneType(item);
    // setFilteredZones(filterZoneResult);
    setselectedZoneTypeCircle(false);
    setselectedZoneTypePolyGone(false);
    setZoneList(displayedData);
  };

  function handleCheckboxChange(zone: zonelistType) {
    const isChecked = selectedZones.some(
      (selectedZone) => selectedZone.id === zone.id
    );

    if (isChecked) {
      setSelectedZones((prevSelectedZones) =>
        prevSelectedZones.filter((selectedZone) => selectedZone.id !== zone.id)
      );
    } else {
      setSelectedZones((prevSelectedZones) => [...prevSelectedZones, zone]);
    }
  }
  async function handleLiveSearchChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setSearchCriteria({
      ...searchCriteria,
      zoneName: e.target.value,
    });
    let searchTerm = e.target.value;

    let query = searchTerm.toUpperCase();
    let filter = { zoneName: { $regex: query } };

    if (session) {
      try {
        let filterByZoneName = await zonenamesearch({
          token: session.accessToken,
          clientId: session.clientId,
          filter: filter,
        });

        if (Array.isArray(filterByZoneName)) {
          const zoneNames = filterByZoneName.map(
            (zone: { zoneName: string }) => zone.zoneName
          );
          setLiveSearchZoneName(zoneNames);
        } else {
          console.error("Invalid API response:", filterByZoneName);
          setLiveSearchZoneName([]);
        }
      } catch (error) {
        console.error("Error fetching live search results:", error);
        setLiveSearchZoneName([]);
      }
    }
  }

  async function deleteSelectedZones() {
    try {
      if (session) {
        const zoneIdsToDelete = selectedZones.map((zone) => zone.id);
        const deletePromises = [];
        for (const zoneId of zoneIdsToDelete) {
          const alertPromise = await alertSettingCountZone({
            token: session.accessToken,
            clientId: session.clientId,
            zoneId: zoneId,
          });

          const zoneDeletePromise = await zoneDelete({
            token: session.accessToken,
            id: zoneId,
          });
          const zoneRuleDeletePromise = await zoneRuleDeleteByZoneId({
            token: session.accessToken,
            id: zoneId,
          });

          const zoneVehicleDeletePromise = await zonevehicleByZoneId({
            token: session.accessToken,
            zoneId,
          });

          const modifyCollectionStatusPromise = await modifyCollectionStatus({
            token: session.accessToken,
            collectionName: "zones",
          });

          deletePromises.push(
            alertPromise,
            zoneDeletePromise,
            zoneRuleDeletePromise,
            zoneVehicleDeletePromise,
            modifyCollectionStatusPromise
          );
        }

        const loadingToast = await toast.loading("Deleting zones...");

        const responses = await Promise.all(deletePromises);

        toast.dismiss(loadingToast);

        const allSuccess = responses.every((response) => response.id !== null);

        if (allSuccess) {
          toast.success("Zones deleted successfully!");
        } else {
          toast.error("Error deleting zones. Please try again.");
        }

        const newZoneList = await getZoneListByClientId({
          token: session.accessToken,
          clientId: session.clientId,
        });

        setZoneList(newZoneList);
        setFilteredZones(newZoneList);
        setSelectedZones([]);
      }
    } catch (error) {
      console.error("Error deleting selected zones:", error);
      toast.error("An error occurred while deleting zones.");
    }
  }

  const handleFilterClicks = () => {
    const filtered: any = zoneList.filter(
      (item) => item.zoneName.toLowerCase() === filter.toLowerCase()
    );
    setFilteredItems(filtered);
  };

  return (
    <div className="mt-10 bg-bgLight mx-5">
      <form
        onSubmit={handleSearchClick}
        className="shadow-lg lg:w-full w-screen bg-bgLight lg:-ms-0 -ms-1"
      >
        <p className="bg-green px-4 py-1 text-black text-sm text-white font-bold">
          Zone Filter
        </p>
        <div className="grid lg:grid-cols-2 md:grid-cols-2  gap-6 pt-5 px-5  ">
          <div className="lg:col-span-1">
            <label className="text-sm text-labelColor">Zone Name</label>
            <select
              className=" px-2 py-1 mt-2 w-full text-sm text-black bg-white-10  border border-grayLight px-3 outline-green text-gray"
              id="selectBox"
              value={searchCriteria.zoneName}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  zoneName: e.target.value,
                })
              }
            >
              <option value=""> select Sort Name</option>
              {zoneList?.map((item, index) => (
                <option className="hover:bg-green" key={index}>
                  {item.zoneName}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-1 md:col-span-1 col-span-1">
            <label className="text-sm text-labelColor">Zone Short Name</label>
            <input
              type="text"
              name="zoneShortName"
              className="block py-1 mt-2 px-0 w-full text-sm text-black bg-white-10 border border-grayLight appearance-none px-3 text-gray dark:border-gray-600 dark:focus:border-blue-500 outline-green"
              placeholder="Enter Zone Short Name"
              value={searchCriteria.zoneShortName}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  zoneShortName: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 md:grid-cols-2   gap-6 pt-5 px-5 bg-green-50 ">
          <div className="lg:col-span-1">
            <label className="text-sm text-black text-labelColor">
              Geofence
            </label>
            <select
              className="block mt-2 py-1 px-0 w-full text-sm text-gray bg-white-10 border border-grayLight px-3 dark:border-gray-600 dark:focus:border-blue-500 outline-green mb-5"
              name="GeoFenceType"
              style={{ fontSize: "1em" }}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  GeoFenceType: e.target.value,
                })
              }
              value={searchCriteria.GeoFenceType}
            >
              <option value="" disabled selected hidden>
                Select Geofence Type
              </option>
              <option value="On-Site">On-Site</option>
              <option value="Off-Site">Off-Site</option>
              <option value="City-Area">City-Area</option>
              <option value="Restricted-Area">Restricted-Area</option>
            </select>
          </div>
          <div className="lg:col-span-1 md:col-span-1 col-span-1 text-sm text-black text-labelColor">
            <label className="">Zone Type</label>
            <br></br>
            <button
              className={`mt-3 border border-grayLight px-4 h-8 text-sm text-gray   ${
                selectedZoneTypeCircle && "bg-green text-white"
              } transition duration-300`}
              onClick={zoneTypeCircle}
            >
              Circle
            </button>

            <button
              className={`mt-3 border border-grayLight px-4 h-8 text-sm text-gray   ${
                selectedZoneTypPolyGone && "bg-green text-white"
              } transition duration-300`}
              onClick={zoneTypePolygone}
            >
              Polygon
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-2 px-5 lg:mt-0 mt-5">
          <div className="lg:col-span-1 md:col-span-1 sm:col-span-1   col-span-2">
            <div className="grid lg:grid-cols-8 md:grid-cols-3 grid-cols-2">
              <div className="grid lg:grid-cols-3 md:grid-cols-4 grid-cols-5 bg-green shadow-md hover:shadow-gray transition duration-500 cursor-pointer">
                <div className="lg:col-span-1 md:col-span-2  col-span-3">
                  <svg
                    className="h-10 py-3 w-full text-white"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <circle cx="10" cy="10" r="7" />{" "}
                    <line x1="21" y1="21" x2="15" y2="15" />
                  </svg>
                </div>
                <div className="lg:col-span-1 md:col-span-1  text-center">
                  <button
                    className="text-white text-start  h-10 bg-green  text-sm "
                    type="submit"
                    onClick={handleFilterClicks}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 lg:grid-cols-4 grid-cols-5 bg-zonebtnColor shadow-md ms-3 hover:shadow-gray transition duration-500 cursor-pointer">
                <div className="lg:col-span-2   md:col-span-3 col-span-3">
                  <svg
                    className="h-10 py-3 w-full text-labelColor"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="lg:col-span-1 md:col-span-1 col-span-1">
                  <button
                    className="text-labelColor text-sm  h-10 lg:-ms-2 -ms-6"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 md:col-span-1  col-span-2 lg:mt-0 md:mt-0 mt-3  flex justify-end mb-5">
            <div className="grid lg:grid-cols-2 md:grid-cols-3  grid-cols-2 cursor-pointer">
              <div
                className="grid lg:grid-cols-2 md:grid-cols-4 grid-cols-5 bg-green shadow-md hover:shadow-gray transition duration-500"
                onClick={handleClick}
              >
                <div className="lg:col-span-1 md:col-span-2 col-span-3">
                  <svg
                    className="h-10 py-3 w-full text-white"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <rect x="4" y="4" width="16" height="16" rx="2" />{" "}
                    <line x1="9" y1="12" x2="15" y2="12" />{" "}
                    <line x1="12" y1="9" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="col-span-1">
                  <button className="text-white  h-10 bg-[#00B56C] -ms-6 text-sm ">
                    AddZone
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 md:grid-cols-4  grid-cols-5 bg-zonebtnColor shadow-md hover:shadow-gray transition duration-500 ms-3 cursor-pointer">
                <div className="lg:col-span-1 md:col-span-2 col-span-3">
                  <svg
                    className="h-10 py-3 w-full text-labelColor"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <polyline points="3 6 5 6 21 6" />{" "}
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
                <div className="col-span-1">
                  <button
                    className="text-labelColor text-sm h-10 -ms-5 mr-4"
                    onClick={deleteSelectedZones}
                  >
                    DeleteZone
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="shadow-md">
        {/* <TableContainer component={Paper}>
          <p className="bg-green px-4 py-1 text-white font-bold lg:w-full w-screen ">
            ZoneTitle
          </p>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className="bg-zoneTabelBg  ">
                <TableCell className="w-4 h-4 border-r border-grayLight">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    style={{ accentColor: "green", boxShadow: "none" }}
                    className="w-4 h-4 text-blue-600 border-r border-grayLight bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 border-r border-grayLight "
                  />
                </TableCell>
                <TableCell align="left" className="border-r border-grayLight">
                  Zone Name
                </TableCell>
                <TableCell align="left" className="border-r border-grayLight">
                  Zone Sort Name
                </TableCell>
                <TableCell align="left" className="border-r border-grayLight">
                  Zone Type
                </TableCell>
                <TableCell align="left" className="border-r border-grayLight">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterZoneResult.length > 0 &&
                filterZoneResult.map((item: zonelistType) => (
                  <TableRow>
                    <TableCell
                      align="left"
                      className="w-4 h-4 border-r border-grayLight"
                    >
                      <input
                        id={`checkbox-table-search-${item.id}`}
                        style={{ accentColor: "green", boxShadow: "none" }}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={selectedZones.some(
                          (selectedZone) => selectedZone.id === item.id
                        )}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <label className="sr-only  text-labelColor text-md font-normal">
                        checkbox
                      </label>
                    </TableCell>
                    <TableCell
                      align="left"
                      className="border-r border-grayLight"
                    >
                      {item.zoneName}
                    </TableCell>
                    <TableCell
                      align="left"
                      className="border-r border-grayLight"
                    >
                      {item.zoneShortName}
                    </TableCell>
                    <TableCell
                      align="left"
                      className="border-r border-grayLight"
                    >
                      {item.zoneType}
                    </TableCell>
                    <TableCell
                      align="left"
                      className="border-r border-grayLight"
                    >
                      {" "}
                      <Link
                        className="font-medium text-green dark:text-blue-500 hover:underline"
                        href={`/EditZone?id=${item.id}`}
                      >
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer> */}

        {/* <div className="flex  justify-end lg:w-full w-screen bg-bgLight">
          <div className="grid lg:grid-cols-4 grid-cols-4  my-4 ">
            <div className="lg:col-span-1 col-span-1">
              <p className="mt-1 text-labelColor text-end">
                Total {filteredZones.length} items
              </p>
            </div>

            <div
              className="lg:col-span-2 col-span-2 "
              style={{
                height: "4vh",
                overflow: "hidden",
                justifyContent: "end",
              }}
            >
              <Stack spacing={2}>
                <Pagination
                  count={totalPagesFilter}
                  page={filterZonepage}
                  onChange={handlePageChangeFiter}
                  sx={{ color: "green" }}
                />
              </Stack>
            </div>
            <div className="lg:col-lg-1 col-lg-1  mt-1 ">
              <span className="lg:inline-block hidden">Go To</span>
              <input
                type="text"
                className="lg:w-10 w-5  border border-grayLight outline-green mx-2 px-2"
                onChange={(e: any) => setInput(e.target.value)}
              />
              <span
                className="text-labelColor cursor-pointer "
                onClick={handleClickPaginationFilter}
              >
                page &nbsp;&nbsp;
              </span>
            </div>
          </div>
          <div className="mt-2">
            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 20, 30, 40, 50, 100]}
              count={filteredZones.length}
              rowsPerPage={filterZonePerPage}
              onRowsPerPageChange={handleChangeRowsPerPageFilter}
            />
          </div>
        </div> */}
        <TableContainer component={Paper}>
          <p className="bg-green px-4 py-1 text-white font-bold lg:w-full w-screen ">
            ZoneTitle
          </p>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className="bg-zoneTabelBg  ">
                <TableCell className="w-4 h-4 border-r border-grayLight">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    style={{ accentColor: "green", boxShadow: "none" }}
                    className="w-4 h-4 text-blue-600 border-r border-grayLight bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 border-r border-grayLight "
                  />
                </TableCell>
                <TableCell align="left" className="border-r border-grayLight">
                  Zone Name
                </TableCell>
                <TableCell align="left" className="border-r border-grayLight">
                  Zone Sort Name
                </TableCell>
                <TableCell align="left" className="border-r border-grayLight">
                  Zone Type
                </TableCell>
                <TableCell align="left" className="border-r border-grayLight">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterZoneResult.length > 0 ? (
                <>
                  {" "}
                  {filterZoneResult.map((item: zonelistType) => (
                    <TableRow>
                      <TableCell
                        align="left"
                        className="w-4 h-4 border-r border-grayLight"
                      >
                        <input
                          id={`checkbox-table-search-${item.id}`}
                          style={{ accentColor: "green", boxShadow: "none" }}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          checked={selectedZones.some(
                            (selectedZone) => selectedZone.id === item.id
                          )}
                          onChange={() => handleCheckboxChange(item)}
                        />
                        <label className="sr-only  text-labelColor text-md font-normal">
                          checkbox
                        </label>
                      </TableCell>
                      <TableCell
                        align="left"
                        className="border-r border-grayLight"
                      >
                        {item.zoneName}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="border-r border-grayLight"
                      >
                        {item.zoneShortName}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="border-r border-grayLight"
                      >
                        {item.zoneType}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="border-r border-grayLight"
                      >
                        {" "}
                        <Link
                          className="font-medium text-green dark:text-blue-500 hover:underline"
                          href={`/EditZone?id=${item.id}`}
                        >
                          Edit
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {displayedData.map((item: any) => (
                    <TableRow>
                      <TableCell
                        align="left"
                        className="w-4 h-4 border-r border-grayLight"
                      >
                        <input
                          id="checkbox-all-search"
                          type="checkbox"
                          style={{ accentColor: "green", boxShadow: "none" }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 border-r border-grayLight "
                          checked={selectedZones.some(
                            (selectedZone) => selectedZone.id === item.id
                          )}
                          onChange={() => handleCheckboxChange(item)}
                        />
                      </TableCell>
                      <TableCell
                        align="left"
                        className="border-r border-grayLight"
                      >
                        {item.zoneName}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="border-r border-grayLight"
                      >
                        {item.zoneShortName}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="border-r border-grayLight"
                      >
                        {item.zoneType}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="border-r border-grayLight"
                      >
                        <Link
                          className="font-medium text-green text-center dark:text-blue-500 hover:underline"
                          href={`/EditZone?id=${item.id}`}
                        >
                          Edit
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {filterZoneResult.length > 0 ? (
          <div className="flex  justify-end lg:w-full w-screen bg-bgLight">
            <div className="grid lg:grid-cols-4 grid-cols-4  my-4 ">
              <div className="lg:col-span-1 col-span-1">
                <p className="mt-1 text-labelColor text-end">
                  Total {filteredZones.length} items
                </p>
              </div>

              <div
                className="lg:col-span-2 col-span-2 "
                style={{
                  height: "4vh",
                  overflow: "hidden",
                  justifyContent: "end",
                }}
              >
                <Stack spacing={2}>
                  <Pagination
                    count={totalPagesFilter}
                    page={filterZonepage}
                    onChange={handlePageChangeFiter}
                    sx={{ color: "green" }}
                  />
                </Stack>
              </div>
              <div className="lg:col-lg-1 col-lg-1  mt-1 ">
                <span className="lg:inline-block hidden">Go To</span>
                <input
                  type="text"
                  className="lg:w-10 w-5  border border-grayLight outline-green mx-2 px-2"
                  onChange={(e: any) => setInput(e.target.value)}
                />
                <span
                  className="text-labelColor cursor-pointer "
                  onClick={handleClickPaginationFilter}
                >
                  page &nbsp;&nbsp;
                </span>
              </div>
            </div>
            <div className="mt-2">
              <TablePagination
                component="div"
                rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
                count={filteredZones.length}
                rowsPerPage={filterZonePerPage}
                onRowsPerPageChange={handleChangeRowsPerPageFilter}
              />
            </div>
          </div>
        ) : (
          <div className="flex  justify-end lg:w-full w-screen bg-bgLight">
            <div className="grid lg:grid-cols-4 grid-cols-4  my-4 ">
              <div className="lg:col-span-1 col-span-1">
                <p className="mt-1 text-labelColor text-end">
                  Total {zoneList.length} items
                </p>
              </div>

              <div
                className="lg:col-span-2 col-span-2 "
                style={{
                  height: "4vh",
                  overflow: "hidden",
                  justifyContent: "end",
                }}
              >
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{ color: "green" }}
                  />
                </Stack>
              </div>
              <div className="lg:col-lg-1 col-lg-1  mt-1 ">
                <span className="lg:inline-block hidden">Go To</span>
                <input
                  type="text"
                  className="lg:w-10 w-5  border border-grayLight outline-green mx-2 px-2"
                  onChange={(e: any) => setInput(e.target.value)}
                />
                <span
                  className="text-labelColor cursor-pointer "
                  onClick={handleClickPagination}
                >
                  page &nbsp;&nbsp;
                </span>
              </div>
            </div>
            <div className="mt-2">
              <TablePagination
                component="div"
                rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
                count={zoneList.length}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* <div className="bg-gray-100    ">
          <p className="bg-green px-4 py-1 text-white font-bold lg:w-full w-screen ">
            ZoneTitle
          </p>
          <div className="relative shadow-md sm:rounded-lg ">
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-labelColor text-md font-bold  font-normal border-r border-grayLight "
                  >
                    zone Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-labelColor font-bold text-md font-normal border-r border-grayLight"
                  >
                    zone Short Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-labelColor font-bold text-md font-normal border-r border-grayLight"
                  >
                    zone Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-labelColor font-bold text-md font-normal"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.length > 0
                  ? filteredZones.map((item: zonelistType) => (
                      <tr
                        key={item.id}
                        className="bg-white border-b border-t  border-grayLight  hover:bg-zoneTabelBg"
                      >
                        <td className="w-4 p-4  border-r border-grayLight ">
                          <div className="flex items-center">
                            <input
                              id={`checkbox-table-search-${item.id}`}
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              checked={selectedZones.some(
                                (selectedZone) => selectedZone.id === item.id
                              )}
                              onChange={() => handleCheckboxChange(item)}
                            />
                            <label className="sr-only  text-labelColor text-md font-normal">
                              checkbox
                            </label>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="px-6 py-4  text-labelColor text-md font-normal border-r border-grayLight"
                        >
                          {item.zoneName}
                        </th>
                        <td className="px-6 py-4 text-labelColor text-md font-normal border-r border-grayLight">
                          {item.zoneShortName}
                        </td>
                        <td className="px-6 py-4 text-labelColor text-md font-normal border-r border-grayLight">
                          {item.zoneType}
                        </td>
                        <td className="flex items-center px-6 py-4 space-x-3">
                          <Link
                            className="font-medium text-green dark:text-blue-500 hover:underline"
                            href={`/EditZone?id=${item.id}`}
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  : records.map((item: zonelistType) => (
                      <tr
                        key={item.id}
                        className="bg-white border-b border-t  border-grayLight  hover:bg-zoneTabelBg"
                      >
                        <td className="w-4 p-4  border-r border-grayLight ">
                          <div className="flex items-center">
                            <input
                              id={`checkbox-table-search-${item.id}`}
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              checked={selectedZones.some(
                                (selectedZone) => selectedZone.id === item.id
                              )}
                              onChange={() => handleCheckboxChange(item)}
                            />
                            <label className="sr-only  text-labelColor text-md font-normal">
                              checkbox
                            </label>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="lg:px-6  py-4  text-labelColor lg:text-start sm:text-center text-center text-md font-normal border-r border-grayLight"
                        >
                          {item.zoneName}
                        </th>
                        <td className="lg:px-6 py-4 text-labelColor lg:text-start sm:text-center text-center text-md font-normal border-r border-grayLight">
                          {item.zoneShortName}
                        </td>
                        <td className="lg:px-6 py-4 text-labelColor lg:text-start  sm:text-center text-center text-md font-normal border-r border-grayLight">
                          {item.zoneType}
                        </td>
                        <td className="flex items-center  text-center  px-6 py-4 space-x-3">
                          <Link
                            className="font-medium text-green text-center dark:text-blue-500 hover:underline"
                            href={`/EditZone?id=${item.id}`}
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            <div className="flex  justify-end lg:w-full w-screen bg-bgLight">
              <div className="grid lg:grid-cols-4 grid-cols-4  my-4 ">
                <div className="lg:col-span-1 col-span-1">
                  <p className="mt-1 text-labelColor text-end">
                    Total {zoneList.length} items
                  </p>
                </div>

                <div
                  className="lg:col-span-2 col-span-2 "
                  style={{
                    height: "4vh",
                    overflow: "hidden",
                    justifyContent: "end",
                  }}
                >
                  <Stack spacing={2}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                    />
                  </Stack>
                </div>
                <div className="lg:col-lg-1 col-lg-1  mt-1 ">
                  <span className="lg:inline-block hidden">Go To</span>
                  <input
                    type="text"
                    className="lg:w-10 w-5  border border-grayLight outline-green mx-2 px-2"
                    onChange={(e: any) => setInput(e.target.value)}
                  />
                  <span
                    className="text-labelColor cursor-pointer "
                    onClick={handleClickPagination}
                  >
                    page &nbsp;&nbsp;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div> */}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
