import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/ui/DataTable";
import MobileTable from "@/components/ui/MobileTable";
import { propertyColumns } from "@/pages/bookings/propertyColumns";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Funnel, ListFilter, Plus } from "lucide-react";
import { Pagination1, MobilePagination1 } from "@/components/pagination-1";

export default function Properties() {
  const [tableInfo, setTableInfo] = useState({});
  const [propertyCount, setPropertyCount] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const countProperties = async () => {
    const { count } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    setPropertyCount(count);
  };

  async function fetchProperties(page = 0, perPage = 20) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: true })
      .range(from, to);

    if (error) {
      console.error("Error fetcthing properties", error);
      toast.dismiss(); // remove the loading one
      toast.error("Failed to fetch properties!", {
        style: {
          borderRadius: "10px",
          background: "#121420",
          color: "#fff",
          border: "0.4px solid gray",
        },
      });
    } else {
      setTableInfo(data);
    }
  }

  useEffect(() => {
    countProperties();
    fetchProperties(currentPage, perPage);
  }, [currentPage, perPage]);

  const totalPages = Math.ceil(propertyCount / perPage);

  console.log(propertyCount, " properties found,");

  return (
    <>
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4 mb-5">
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          {" "}
          Property{" "}
        </h2>
        <div className="flex gap-2 lg:gap-6 gap-2">
          <button className="border border-gray-400 px-4 py-2 rounded-sm text-gray-500">
            {" "}
            Discard{" "}
          </button>
          <Link
            to="/addproperties/"
            className="bg-yellow-400 px-4 py-2 rounded-sm text-white font-bold flex gap-1"
          >
            {" "}
            <Plus />
            Property{" "}
          </Link>
        </div>
      </div>
      <Card className="hidden lg:block md:block bg-white/10 rounded-xl p-5 w-full">
        <div className="flex justify-between text-white items-center mb-5">
          <p className="text-base font-medium">{tableInfo.length} Properties</p>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-[#121420] rounded-sm text-xs flex items-center gap-1">
              <ListFilter size={14} />
              Sort By
            </button>
            <button className="px-3 py-2 bg-[#121420] rounded-sm text-xs flex items-center gap-1">
              <Funnel size={14} />
              Filter
            </button>
          </div>
        </div>
        <DataTable columns={propertyColumns} data={tableInfo} />
        <div className="flex justify-between items-center text-white mt-5">
          {" "}
          <div className="bg-[#121420] p-2 rounded-sm text-xs">
            {`Page ${page + 1} of ${totalPages}`}
          </div>
          {/*change this to 1*/}
          {totalPages > 1 ? (
            <Pagination1
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          ) : null}
          <select
            className="bg-[#121420] text-white p-2 rounded-sm"
            onChange={(e) => {
              const value = e.target.value;
              setPerPage(Number(value));
            }}
          >
            <option value={20} selected>
              20 / page
            </option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </Card>
      <span className="lg:hidden md:hidden">
        <MobileTable table={tableInfo} />
        {totalPages > 1 ? (
          <div className="mt-5">
            <MobilePagination1
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        ) : null}
      </span>
    </>
  );
}
