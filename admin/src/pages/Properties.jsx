import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/ui/DataTable";
import { propertyColumns } from "@/pages/bookings/propertyColumns";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Funnel, ListFilter, Plus } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Properties() {
  const [tableInfo, setTableInfo] = useState({});

  async function fetchProperties() {
    const { data, error } = await supabase.from("properties").select("*");

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
      console.log("data was fetch");
      setTableInfo(data);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <>
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4 mb-5">
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          {" "}
          Property{" "}
        </h2>
        <div className="hidden lg:flex lg:gap-6 gap-2">
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
      <Card className="bg-white/10 rounded-xl p-5 w-full">
        <div className="flex justify-between text-white items-center">
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
        <div className="flex justify-between items-center text-white">
          {" "}
          <div className="bg-[#121420] p-2 rounded-sm text-xs">
            Page 2 of 10
          </div>
          <div className="">
            <Pagination className="my-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" className="bg-[#121420]" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">4</PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" className="bg-[#121420]" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Card>
    </>
  );
}
