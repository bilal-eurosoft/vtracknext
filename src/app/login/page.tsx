"use client";
import { useState } from "react";
import logo from "../../../public/Images/logo.png";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleClick = async () => {
    const { userName, password } = formData;
    const data = await signIn("credentials", {
      userName,
      password,
      redirect: false,
    });
    if (data?.status === 200) {
      router.push("/liveTracking");
    }
  };

  return (
    <div
      className=" w-100 h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url(Images/bgiamge.jpg)" }}
    >
      <div className="block w-100 h-screen h-auto justify-center flex items-center">
        <div className="bg-[#ffffff] sm:mx-auto mt-20 mb-20 w-full sm:max-w-lg lg:px-5">
          <Image
            className=" mt-9 mx-auto h-14 w-auto"
            src={logo}
            alt="Your Company"
          />
          <p className="mt-5 text-center font-serif text-5xl  leading-9 tracking-tight text-gray-900">
            Welcome Back!
          </p>

          <label className=" text-center block text-sm font-seri leading-6 text-gray-400">
            Log In To Get{" "}
          </label>

          <form className="space-y-6" action="#" method="POST">
            <div>
              <div className="mt-6">
                <input
                  id="userName"
                  required
                  placeholder="account_code@username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#00B56C] sm:text-sm sm:leading-6 px-3 outline-none"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <input
                  id="password"
                  required
                  type="password"
                  placeholder="●●●●●●●●●●"
                  className="block w-full rounded-md border-0  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#00B56C] sm:text-sm sm:leading-6 outline-none  px-3"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <br></br>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#00B56C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-8"
                onClick={handleClick}
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
