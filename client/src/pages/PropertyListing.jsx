import Listings from "../components/Listings";
import HouseImg from "../assets/Modern-House-PNG-Clipart.png";
import { Link } from "react-router-dom";

function PropertyLising() {
  return (
    <div className="px-[5%] lg:px-[10%] my-2">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <button className=" text-white bg-yellow-400 rounded-3xl px-6 py-1 font-medium text-sm">
          All
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Rent
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Sale
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Houses
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Apartments
        </button>

        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Sale
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Sale
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Sale
        </button>
      </div>
      <div className="overflow-x-auto no-scrollbar flex flex-col gap-4 my-[10%]">
        <Link to="/booking" state={{ preset: "consultation" }}>
          <div className="bg-yellow-400 w-full h-[180px] rounded-3xl relative overflow-hidden flex items-center">
            <div className="bg-[#232323] rounded-full h-[180px] w-[180px] absolute left-[70%] bottom-[30%]"></div>{" "}
            <div className="h-[180px] w-[250px] absolute left-[65%] top-[5%]">
              <img src={HouseImg} className="h-full w-full object-cover" />
            </div>
            <h3 className="text-4xl font-bold w-[70%] px-[6%]  text-black/90">
              Need Real Estate Advice?
            </h3>
          </div>{" "}
        </Link>
        <Listings smCols={1} lgCols={4} limit={8} />
      </div>
    </div>
  );
}

export default PropertyLising;
