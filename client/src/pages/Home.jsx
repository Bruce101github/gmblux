import Listings from "../components/Listings";
import { PhoneCall, SlidersHorizontal } from "lucide-react";

function Home() {
  return (
    <div className="px-[10%]">
      <div className="flex items-end mb-4 gap-x-4">
        <div className="bg-white/15 rounded-3xl shadow px-6 py-10 h-[400px] max-w-[300px] flex flex-col justify-end">
          <div className="h-[70px] w-[70px] bg-white/5 rounded-full p-5 mb-5 flex flex-col justify-left items-end">
            <PhoneCall className="h-full w-full object-cover" />
          </div>
          <p className="text-2xl font-medium min-w-[200px]">
            Start smart, start with a consultation this October.
          </p>
        </div>
        <div className="w-full">
          <h2 className="text-white text-5xl font-md ml-5 mb-5">
            Listed Properties
          </h2>
          <Listings />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 ">
        <div className="bg-white rounded-xl p-4  flex gap-x-2 items-center">
          <div className="h-[60px] w-[60px] rounded-full bg-blue-300 "></div>
          <div>
            <h3 className="text-blue-600 text-xl font-bold ">
              Property Management
            </h3>
            <p className="text-black text-sm">
              Hassle-free management for your investments.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 flex gap-4 items-center">
          <div className="h-[60px] w-[60px] rounded-full bg-blue-300 flex justify-center items-center">
            <PhoneCall />
          </div>
          <div>
            <h3 className="text-blue-600 text-lg font-bold">
              Fast & Easy Booking
            </h3>
            <p className="text-black text-sm ">
              Schedule your consultation quickly and conveniently.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 flex gap-x-2 items-center">
          <div className="h-[60px] w-[60px] rounded-full bg-blue-300"></div>
          <div>
            <h3 className="text-blue-600 text-lg font-bold">
              Property Listings
            </h3>
            <p className="text-black text-sm">
              Browse handpicked properties for every need.
            </p>
          </div>
        </div>
      </div>
      <div className="my-[100px]">
        <div className="flex justify-between my-10">
          <div className="flex gap-4">
            <button className="bg-yellow-400 rounded-3xl py-2 px-6 font-bold">
              Rent
            </button>
            <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-2">
              Sale
            </button>
          </div>
          <div className="">
            <button>
              <SlidersHorizontal />
            </button>
          </div>
        </div>
        <Listings lgCols={4} limit={8} />
      </div>
    </div>
  );
}

export default Home;
