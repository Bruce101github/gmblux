import Listings from "../components/Listings";
import HouseImg from "../assets/Modern-House-PNG-Clipart.png";
import { Link } from "react-router-dom";
import Pills from "@/components/Pills";
import { useState, useEffect } from "react";

function PropertyLising() {
  const [filters, setFilters] = useState({
    type: "sale", // rent / sale / all
    bedrooms: null, // e.g. 2
    bathrooms: null, // e.g. 3
    propertyType: null, // e.g. "apartment", "house"
  });
  useEffect(() => {}, [filters]);

  return (
    <div className="px-[5%] lg:px-[10%] my-2">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Pills filters={filters} setFilters={setFilters} />
      </div>
      <div className="overflow-x-auto no-scrollbar flex flex-col gap-4 my-[10%]">
        <Link to="/booking" state={{ preset: "consultation" }}>
          <div className="bg-yellow-400 w-full h-[180px] rounded-3xl relative overflow-hidden flex items-center">
            <div className="bg-[#232323] rounded-full h-[180px] w-[180px] absolute left-[70%] bottom-[30%]"></div>{" "}
            <div className="h-[180px] w-[250px] absolute left-[65%] top-[5%]">
              <img src={HouseImg} className="h-full w-full object-cover" />
            </div>
            <h3 className="text-4xl font-bold w-[70%] px-[6%]  text-white/90">
              Need Real Estate Advice?
            </h3>
          </div>{" "}
        </Link>
        <Listings
          smCols={1}
          lgCols={4}
          limit={8}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </div>
  );
}

export default PropertyLising;
