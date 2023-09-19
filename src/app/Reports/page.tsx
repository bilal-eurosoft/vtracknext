"use client";
import { vehicleListByClientId } from "@/utils/API_CALLS";
import { useSession } from "next-auth/react";
import { DeviceAttach } from "@/types/vehiclelistreports";
import { IgnitionReport } from "@/types/IgnitionReport";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import {
  IgnitionReportByTrip,
  IgnitionReportByDailyactivity,
  IgnitionReportByIgnition,
  IgnitionReportByEvents,
  IgnitionReportByDetailReport,
  IgnitionReportByIdlingActivity,
} from "@/utils/API_CALLS";

export default function Reports() {
  const { data: session } = useSession();
  const [vehicleList, setVehicleList] = useState<DeviceAttach[]>([]);
  const [isCustomPeriod, setIsCustomPeriod] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState<Boolean>(false);
  const [Ignitionreport, setIgnitionreport] = useState<IgnitionReport>({
    TimeZone: session?.timezone || "",
    VehicleReg: "",
    clientId: session?.clientId || "",
    fromDateTime: "",
    period: "",
    reportType: "",
    toDateTime: "",
    unit: "Mile",
  });

  useEffect(() => {
    const vehicleListData = async () => {
      try {
        if (session) {
          const Data = await vehicleListByClientId({
            token: session.accessToken,
            clientId: session?.clientId,
          });

          setVehicleList(Data);
        }
      } catch (error) {
        console.error("Error fetching zone data:", error);
      }
    };
    vehicleListData();
  }, [session]);

  let currentTime = new Date().toLocaleString("en-US", {
    timeZone: session?.timezone,
  });

  let timeOnly = currentTime.split(",")[1].trim();
  timeOnly = timeOnly.replace(/\s+[APap][Mm]\s*$/, "");

  const [hours, minutes, seconds] = timeOnly
    .split(":")
    .map((part) => part.trim());

  const formattedHours = hours.padStart(2, "0");
  const formattedMinutes = minutes.padStart(2, "0");
  const formattedSeconds = seconds.padStart(2, "0");
  const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  const parsedDateTime = new Date(currentTime);
  const formattedDateTime = `${parsedDateTime
    .toISOString()
    .slice(0, 10)}TO${timeOnly}`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setIgnitionreport((prevReport: any) => ({
      ...prevReport,
      [name]: value,
    }));

    if (name === "period" && value === "custom") {
      setIsCustomPeriod(true);
    } else {
      setIsCustomPeriod(false);
    }
  };

  const handleCustomDateChange = (fieldName: string, date: string) => {
    setIgnitionreport((prevReport: any) => ({
      ...prevReport,
      [fieldName]: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (session) {
      const { reportType, VehicleReg, period } = Ignitionreport;

      if (reportType && VehicleReg && period) {
        let newdata = { ...Ignitionreport };

        const apiFunctions: Record<
          string,
          (data: {
            token: string;
            clientId: string;
            payload: any;
          }) => Promise<any>
        > = {
          Trip: IgnitionReportByTrip,
          DailyActivity: IgnitionReportByDailyactivity,
          Ignition: IgnitionReportByIgnition,
          Events: IgnitionReportByEvents,
          DetailReportByStreet: IgnitionReportByDetailReport,
          IdlingActivity: IgnitionReportByIdlingActivity,
        };

        if (apiFunctions[newdata.reportType]) {
          const apiFunction = apiFunctions[newdata.reportType];
          if (isCustomPeriod) {
            newdata = {
              ...newdata,
              fromDateTime: `${Ignitionreport.fromDateTime}T${formattedTime}Z`,
              toDateTime: `${Ignitionreport.toDateTime}T${formattedTime}Z`,
            };
          } else {
            newdata = {
              ...newdata,
              fromDateTime: formattedDateTime,
              toDateTime: formattedDateTime,
            };
          }

          try {
            const response = await toast.promise(
              apiFunction({
                token: session.accessToken,
                clientId: session.clientId,
                payload: newdata,
              }),
              {
                loading: "Loading...",
                success: "",
                error: "",
              },
              {
                style: {
                  border: "1px solid #00B56C",
                  padding: "16px",
                  color: "#1A202C",
                },
                success: {
                  duration: 10,
                  iconTheme: {
                    primary: "#00B56C",
                    secondary: "#FFFAEE",
                  },
                },
                error: {
                  duration: 10,
                  iconTheme: {
                    primary: "#00B56C",
                    secondary: "#FFFAEE",
                  },
                },
              }
            );

            if (response.success === true) {
              toast.success(`${response.message}`, {
                style: {
                  border: "1px solid #00B56C",
                  padding: "16px",
                  color: "#1A202C",
                },
                duration: 4000,
                iconTheme: {
                  primary: "#00B56C",
                  secondary: "#FFFAEE",
                },
              });

              setTimeout(() => {
                let pdfWindow = window.open("");

                pdfWindow?.document.write(
                  "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                    response.data[0].reportString +
                    "'></iframe>"
                );
              }, 2000);
            } else {
              toast.error(`${response.message}`, {
                style: {
                  border: "1px solid red",
                  padding: "16px",
                  color: "red",
                },
                iconTheme: {
                  primary: "red",
                  secondary: "white",
                },
              });
            }
          } catch (error) {
            console.error(
              `Error calling API for ${newdata.reportType}:`,
              error
            );
          }
        } else {
          console.error(`API function not found for ${newdata.reportType}`);
        }
      } else {
        console.error(
          "Please fill in all three fields: reportType, VehicleReg, and period"
        );

        toast.error(
          "Please fill in all three fields: reportType, VehicleReg, and period",
          {
            style: {
              border: "1px solid #00B56C",
              padding: "16px",
              color: "#1A202C",
            },
            iconTheme: {
              primary: "#00B56C",
              secondary: "#FFFAEE",
            },
          }
        );
      }
    }
  };

  return (
    <div>
      <form
        className="container mx-auto lg:max-w-screen-lg bg-[#E2E8F0]"
        onSubmit={handleSubmit}
      >
        <div className="bg-green-50 mt-20">
          <div className="grid grid-cols-1">
            <p className="bg-[#00B56C] px-4 py-3 rounded-md text-white">
              Reports Filter
            </p>
          </div>
          <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 mt-5 mb-8  grid-cols-2 pt-5 px-10 gap-2 flex justify-center ">
            <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 col-span-2 ">
              <label>
                Report Type: &nbsp;&nbsp;
                <select
                  className="h-8 lg:w-4/6 w-full  border-2 boder-gray-100 bg-white outline-none"
                  name="reportType"
                  value={Ignitionreport.reportType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Report Type</option>
                  <option value="Trip">Trip</option>
                  <option value="DailyActivity">Daily Activity</option>
                  <option value="Ignition">Ignition</option>
                  <option value="Events">Events</option>
                  <option value="DetailReportByStreet">
                    Detail Report By Street
                  </option>
                  <option value="IdlingActivity">Idling Activity</option>
                </select>
              </label>
            </div>
            {isCustomPeriod && (
              <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 col-span-2 mt-4">
                <label>
                  From Date:
                  <input
                    type="date"
                    className="h-8 w-full border-2 border-gray-100 bg-white outline-none"
                    name="fromDateTime"
                    value={Ignitionreport.fromDateTime}
                    onChange={(e) =>
                      handleCustomDateChange("fromDateTime", e.target.value)
                    }
                  />
                </label>
                <label>
                  To Date:
                  <input
                    type="date"
                    className="h-8 w-full border-2 border-gray-100 bg-white outline-none"
                    name="toDateTime"
                    value={Ignitionreport.toDateTime}
                    onChange={(e) =>
                      handleCustomDateChange("toDateTime", e.target.value)
                    }
                  />
                </label>
              </div>
            )}

            <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 col-span-2 lg:mt-0 md:mt-0 sm:mt-0 mt-4">
              <label>
                Vehicle: &nbsp;&nbsp;
                <select
                  className="h-8 lg:w-4/6 w-full border-2 boder-gray-100 bg-white outline-none"
                  name="VehicleReg"
                  value={Ignitionreport.VehicleReg}
                  onChange={handleInputChange}
                >
                  <option value="">Select Vehicle Name</option>
                  {vehicleList.map((item: DeviceAttach) => (
                    <option key={item.id} value={item.vehicleReg}>
                      {item.vehicleNo} (Reg#{item.vehicleReg})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="container grid lg:grid-cols-8  mb-5 md:grid-cols-6 sm:grid-cols-5 gap-5 lg:text-center lg:mx-52 md:mx-24 sm:mx-10  flex justify-center">
            <div className="lg:col-span-1 md:col-span-1 sm:col-span-1">
              <input
                type="radio"
                className="w-5 h-4"
                name="period"
                value="today"
                checked={Ignitionreport.period === "today"}
                onChange={handleInputChange}
              />
              <label> &nbsp;&nbsp;Today</label>
            </div>
            <div className="lg:col-span-1 md:col-span-1 sm:col-span-1">
              <input
                type="radio"
                className="w-5 h-4"
                name="period"
                value="yesterday"
                checked={Ignitionreport.period === "yesterday"}
                onChange={handleInputChange}
              />
              <label> &nbsp;&nbsp;Yesterday</label>
            </div>
            <div className="lg:col-span-1 md:col-span-1">
              <input
                type="radio"
                className="w-5 h-4"
                name="period"
                value="week"
                checked={Ignitionreport.period === "week"}
                onChange={handleInputChange}
              />
              <label> &nbsp;&nbsp;Week</label>
            </div>
            <div className="lg:col-span-1 md:col-span-1">
              <input
                type="radio"
                className="w-5 h-4"
                name="period"
                value="custom"
                checked={Ignitionreport.period === "custom"}
                onChange={handleInputChange}
              />
              <label> &nbsp;&nbsp;Custom</label>
            </div>
          </div>

          <div className="text-white h-20 flex justify-center items-center">
            <button
              className={`bg-[#00B56C] py-2 px-5 mb-5 ${
                !Ignitionreport.reportType ||
                !Ignitionreport.VehicleReg ||
                !Ignitionreport.period
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              type="submit"
              disabled={
                !Ignitionreport.reportType ||
                !Ignitionreport.VehicleReg ||
                !Ignitionreport.period
              }
            >
              submit
            </button>
          </div>
        </div>
      </form>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
