import Listings from "../components/Listings";
import { useSearch } from "../components/SearchContext";
import { useState, useEffect } from "react";

function Search() {
  const [properties, setProperties] = useState([]);
  const { searchTerm, submittedSearch } = useSearch();

  useEffect(() => {}, [submittedSearch]);

  return (
    <div className="px-[5%] lg:px-[10%] my-2">
      <div className="my-5">
        <h2 className="text-2xl text-white font-medium">{submittedSearch}</h2>
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
        />
      </div>
    </div>
  );
}

export default Search;
