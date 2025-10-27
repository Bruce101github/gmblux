import Listings from "../components/Listings";
import { useSearch } from "../components/SearchContext";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import Filter from "@/components/Filter";

function Search({ filters, setFilters, filterOpen, setFilterOpen }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };
    if (document.readyState === "complete") {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  const [properties, setProperties] = useState([]);
  const { searchTerm, submittedSearch } = useSearch();

  useEffect(() => {}, [submittedSearch]);

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
      <div className="my-5">
        <h2 className="text-2xl text-white font-medium">
          Search "{submittedSearch}"
        </h2>
        <p className="text-white/50">
          {properties.length} Properties are found!
        </p>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <Listings
          smCols={1}
          lgCols={4}
          limit={8}
          search={submittedSearch}
          properties={properties}
          setProperties={setProperties}
          setFilters={setFilters}
          filters={filters}
        />
      </div>
    </div>
  );
}

export default Search;
