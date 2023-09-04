export default function Reports() {
  return <div>

    <form className="flex justify-center ">

      <div className=" bg-green-50 mt-20">

        <div className="grid grid-cols-1 " >
          <p className="bg-[#00B56C] px-4 py-1 text-white ">Reports Filter</p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-2  text-center  ms-10 md:gap-6  mt-5 mx-4">

            <label>Enter your name: &nbsp;&nbsp;
              <select className="h-8 w-80 border-2 boder-gray-100 bg-white outline-none">
                <option>Uk</option>
                <option>Uk</option>
              </select>
            </label>

            <div className=" z-0 mb-6 group">
              <label>Vehicle: &nbsp;&nbsp;
                <select className="h-8 w-80 border-2 boder-gray-100 bg-white outline-none">
                  <option>Uk</option>
                  <option>Uk</option>
                </select>
              </label>
            </div>

          </div>

        </div>
        <div className="text-white  flex justify-center items-center mt-10 mb-10" >
          <div className="grid grid-cols-3">
            <input type="radio" className="w-5 h-5 mt-1 " name="bilal" />
            <label className="-ms-1 text-sm mt-1 text-gray-500" >Today</label>
          </div>

          <div className="grid grid-cols-3">
            <input type="radio" className="w-5 h-5 mt-1" name="bilal" />
            <label className="-ms-3 text-sm mt-1 text-gray-500"  >Yesterday</label>
          </div>

          <div className="grid grid-cols-3">
            <input type="radio" className="w-5 h-5 mt-1" name="bilal" />
            <label className="-ms-1 text-sm mt-1 text-gray-500" >Week</label>
          </div>

          <div className="grid grid-cols-3">
            <input type="radio" className="w-5 h-5 mt-1" name="bilal" id="html" />
            <label className="-ms-1 text-sm mt-1 text-gray-500" >Custom</label>
          </div>
        </div>
        <div className="text-white h-20 flex justify-center items-center" >
          <button className="bg-green-500 py-2 px-5 mb-5">Sign Out</button>
        </div>

      </div>

    </form>

    <div className="sm:container sm:mx-auto grid grid-cols-3 md:grid-cols-2 lg:grid-cols-1 ">
      <p className="bg-[#00B56C] px-4 py-1 text-white ">Reports Filter</p>
    </div>



  </div>
}
