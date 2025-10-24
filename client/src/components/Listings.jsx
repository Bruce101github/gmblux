import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Bed, ShowerHead, LandPlot } from "lucide-react";
import { Link } from "react-router-dom";

function Listings({
  lgCols = 3,
  smCols = 1,
  limit = 3,
  search = "",
  properties: propsProperties,
  setProperties: propsSetProperties,
  filters,
  setFilters,
}) {
  const [localProperties, setLocalProperties] = useState([]);

  // Use passed-in props if available, else fallback to local state
  const properties = propsProperties ?? localProperties;
  const setProperties = propsSetProperties ?? setLocalProperties;
  let query = supabase.from("properties").select("*");

  const lgGridClass =
    {
      1: "lg:grid-cols-1",
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
    }[lgCols] || "lg:grid-cols-3";

  const smGridClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3 min-w-[1000px]",
    }[smCols] || "grid-cols-3";

  useEffect(() => {
    fetchProperties(search, filters, setFilters);
  }, [search, filters]);

  async function fetchProperties(search, filters, setFilters) {
    console.log("Received search term in fetchProperties:", search);
    console.log("This is the filters", filters);
    let query = supabase.from("properties").select("*");

    if (filters?.type) {
      if (filters.type.toLowerCase() === "all") {
        query = query.neq("listing_type", "none");
      } else {
        query = query.eq("listing_type", filters.type.toLowerCase());
      }
    }

    if (filters?.bedrooms != null) {
      query = query.eq("bedrooms", filters.bedrooms);
    }

    if (filters?.bathrooms != null) {
      query = query.eq("bathrooms", filters.bathrooms);
    }

    if (filters?.propertyType != null) {
      query = query.eq("property_type", filters.propertyType.toLowerCase());
    }

    let { data, error } = await query;

    // if no search, show all properties
    if (!search || search.trim() === "") {
      const result = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching all:", error);
        return [];
      }
      setProperties(data);
      return;
    }

    // full-text search using the fts column
    const result = await supabase
      .from("properties")
      .select("*")
      .textSearch("fts", search, {
        config: "english",
        type: "websearch", // allows natural queries like “3 bedroom house”
      })
      .order("created_at", { ascending: false });

    data = result.data;
    error = result.error;

    if (error) {
      console.error("Error fetching search results:", error);
      return [];
    }
    setProperties(data);
    return;
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${lgGridClass}  ${smGridClass}  gap-4 m-0 `}
    >
      {properties.slice(0, limit).map((p) => (
        <Link to={`/listing/${p.id}`}>
          <div
            key={p.id}
            className="bg-white/15 rounded-3xl shadow p-4 text-white"
          >
            <img
              src={p.images?.[0]}
              alt={p.title}
              className="w-full h-[200px] object-cover rounded-2xl"
            />
            <h2 className="text-md font-medium mt-2 text-white">{p.title}</h2>
            <p className="text-white/60 text-sm">{p.location}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-3 text-xs items-center">
                <div className="flex text-white gap-1.5 items-center">
                  <div className="text-blue-500">
                    <Bed size={16} />
                  </div>{" "}
                  {p.bedrooms}
                </div>{" "}
                <div className="flex">
                  {" "}
                  <div className="text-blue-500">
                    <ShowerHead size={16} />
                  </div>
                  {p.bathrooms}
                </div>{" "}
                <div className="flex">
                  <div className="text-blue-500">
                    <LandPlot size={16} />
                  </div>{" "}
                  {p.size}
                </div>
              </div>
              <p className="mt-2 font-bold text-blue-500">
                {p.listing_type === "rent"
                  ? `GH₵${Number(p.price).toLocaleString("en-GH")}/month`
                  : `USD$${Number(p.price).toLocaleString("en-GH")}`}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function smallLisings() {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${lgGridClass}  ${smGridClass}  gap-4 m-0 `}
    >
      {properties.slice(0, limit).map((p) => (
        <Link to={`/listing/${p.id}`}>
          <div
            key={p.id}
            className="bg-white/15 rounded-3xl shadow p-4 text-white"
          >
            <img
              src={p.images?.[0]}
              alt={p.title}
              className="w-full h-[200px] object-cover rounded-2xl"
            />
            <h2 className="text-md font-medium mt-2 text-white">{p.title}</h2>
            <p className="text-white/60 text-sm">{p.location}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-3 text-xs items-center">
                <div className="flex text-white gap-1.5 items-center">
                  <div className="text-blue-500">
                    <Bed size={16} />
                  </div>{" "}
                  {p.bedrooms}
                </div>{" "}
                <div className="flex">
                  {" "}
                  <div className="text-blue-500">
                    <ShowerHead size={16} />
                  </div>
                  {p.bathrooms}
                </div>{" "}
                <div className="flex">
                  <div className="text-blue-500">
                    <LandPlot size={16} />
                  </div>{" "}
                  {p.size}
                </div>
              </div>
              <p className="mt-2 font-bold text-blue-500">
                {p.listing_type === "rent"
                  ? `GH₵${Number(p.price).toLocaleString("en-GH")}/month`
                  : `USD$${Number(p.price).toLocaleString("en-GH")}`}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Listings;
