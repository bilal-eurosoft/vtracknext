import logo from "@/../public/Images/logo.png";
import Image from "next/image";

export default function DashBoard() {
  return (
    <div>
      <div className="flex flex-row">
        <div className="basis-20 py-3 bg-[#29303b] h-screen">
          <button
            type="button"
            data-te-toggle="tooltip"
            data-te-placement="right"
            data-te-ripple-init
            data-te-ripple-color="light"
            title="aWQiOjEyMDd9&"
          >
            <svg
              className="w-20 h-14 py-3  border-y-2 mt-12  text-[white]  text-white-10 dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          <button
            type="button"
            data-te-toggle="tooltip"
            data-te-placement="right"
            data-te-ripple-init
            data-te-ripple-color="light"
            title="aWQiOjEyMDd9&"
          >
            <svg
              className="w-20 h-14 py-3  border-y-2 -my-2  text-[white]  text-white-10  dark:text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <circle cx="12" cy="12" r="10" />{" "}
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
          </button>

          <button
            type="button"
            data-te-toggle="tooltip"
            data-te-placement="right"
            data-te-ripple-init
            data-te-ripple-color="light"
            title="aWQiOjEyMDd9&"
          >
            <svg
              className="w-20 h-14 py-3  border-y-2   text-[white]  text-white-10  dark:text-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
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
          </button>

          <button
            type="button"
            data-te-toggle="tooltip"
            data-te-placement="right"
            data-te-ripple-init
            data-te-ripple-color="light"
            title="aWQiOjEyMDd9&"
          >
            <svg
              className="w-20 h-14 py-3  border-y-2 -my-2  text-[white]  text-white-10  dark:text-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <circle cx="6" cy="6" r="2" /> <circle cx="18" cy="18" r="2" />{" "}
              <path d="M11 6h5a2 2 0 0 1 2 2v8" />{" "}
              <polyline points="14 9 11 6 14 3" />{" "}
              <path d="M13 18h-5a2 2 0 0 1 -2 -2v-8" />{" "}
              <polyline points="10 15 13 18 10 21" />
            </svg>
          </button>

          <button
            type="button"
            data-te-toggle="tooltip"
            data-te-placement="right"
            data-te-ripple-init
            data-te-ripple-color="light"
            title="aWQiOjEyMDd9&"
          >
            <svg
              className="w-20 h-14 py-3  border-y-2  text-[white]  text-white-10  dark:text-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <circle cx="7" cy="17" r="2" /> <circle cx="17" cy="17" r="2" />{" "}
              <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
            </svg>
          </button>
        </div>
        <hr></hr>

        <div className="basis-1/1 w-screen">
          <nav className="flex items-center justify-between flex-wrap bg-gray-50 p-4">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
              <Image src={logo} className="h-9 w-32" alt="" />
            </div>
            <div className="block lg:hidden">
              <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                <svg
                  className="fill-current h-3 w-3"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Menu</title>
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
              </button>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center text-end lg:w-auto">
              <div className="text-sm lg:flex-grow">
                <a
                  href="#responsive-header"
                  className="block mt-4 lg:inline-block lg:mt-0 text-[#00B56C]  mr-4"
                >
                  Tester{" "}
                  <span className="text-black">
                    {" "}
                    &nbsp; 8/30/2023, 2:25:59 PM
                  </span>
                </a>

                <a
                  href="#responsive-header"
                  className="block mt-4 lg:inline-block lg:mt-0   mr-4"
                >
                  <select className="w-20 bg-transparent border-2 border-[#00B56C]-600">
                    <option>Uk</option>
                    <option>Uk</option>
                    <option>Uk</option>
                  </select>
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="inline-block text-sm px-4 py-2 leading-none lg:mt-0"
                >
                  <img
                    className="inline-block h-10 -my-4 w-10 rounded-full ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
