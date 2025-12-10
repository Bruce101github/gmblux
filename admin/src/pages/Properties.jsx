import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/ui/DataTable";
import MobileTable from "@/components/ui/MobileTable";
import { propertyColumns } from "@/pages/bookings/propertyColumns";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Funnel, ListFilter, Plus, Search, X } from "lucide-react";
import { Pagination1, MobilePagination1 } from "@/components/pagination-1";
import { TOAST_STYLE } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Properties() {
  const location = useLocation();
  const [tableInfo, setTableInfo] = useState([]);
  const [propertyCount, setPropertyCount] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPropertyType, setFilterPropertyType] = useState("all");
  const [filterListingType, setFilterListingType] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const countProperties = async () => {
    let query = supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    // Apply filters for count
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
    }
    if (filterPropertyType !== "all") {
      query = query.eq("property_type", filterPropertyType);
    }
    if (filterListingType !== "all") {
      query = query.eq("listing_type", filterListingType);
    }

    const { count } = await query;
    setPropertyCount(count || 0);
  };

  async function fetchProperties(page = 1, perPage = 20) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    
    let query = supabase.from("properties").select("*");

    // Apply search
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
    }

    // Apply filters
    if (filterPropertyType !== "all") {
      query = query.eq("property_type", filterPropertyType);
    }
    if (filterListingType !== "all") {
      query = query.eq("listing_type", filterListingType);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) {
      toast.dismiss();
      toast.error("Failed to fetch properties!", {
        style: TOAST_STYLE,
      });
      setTableInfo([]);
    } else {
      setTableInfo(data || []);
    }
  }

  useEffect(() => {
    countProperties();
    fetchProperties(currentPage, perPage);
  }, [currentPage, perPage, searchTerm, filterPropertyType, filterListingType, sortBy, sortOrder, location.pathname]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterPropertyType("all");
    setFilterListingType("all");
    setSortBy("created_at");
    setSortOrder("asc");
  };

  const hasActiveFilters = searchTerm || filterPropertyType !== "all" || filterListingType !== "all";

  const totalPages = Math.ceil(propertyCount / perPage);

  return (
    <>
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4 mb-5">
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          {" "}
          Property{" "}
        </h2>
        <div className="flex gap-2 lg:gap-6 gap-2">
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
        <div className="flex justify-between text-white items-center mb-5 flex-wrap gap-4">
          <p className="text-base font-medium">
            {propertyCount} {propertyCount === 1 ? "Property" : "Properties"}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-2 text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
              >
                <X size={12} />
                Clear filters
              </button>
            )}
          </p>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#121420] border-white/10 text-white w-[250px]"
              />
            </div>
            <div className="relative">
              <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
                <DropdownMenuTrigger className="px-3 py-2 bg-[#121420] rounded-sm text-xs flex items-center gap-1 hover:bg-[#1a1b2e] transition-all duration-200">
                  <ListFilter size={14} />
                  Sort By
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("created_at");
                      setSortOrder("desc");
                      setSortOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("created_at");
                      setSortOrder("asc");
                      setSortOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("price");
                      setSortOrder("desc");
                      setSortOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("price");
                      setSortOrder("asc");
                      setSortOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("title");
                      setSortOrder("asc");
                      setSortOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    Title: A-Z
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                <DropdownMenuTrigger className="px-3 py-2 bg-[#121420] rounded-sm text-xs flex items-center gap-1 hover:bg-[#1a1b2e] transition-all duration-200">
                  <Funnel size={14} />
                  Filter
                  {(filterPropertyType !== "all" || filterListingType !== "all") && (
                    <span className="ml-1 bg-yellow-400 text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                      {(filterPropertyType !== "all" ? 1 : 0) + (filterListingType !== "all" ? 1 : 0)}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
                  <div className="p-2">
                    <p className="text-white/60 text-xs mb-2 font-medium">Property Type</p>
                    <div className="space-y-1">
                      {["all", "house", "apartment", "mansion", "duplex", "townhouse", "studio"].map((type) => (
                        <DropdownMenuItem
                          key={type}
                          onClick={() => {
                            setFilterPropertyType(type);
                            setCurrentPage(1);
                          }}
                          className={`cursor-pointer ${filterPropertyType === type ? "bg-yellow-400/20" : ""}`}
                        >
                          {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/10 my-1" />
                  <div className="p-2">
                    <p className="text-white/60 text-xs mb-2 font-medium">Listing Type</p>
                    <div className="space-y-1">
                      {["all", "rent", "sale", "sold"].map((type) => (
                        <DropdownMenuItem
                          key={type}
                          onClick={() => {
                            setFilterListingType(type);
                            setCurrentPage(1);
                          }}
                          className={`cursor-pointer ${filterListingType === type ? "bg-yellow-400/20" : ""}`}
                        >
                          {type === "all" ? "All Listings" : type.charAt(0).toUpperCase() + type.slice(1)}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <DataTable 
          columns={propertyColumns} 
          data={tableInfo}
          meta={{
            refreshData: () => {
              fetchProperties(currentPage, perPage);
              countProperties();
            }
          }}
        />
        <div className="flex justify-between items-center text-white mt-5">
          {" "}
          <div className="bg-[#121420] p-2 rounded-sm text-xs">
            {`Page ${currentPage} of ${totalPages}`}
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
