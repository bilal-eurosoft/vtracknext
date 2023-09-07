export default function Reports() {
  return <div>
    <form className="container mx-auto lg:max-w-screen-lg">
      <div className=" bg-green-50 mt-20">
        <div className="grid grid-cols-1 " >
          <p className="bg-[#00B56C] px-4 py-3 rounded-md text-white ">Reports Filter</p>
        </div>
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 mt-5 mb-8  grid-cols-2 pt-5 px-10 gap-2 flex justify-center">
          <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 col-span-2 ">
            <label>Report Type: &nbsp;&nbsp;
              <select className="h-8 lg:w-4/6 w-full  border-2 boder-gray-100 bg-white outline-none">
                <option>Uk</option>
                <option>Uk</option>
              </select>
            </label>
          </div>
          <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 col-span-2 lg:mt-0 md:mt-0 sm:mt-0 mt-4">
            <label >Vehicle: &nbsp;&nbsp;
              <select className="h-8 lg:w-4/6 w-full border-2 boder-gray-100 bg-white outline-none">
                <option>Uk</option>
                <option>Uk</option>
              </select>
            </label>
          </div>
        </div>
        <div className="container grid lg:grid-cols-8  mb-5 md:grid-cols-6 sm:grid-cols-5 gap-5 lg:text-center lg:mx-52 md:mx-24 sm:mx-10  flex justify-center">
          <div className="lg:col-span-1 md:col-span-1 sm:col-span-1">
            <input type="radio" className="w-5 h-4  " name="bilal" />
            <label className=" " > &nbsp;&nbsp;Today</label>
          </div>
          <div className="lg:col-span-1 md:col-span-1 sm:col-span-1">
            <input type="radio" className="w-5 h-4  " name="bilal" />
            <label className=" " > &nbsp;&nbsp;Yesterday</label>
          </div>
          <div className="lg:col-span-1 md:col-span-1">
            <input type="radio" className="w-5 h-4  " name="bilal" />
            <label className=" " > &nbsp;&nbsp;Week</label>
          </div>
          <div className="lg:col-span-1 md:col-span-1">
            <input type="radio" className="w-5 h-4  " name="bilal" />
            <label className=" " > &nbsp;&nbsp;Custom</label>
          </div>
        </div>
        <div className="text-white h-20 flex justify-center items-center" >
          <button className="bg-green-500 py-2 px-5 mb-5">submit</button>
        </div>
      </div>
    </form>
  </div>
}
