/* eslint-disable @next/next/no-img-element */
"use client";
// import { Inter } from "next/font/google";
import logo from "@/../public/Images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Typography,
  Tooltip,
} from "@material-tailwind/react";

import BlinkingTime from "../General/BlinkingTime";
// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState(false);
  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    // onMouseLeave: () => setOpenPopover(false),
  };

  const { data: session } = useSession();

  if (!session) {
    router.push("/login");
  }

  return (
    // <div className={inter.className}>
    <div>
      <div>
        <div className="flex flex-row">
          <div className="basis-20 py-6 bg-[#29303b] h-screen hidden md:block">
            <Link href="/liveTracking">
              <Tooltip
                className="bg-white text-[#00B56C] shadow-lg rounded"
                placement="right"
                content="Live Map"
              >
                <svg
                  className="w-20 h-14 py-3  border-y-2 mt-12  text-[white]  text-white-10 dark:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Tooltip>
            </Link>
            <Link href="/journeyReplay">
              <Tooltip
                className="bg-white text-[#00B56C] shadow-lg rounded"
                placement="right"
                content="Journey Replay"
              >
                <svg
                  className="w-20 h-14 py-3  -my-1  text-[white]  text-white-10  dark:text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <circle cx="12" cy="12" r="10" />{" "}
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
              </Tooltip>
            </Link>
            <Link href="/Zone">
              <Tooltip
                className="bg-white text-[#00B56C] rounded shadow-lg"
                placement="right"
                content="Zone"
              >
                <svg
                  className="w-20 h-14 py-3  border-y-2   text-[white]  text-white-10  dark:text-white"
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
                  <circle cx="12" cy="12" r=".5" fill="currentColor" />{" "}
                  <circle cx="12" cy="12" r="7" />{" "}
                  <line x1="12" y1="3" x2="12" y2="5" />{" "}
                  <line x1="3" y1="12" x2="5" y2="12" />{" "}
                  <line x1="12" y1="19" x2="12" y2="21" />{" "}
                  <line x1="19" y1="12" x2="21" y2="12" />
                </svg>
              </Tooltip>
            </Link>
            <Link href="/DualCam">
              <Tooltip
                className="bg-white text-[#00B56C] shadow-lg rounded"
                placement="right"
                content="Dual Cam"
              >
                <svg
                  className="w-20 h-12 py-2  text-[white]  text-white-10  dark:text-white"
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
                  <circle cx="6" cy="6" r="2" />{" "}
                  <circle cx="18" cy="18" r="2" />{" "}
                  <path d="M11 6h5a2 2 0 0 1 2 2v8" />{" "}
                  <polyline points="14 9 11 6 14 3" />{" "}
                  <path d="M13 18h-5a2 2 0 0 1 -2 -2v-8" />{" "}
                  <polyline points="10 15 13 18 10 21" />
                </svg>
              </Tooltip>
            </Link>
            <Link href="/Reports">
              <Tooltip
                className="bg-white text-[#00B56C] shadow-lg rounded"
                placement="right"
                content="Reports"
              >
                <svg
                  className="w-20 h-14 py-3 border-y-2 text-[white] text-white-10  dark:text-white"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 7V2.13a2.98 2.98 0 0 0-1.293.749L4.879 5.707A2.98 2.98 0 0 0 4.13 7H9Z" />
                  <path d="M18.066 2H11v5a2 2 0 0 1-2 2H4v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 20 20V4a1.97 1.97 0 0 0-1.934-2ZM10 18a1 1 0 1 1-2 0v-2a1 1 0 1 1 2 0v2Zm3 0a1 1 0 0 1-2 0v-6a1 1 0 1 1 2 0v6Zm3 0a1 1 0 0 1-2 0v-4a1 1 0 1 1 2 0v4Z" />
                </svg>
              </Tooltip>
            </Link>
          </div>
          <hr></hr>
          <div className="basis-1/1 w-screen">
            <nav className="flex items-center justify-between flex-wrap bg-gray-50 p-4">
              <div className="flex items-center flex-shrink-0 text-white mr-6">
                <Image src={logo} className="h-9 w-32" alt="" />
              </div>
              <div className="block lg:hidden">
                {/* <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                  <svg
                    className="fill-current h-3 w-3"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                  </svg>
                </button> */}
              </div>
              <div className="w-full block flex-grow lg:flex lg:items-center text-end lg:w-auto">
                <div className="text-sm lg:flex-grow">
                  <a className="block mt-4 lg:inline-block lg:mt-0 text-[#00B56C]  ">
                    <span className="text-black">
                      {" "}
                      &nbsp;
                      <span className="text-1xl">
                        {" "}
                        <span className="text-[#00B56C] ">
                          {session?.clientName}
                        </span>
                      </span>
                    </span>
                  </a>
                  <a className="block mt-4 lg:inline-block lg:mt-0 text-black-500  w-44 mr-8">
                    <BlinkingTime timezone={session?.timezone} />
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="inline-block text-sm px-6 py-2 leading-none lg:mt-0"
                  ></a>
                  <Popover open={openPopover} handler={setOpenPopover}>
                    <PopoverHandler {...triggers}>
                      <img
                        className=" cursor-pointer -mt-6 w-10 h-10 rounded-full"
                        src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                        alt="Rounded avatar"
                      />
                    </PopoverHandler>
                    <PopoverContent {...triggers} className="z-50 w-80">
                      <div className="mb-2 flex items-center gap-3 px-20">
                        <Typography
                          as="a"
                          href="#"
                          variant="h6"
                          color="blue-gray"
                          className="font-medium transition-colors hover:text-gray-900 w-full"
                        >
                          <img
                            className="ms-auto mr-auto mt-5 mb-5 w-10 h-10 rounded-full"
                            src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                            alt="Rounded avatar"
                          />
                        </Typography>
                      </div>
                      <Typography
                        variant="small"
                        color="gray"
                        className="font-normal "
                      >
                        <p className="text-2xl mb-3 text-center">
                          Bilal Hussain
                        </p>
                        <hr></hr>
                        <div className="flex justify-center">
                          <button
                            className="bg-[#00B56C] px-5 py-3 text-white mt-5"
                            onClick={() => {
                              signOut();
                            }}
                          >
                            Sign Out
                          </button>
                        </div>
                      </Typography>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </nav>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
