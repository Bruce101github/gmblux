import Listings from "../components/Listings";
import { useSearch } from "../components/SearchContext";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoadingOverlay from "@/components/LoadingOverlay";
import Filter from "@/components/Filter";

function Search({ filters, setFilters, filterOpen, setFilterOpen }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optimize loading - reduce delay for smoother experience
    const handleLoad = () => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 150);
      return () => clearTimeout(timer);
    };
    if (document.readyState === "complete") {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  const [properties, setProperties] = useState([]);
  const { searchTerm, submittedSearch } = useSearch();

  useEffect(() => {}, [submittedSearch]);

  return (
    <div className="px-[5%] lg:px-[10%] my-2">
      <LoadingOverlay loading={loading} />
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
