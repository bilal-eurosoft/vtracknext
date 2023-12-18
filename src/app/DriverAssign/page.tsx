"use client";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { toast } from "react-hot-toast";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import {
  GetDriverDataByClientId,
  GetDriverDataAssignByClientId,
  postDriverDataAssignByClientId,
} from "@/utils/API_CALLS";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { vehicleListByClientId } from "@/utils/API_CALLS";
interface Column {
  id: "name" | "code" | "population" | "size" | "density";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Driver Number", minWidth: 170 },
  { id: "code", label: "Fisrt Name", minWidth: 100 },
  {
    id: "population",
    label: "Middle Name",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "Last Name",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "density",
    label: "Driver Id",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "density",
    label: "Driver Contact",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },

  {
    id: "density",
    label: "Driver Card",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },

  {
    id: "density",
    label: "Driver Address 1",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },

  {
    id: "density",
    label: "Driver Address 2",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },

  {
    id: "density",
    label: "Driver Aviability",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },
];

interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number
): Data {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData("India", "IN", 1324171354, 3287263),
  // createData('China', 'CN', 1403500365, 9596961),
  // createData('Italy', 'IT', 60483973, 301340),
  // createData('United States', 'US', 327167434, 9833520),
  // createData('Canada', 'CA', 37602103, 9984670),
  // createData('Australia', 'AU', 25475400, 7692024),
  // createData('Germany', 'DE', 83019200, 357578),
  // createData('Ireland', 'IE', 4857000, 70273),
  // createData('Mexico', 'MX', 126577691, 1972550),
  // createData('Japan', 'JP', 126317000, 377973),
  // createData('France', 'FR', 67022000, 640679),
  // createData('United Kingdom', 'GB', 67545757, 242495),
  // createData('Russia', 'RU', 146793744, 17098246),
  // createData('Nigeria', 'NG', 200962417, 923768),
  // createData('Brazil', 'BR', 210147125, 8515767),
];

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-100%)",
  width: 680,
  bgcolor: "background.paper",
  boxShadow: 24,
};

export default function DriverProfile() {
  const { data: session } = useSession();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [DriverList, setDriverList] = useState([]);
  const [vehicleNum, setvehicleNum] = useState([]);
  const [getAllAsignData, setgetAllAsignData] = useState<any>([]);
  const [selectedDriver, setSelectedDriver] = useState<any>({});
  const [selectVehicleNum, setSelectVehicleNum] = useState<any>({});
  useEffect(() => {
    const vehicleName = async () => {
      try {
        // setLaoding(true);
        if (session) {
          const response = await GetDriverDataByClientId({
            token: session?.accessToken,
            clientId: session?.clientId,
          });
          setDriverList(response);
        }
        // setLaoding(false);
      } catch (error) {
        console.error("Error fetching zone data:", error);
      }
    };
    vehicleName();
  }, [session]);

  console.log("data", getAllAsignData);
  useEffect(() => {
    const AllAsignData = async () => {
      try {
        // setLaoding(true);
        if (session) {
          const response = await GetDriverDataAssignByClientId({
            token: session?.accessToken,
            clientId: session?.clientId,
          });
          setgetAllAsignData(response);
        }
        // setLaoding(false);
      } catch (error) {
        console.error("Error fetching zone data:", error);
      }
    };
    AllAsignData();
  }, [session]);

  useEffect(() => {
    const vehicleNum = async () => {
      try {
        // setLaoding(true);
        if (session) {
          const response = await vehicleListByClientId({
            token: session?.accessToken,
            clientId: session?.clientId,
          });
          setvehicleNum(response);
        }
        // setLaoding(false);
      } catch (error) {
        console.error("Error fetching zone data:", error);
      }
    };
    vehicleNum();
  }, [session]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log("select Driver", selectedDriver);
    console.log("select Car Number", selectVehicleNum);

    if (session) {
      const newformdata: any = {
        selectedDriver,
        selectVehicleNum,
        clientId: session?.clientId,
      };

      const response = await toast.promise(
        postDriverDataAssignByClientId({
          token: session?.accessToken,
          newformdata: newformdata,
        }),

        {
          loading: "Saving data...",
          success: "Data saved successfully!",
          error: "Error saving data. Please try again.",
          
        },
        {
          style: {
            border: "1px solid #00B56C",
            padding: "16px",
            color: "#1A202C",
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: "#00B56C",
              secondary: "#FFFAEE",
            },
          },
          error: {
            duration: 2000,
            iconTheme: {
              primary: "#00B56C",
              secondary: "#FFFAEE",
            },
          },
        }
      );
    }
  };
  return (
    <div>
      <Paper sx={{ width: "98%" }} className="bg-green-50 ms-3 mr-3 mt-3">
        {/* <Button>Add New Driver</Button> */}
        <div className="flex lg: justify-center sm:justify-start">
          <button
            onClick={handleOpen}
            className="bg-[#00B56C] px-4 py-1 m-5 text-white rounded-md"
          >
            {" "}
            Assign To A Vehicle
          </button>
        </div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                className="text-black"
              >
                <p className="bg-[#00B56C]  px-4 text-white w-full ">
                  Assign vehicle to driver
                </p>
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                <form onSubmit={handleSubmit}>
                  l
                  <div className="grid grid-cols-3 m-6 mt-8">
                    <div className="lg:col-span-2 col-span-1 ">
                      <label className="text-gray-700 ">
                        <i className="text-red-500 mt-5">*</i> Drives:
                        <select
                          onChange={(e: any) => {
                            setSelectedDriver(
                              DriverList.find((item: any) => {
                                return item.id == e.target.value;
                              })
                            );
                          }}
                          className="h-8 w-10/12 border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-outoutline-none color-gray"
                        >
                          {DriverList &&
                            DriverList.map((item: any, i: any) => {
                              return (
                                <option value={item.id}>
                                  {item.driverfirstName}
                                </option>
                              );
                            })}
                        </select>
                      </label>
                    </div>

                    <div className="lg:col-span-1 col-span-1 ">
                      <label>
                        {" "}
                        <i className="text-red-500 mt-5">*</i> Vehicles:
                        <select
                          onChange={(e: any) => {
                            setSelectVehicleNum(
                              vehicleNum.find((item: any) => {
                                return item.id == e.target.value;
                              })
                            );
                          }}
                          className="h-8 w-7/12 border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-out"
                        >
                          {vehicleNum &&
                            vehicleNum.map((item: any) => {
                              return (
                                <option value={item.id}>
                                  {item.vehicleReg}
                                </option>
                              );
                            })}
                        </select>
                      </label>
                      <br></br>
                      <button
                        type="submit"
                        className="bg-[#00B56C]    px-4 py-1 mx-12 mt-10  text-center text-white rounded-md "
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </Typography>
            </Box>
          </Fade>
        </Modal>
        <TableContainer sx={{ height: 640 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  Driver Number
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  First Name
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  Middle Name
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  Last Name
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  Driver ID
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  Driver Contact
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  Driver Address 1
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  Driver Address 2
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-bgLight cursor-pointer  ">
              {getAllAsignData?.data?.map((row: any) => (
                <TableRow className="hover:bg-bgHoverTabel w-full">
                  <TableCell align="center" colSpan={2}>
                    {row.DriverDetails.driverNo}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {" "}
                    {row.DriverDetails.driverfirstName}
                  </TableCell>

                  <TableCell align="center" colSpan={2}>
                    {row.DriverDetails.driverMiddleName}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {row.DriverDetails.driverLastName}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {row.DriverDetails.driverIdNo}
                  </TableCell>
                  <TableCell>{row.DriverDetails.driverIdNo}</TableCell>
                  <TableCell align="center">
                    {row.DriverDetails.driverContact}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {row.DriverDetails.driverAddress1}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {row.DriverDetails.driverAddress2}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </div>
  );
}
