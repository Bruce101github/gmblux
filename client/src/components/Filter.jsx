import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import Pills from "@/components/Pills";

function Filter({ filterOpen, setFilterOpen, filters, setFilters }) {
  const [value, setValue] = useState([0, 10000000]);
  const presets = {
    listingType: "all",
    propertyType: "all",
    bedrooms: "any",
    bathrooms: "any",
    price: [0, 10000000],
  };

  const [localFilters, setLocalFilters] = useState(filters);
  document.body.style.overflow = "hidden";

  function handleFilters() {
    setFilters((prev) => ({ ...prev, ...localFilters }));
    console.log("check herer", filters);
    document.body.style.overflow = "auto";
    setFilterOpen(false);
  }

  function resetFilters() {
    setLocalFilters((prev) => ({ ...prev, ...presets }));
    console.log("check herer", filters);
  }

  return (
    <div
      className="absolute bottom-0 w-full h-screen bg-white/10 mx-[-5%] fixed
                  z-1000 backdrop-blur-sm flex flex-col justify-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: filterOpen ? 0 : "100%" }}
        transition={
          filterOpen
            ? { duration: 0.6, ease: "easeOut" }
            : { duration: 0.4, ease: "easeIn" }
        }
        className="bg-[#121420] h-[85%] w-full px-[5%] py-[20px] border-t border-white/15 rounded-t-4xl absolute bottom-0 flex flex-col justify-between"
      >
        <div className="flex justify-end">
          <button
            className="text-white/90 bg-white/5 p-1.5 rounded-full w-10 h-10 flex justify-center items-center"
            onClick={() => {
              document.body.style.overflow = "auto";
              setFilterOpen(false);
            }}
          >
            <X size={38} />
          </button>
        </div>
        <div className="text-white ">
          <p className="text-lg font-medium mb-2">Listing Type</p>
          <Pills filters={localFilters} setFilters={setLocalFilters} />
        </div>
        <div className="text-white">
          <p className="text-lg font-medium mb-2">Property Type</p>
          <Pills
            filters={localFilters}
            setFilters={setLocalFilters}
            type={"property"}
          />
        </div>
        <div className="text-white">
          <p className="text-lg font-medium mb-2">Bedrooms</p>
          <Pills
            filters={localFilters}
            setFilters={setLocalFilters}
            type="bed"
          />
        </div>
        <div className="text-white">
          <p className="text-lg font-medium mb-3">Bathrooms</p>
          <Pills
            filters={localFilters}
            setFilters={setLocalFilters}
            type="bath"
          />
        </div>
        <div className="text-white ">
          <p className="text-lg font-medium mb-2">Pricing</p>
          <div className="flex w-full max-w-md flex-col gap-2 ">
            <Slider
              id="slider"
              max={10000000}
              min={0}
              onValueChange={setValue}
              value={value}
            />
            <div className="flex justify-between text-white/40">
              <p>GH₵{value[0].toLocaleString("en-GH")}</p>
              <p>GH₵{value[1].toLocaleString("en-GH")}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="text-white/70 text-base border border-white/40 px-2 py-3 rounded-4xl my-5 "
            onClick={resetFilters}
          >
            Reset
          </button>
          <button
            className="bg-yellow-400 px-2 py-3 rounded-4xl my-5 text-base text-white font-bold"
            onClick={handleFilters}
          >
            See properties
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Filter;
