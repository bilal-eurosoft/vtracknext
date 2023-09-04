export default function JourneyReplay() {
  return <div>
    <p className="bg-[#00B56C] px-4 py-1 text-white">Journey Replay</p>

    <div className="flex flex-row px-4 py-6 ">

      <div className="grid grid-cols-1 mr-8">
        <select className=" bg-transparent border-2 p-1 outline-none border-[#00B56C]-600">
          <option>Select Vehicle</option>
          <option>Uk</option>
          <option>Uk</option>
        </select>
      </div>

      <div className="grid grid-cols-3">
        <input type="radio" className="w-5 h-5 mt-1 " name="bilal" />
        <label className="-ms-1 text-sm mt-1" >Today</label>
      </div>

      <div className="grid grid-cols-3">
        <input type="radio" className="w-5 h-5 mt-1" name="bilal" />
        <label className="-ms-3 text-sm mt-1" >Yesterday</label>
      </div>

      <div className="grid grid-cols-3">
        <input type="radio" className="w-5 h-5 mt-1" name="bilal" />
        <label className="-ms-1 text-sm mt-1" >Week</label>
      </div>

      <div className="grid grid-cols-7">
        <input type="radio" className="w-5 h-5 mt-1" name="bilal" id="html" />
        <label className="-ms-1 text-sm mt-1" >Custom</label>
      </div>

      <div className="grid grid-cols-2">
        <button className="bg-[#00B56C] px-5 text-white">Search</button>
      </div>

    </div>


    <div className="flex flex-row">

      <div className="basis-1/4  bg-gray-50">
        <p className="bg-[#00B56C] px-4 py-1 text-white">Tips(0)</p>
      </div>

      <div className="basis-full ">

        <iframe className="w-full "  style={{ height: '80vh' }} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14480.14584461658!2d67.01494291377836!3d24.86260426589045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6d06bea525%3A0xca5759c73e8b99ce!2sSaddar%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1693470315983!5m2!1sen!2s" loading="lazy"></iframe>

      </div>

    </div>

  </div>
}
