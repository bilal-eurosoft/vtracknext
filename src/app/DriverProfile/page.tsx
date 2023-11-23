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
import { Toaster, toast } from "react-hot-toast";

import Button from "@mui/material/Button";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { postDriverDataByClientId } from "@/utils/API_CALLS";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
  top: "70%",
  left: "50%",
  transform: "translate(-50%,-100%)",
  width: 680,
  bgcolor: "background.paper",
  boxShadow: 24,
};

export default function DriverProfile() {
  const { data: session } = useSession();

  const [showCardNumber, setShowCardNumber] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = useState([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [formData, setFormDate] = useState({
    id: "",
    clientId: "61e6d00fd9cc7102ac6464a3",
    driverNo: "2",
    driverfirstName: "",
    driverMiddleName: "test",
    driverLastName: "test",
    driverContact: "1233434",
    driverIdNo: "12",
    driverAddress1: "test",
    driverAddress2: "test",
    driverRFIDCardNumber: "123444",
    isAvailabl: "yes",
  });
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // useEffect(() => {
  //   const func = async () => {
  //     const dataPost = await axios.post(
  //       "https://backend.vtracksolutions.com/v2/Driver"
  //     );
  //   };
  //   func();
  // }, []);

  const handleChangeDriver = (key: any, e: any) => {
    setFormDate({ ...formData, [key]: e.target.value });
  };

  const handleDriverSubmit = async (e: any) => {
    e.preventDefault();

    if (session) {
      const newformdata: any = {
        ...formData,
        clientId: session?.clientId,
      };

      const response = await toast.promise(
        postDriverDataByClientId({
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
      console.log("newdata", formData);
    }
    // const dataFetch = await axios.post(
    //   "https://backend.vtracksolutions.com/v2/Driver",
    //   formData
    // );
  };

  return (
    <div>
      {data.map((item: any, index) => {
        return (
          <div key={index}>
            <p>{item.driverfirstName}</p>
          </div>
        );
      })}
      <Paper sx={{ width: "98%" }} className="bg-green ms-3 mr-3 mt-3">
        <div className="grid lg:grid-cols-12 md:grid-cols-2  sm:grid-cols-2  p-4  bg-bgLight">
          <div className="lg:col-span-10 md:grid-col-span-1 sm:grid-col-span-1 lg:mb-0 flex lg: justify-center sm:justify-start mb-4 ">
            <button
              onClick={handleOpen}
              className="bg-green px-4 py-1  text-white rounded-md"
            >
              Add New Driver
            </button>
          </div>

          <div className="lg:col-span-2 md:grid-col-span-1 sm:grid-col-span-1 border-b border-grayLight  text-center ">
            <div className="grid grid-cols-12">
              <div className="col-span-1">
                <svg
                  className="h-5  w-5 text-gray mt-1"
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
              <div className="col-span-10">
                <input
                  type="text"
                  className=" border-none outline-none bg-transparent"
                  placeholder="Seacrch"
                />
              </div>
              <div className="col-span-1">
                <svg
                  className="h-5 w-5 text-gray mt-1"
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
                  <line x1="18" y1="6" x2="6" y2="18" />{" "}
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            </div>
          </div>
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
                <div className="grid grid-cols-12 bg-green">
                  <div className="col-span-11">
                    <p className="  p-3 text-white w-full ">Add Driver</p>
                  </div>
                  <div className="col-span-1">
                    <svg
                      className="h-6 w-6 text-labelColor mt-3"
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
                      <line x1="18" y1="6" x2="6" y2="18" />{" "}
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                </div>
              </Typography>
              <form onSubmit={handleDriverSubmit}>
                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                  <div
                    className="grid grid-cols-12 m-6 mt-8 gap-8 "
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div className="lg:col-span-3 col-span-1 ">
                      <label className="text-sm text-labelColor">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.driverfirstName}
                        className="border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-out "
                        onChange={(e: any) =>
                          handleChangeDriver("driverfirstName", e)
                        }
                      />
                    </div>
                    <div className="lg:col-span-3 col-span-1 ">
                      <label className="text-sm text-labelColor">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={formData.driverMiddleName}
                        className="border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-out "
                        onChange={(e: any) =>
                          handleChangeDriver("driverMiddleName", e)
                        }
                      />
                    </div>
                    <div className="lg:col-span-3 col-span-1 ">
                      <label className="text-sm text-labelColor">
                        <span className="text-red">*</span> Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.driverLastName}
                        className="border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-out "
                        onChange={(e: any) =>
                          handleChangeDriver("driverLastName", e)
                        }
                      />
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-12 m-6 mt-8 gap-8 "
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div className="lg:col-span-3 col-span-1 ">
                      <label className="text-sm text-labelColor">
                        Driver Number
                      </label>
                      <input
                        value={formData.driverNo}
                        type="text"
                        className="border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-out "
                        onChange={(e: any) => handleChangeDriver("driverNo", e)}
                      />
                    </div>
                    <div className="lg:col-span-3 col-span-1 ">
                      <label className="text-sm text-labelColor">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        value={formData.driverContact}
                        className="border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-out "
                        onChange={(e: any) =>
                          handleChangeDriver("driverContact", e)
                        }
                      />
                    </div>
                    <div className="lg:col-span-3 col-span-1 ">
                      <label className="text-sm text-labelColor">
                        ID Number
                      </label>
                      <input
                        type="text"
                        value={formData.driverIdNo}
                        className="border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-out "
                        onChange={(e: any) =>
                          handleChangeDriver("driverIdNo", e)
                        }
                      />
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-12 m-6 mt-8 gap-8 "
                    style={{ display: "flex", justifyContent: "start" }}
                  >
                    <div className="lg:col-span-2 col-span-1 ">
                      <label className="text-sm text-labelColor ">
                        RFID
                        <input
                          type="checkbox"
                          onClick={() => setShowCardNumber(!showCardNumber)}
                          style={{ accentColor: "green" }}
                          className="border border-green  outline-green  cursor-pointer ms-4  "
                        />
                      </label>
                    </div>
                    {showCardNumber ? (
                      <div className="lg:col-span-3 col-span-1 ">
                        <label className="text-sm text-labelColor">
                          Card Number
                        </label>
                        <br></br>
                        <input
                          type="text"
                          value={formData.driverRFIDCardNumber}
                          className="border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-out "
                          onChange={(e: any) =>
                            handleChangeDriver("driverRFIDCardNumber", e)
                          }
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="grid grid-cols-12 m-6 mt-8 gap-8 ">
                    <div className="col-span-6 col-span-1 ">
                      <label className="text-sm text-labelColor">
                        Address 1
                      </label>
                      <br></br>
                      <textarea
                        value={formData.driverAddress1}
                        className="w-full border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-out h-20 "
                        onChange={(e: any) =>
                          handleChangeDriver("driverAddress1", e)
                        }
                      ></textarea>
                      <button
                        className="bg-green text-white px-10 mt-8 py-2 rounded-sm"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                    <div className="col-span-6 col-span-1 ">
                      <label className="text-sm text-labelColor">
                        Address 2
                      </label>
                      <br></br>
                      <textarea
                        value={formData.driverAddress2}
                        className="w-full border border-grayLight  outline-green hover:border-green transition duration-700 ease-in-out h-20 "
                        onChange={(e: any) =>
                          handleChangeDriver("driverAddress2", e)
                        }
                      ></textarea>
                    </div>
                  </div>
                </Typography>
              </form>
            </Box>
          </Fade>
        </Modal>
        <TableContainer sx={{ height: 640 }} className="bg-bgLight">
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: "100%" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="bg-bgLight"
        />
      </Paper>
    </div>
  );
}
