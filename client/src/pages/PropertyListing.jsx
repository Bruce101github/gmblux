import Listings from "../components/Listings";
import HouseImg from "../assets/Modern-House-PNG-Clipart.png";
import { Link, useLocation } from "react-router-dom";
import Pills from "@/components/Pills";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import Filter from "@/components/Filter";
import { useSearch } from "@/components/SearchContext";

function PropertyLising({ setFilters, filters, setFilterOpen, filterOpen }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = HouseImg;
    img.onload = () => setImgLoaded(true);
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      if (imgLoaded) {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    if (document.readyState === "complete" && imgLoaded) {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, [imgLoaded]);

  const [properties, setProperties] = useState([]);
  const { searchTerm, submittedSearch } = useSearch();
  const location = useLocation();
  const presetFilter = location.state?.preset;


  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      listingType: presetFilter || "all",
    }));
  }, []);

  if (loading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#121420] transition-opacity duration-400 ${
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Spinner size={64} variant={"ring"} className="text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="px-[5%] lg:px-[10%] my-2">
      {filterOpen ? (
        <Filter
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          setFilters={setFilters}
          filters={filters}
        />
      ) : null}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Pills filters={filters} setFilters={setFilters} />
      </div>
      <h2 className="text-2xl text-white font-medium mt-4">
        {submittedSearch && properties.length > 0
          ? `Search "${submittedSearch}"`
          : null}
      </h2>
      <p className="text-white/50">
        {submittedSearch && properties.length > 0
          ? `${properties.length} Properties are found!`
          : null}
      </p>
      <div className="overflow-x-auto no-scrollbar flex flex-col gap-4 mt-[5%] mb-[100px]">
        <Link to="/booking" state={{ preset: "consultation" }}>
          {!submittedSearch && properties.length > 0 ? (
            <div className="bg-yellow-400 w-full h-[180px] rounded-3xl relative overflow-hidden flex items-center">
              <div className="bg-[#232323] rounded-full h-[180px] w-[180px] absolute left-[70%] bottom-[30%]"></div>{" "}
              <div className="h-[180px] w-[250px] absolute left-[65%] top-[5%]">
                <img src={HouseImg} className="h-full w-full object-cover" />
              </div>
              <h3 className="text-4xl font-bold w-[70%] px-[6%]  text-white/90">
                Need Real Estate Advice?
              </h3>
            </div>
          ) : null}{" "}
        </Link>
        <Listings
          smCols={1}
          lgCols={4}
          filters={filters}
          setFilters={setFilters}
          search={submittedSearch}
          setProperties={setProperties}
          properties={properties}
        />
      </div>
    </div>
  );
}

export default PropertyLising;
