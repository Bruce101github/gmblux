import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Bed, ShowerHead, LandPlot } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

function Listings({
  lgCols = 3,
  smCols = 1,
  limit = undefined,
  search = "",
  properties: propsProperties,
  setProperties: propsSetProperties,
  filters,
  setFilters,
}) {
  const [loading, setLoading] = useState(true);
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

    if (filters?.listingType != "all") {
      query = query.eq("listing_type", filters.listingType);
    }

    if (filters?.propertyType != "all") {
      query = query.eq("property_type", filters.propertyType);
    }

    if (filters?.bedrooms != "any") {
      query = query.eq("bedrooms", filters.bedrooms);
    }

    if (filters?.bathrooms != "any") {
      query = query.eq("bathrooms", filters.bathrooms);
    }
    if (filters?.price) {
      query = query
        .gte("price", filters.price[0])
        .lte("price", filters.price[1]);
    }

    if (search && search.trim() !== "") {
      query = query.textSearch("fts", search, {
        config: "english",
        type: "websearch", // allows natural queries like “3 bedroom house”
      });
    }

    query = query.order("created_at", { ascending: false });

    let { data, error } = await query;

    // if no search, show all properties

    if (error) {
      console.error("Error fetching search results:", error);
      return [];
    }
    setProperties(data);
    setLoading(false);
    return;
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${lgGridClass}  ${smGridClass}  gap-4 m-0 `}
    >
      {loading
        ? Array.from({ length: !limit ? 5 : limit }).map((_, index) => (
            <div className="bg-white/15 rounded-3xl shadow p-4 text-white">
              <Skeleton className="w-full h-[200px] rounded-2xl" />
              <Skeleton className="h-7 w-[70%] mt-2" />
              <Skeleton className="h-4 w-[35%] mt-2" />
              <div className="flex justify-between">
                {" "}
                <Skeleton className="h-5 w-[8%] mt-2" />
                <Skeleton className="h-5 w-[8%] mt-2" />
                <Skeleton className="h-5 w-[8%] mt-2" />
                <div className="w-15"></div>
                <Skeleton className="h-6 w-[45%] mt-2" />
              </div>
            </div>
          ))
        : properties.slice(0, limit).map((p) => (
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
                <h2 className="text-md font-medium mt-2 text-white">
                  {p.title}
                </h2>
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
