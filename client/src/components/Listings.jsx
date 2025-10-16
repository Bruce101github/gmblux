import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Bed, ShowerHead, LandPlot } from "lucide-react";

function Listings({ lgCols = 3, smCols = 1, limit = 3 }) {
  const [properties, setProperties] = useState([]);

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
      1: "sm:grid-cols-1",
      2: "sm:grid-cols-2",
      3: "grid-cols-3 min-w-[1000px]",
    }[smCols] || "sm:grid-cols-3";

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { asending: false });

      if (error) {
        console.error("Error fetch properties", error);
      } else {
        setProperties(data);
      }
    }
    fetchProperties();
  }, []);
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${lgGridClass}  ${smGridClass}  gap-4 m-0 `}
    >
      {properties.slice(0, limit).map((p) => (
        <div key={p.id} className="bg-white/15 rounded-3xl shadow p-4">
          <img
            src={p.images?.[0]}
            alt={p.title}
            className="w-full h-[200px] object-cover rounded-2xl"
          />
          <h2 className="text-md font-medium mt-2 text-white">{p.title}</h2>
          <p className="text-white/60 text-sm">{p.location}</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-1 text-xs items-center">
              <div className="flex text-white gap-1 items-center">
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
                </div>
                • {p.size}
              </div>
            </div>
            <p className="mt-2 font-bold text-blue-500">
              {p.listing_type === "rent"
                ? `GH₵${p.price}/month`
                : `$${p.price}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Listings;
