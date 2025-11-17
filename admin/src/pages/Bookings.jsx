import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import MobileBookingTable from "@/components/ui/MobileBookingTable";
import { columns } from "@/pages/bookings/columns";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Funnel, ListFilter, Calendar, Download, Search, X } from "lucide-react";
import { Pagination1, MobilePagination1 } from "@/components/pagination-1";
import { TOAST_STYLE } from "@/lib/utils";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Bookings() {
  const [tableInfo, setTableInfo] = useState([]);
  const [bookingCount, setBookingCount] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRequestType, setFilterRequestType] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const countBookings = async () => {
    let query = supabase
      .from("booking")
      .select("*", { count: "exact", head: true });

    // Apply filters for count
    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }
    if (filterStatus !== "all") {
      query = query.eq("status", filterStatus);
    }
    if (filterRequestType !== "all") {
      query = query.eq("request_type", filterRequestType);
    }

    const { count } = await query;
    setBookingCount(count || 0);
  };

  async function fetchBookings(page = 1, perPage = 20) {
    setLoading(true);
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    
    let query = supabase.from("booking").select("*");

    // Apply search
    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    // Apply filters
    if (filterStatus !== "all") {
      query = query.eq("status", filterStatus);
    }
    if (filterRequestType !== "all") {
      query = query.eq("request_type", filterRequestType);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    query = query.range(from, to);

    const { data: bookings, error: bookingsError } = await query;

    if (bookingsError) {
      toast.error("Failed to fetch bookings!", { style: TOAST_STYLE });
      setTableInfo([]);
      setLoading(false);
      return;
    }

    // Fetch properties to merge with bookings
    const { data: properties } = await supabase
      .from("properties")
      .select("*");

    const merged = bookings.map((booking) => {
      const property = properties?.find((p) => p.id === booking.property_id);
      return property ? { ...booking, ...property } : booking;
    });

    setTableInfo(merged || []);
    setLoading(false);
  }

  useEffect(() => {
    countBookings();
    fetchBookings(currentPage, perPage);
  }, [currentPage, perPage, searchTerm, filterStatus, filterRequestType, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterRequestType("all");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchTerm || filterStatus !== "all" || filterRequestType !== "all";

  const handleExport = async () => {
    try {
      // Fetch all bookings (not paginated) for export
      let query = supabase.from("booking").select("*");

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }
      if (filterRequestType !== "all") {
        query = query.eq("request_type", filterRequestType);
      }

      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const { data: bookings, error } = await query;
      if (error) throw error;

      // Fetch properties to merge
      const { data: properties } = await supabase.from("properties").select("*");
      const merged = bookings.map((booking) => {
        const property = properties?.find((p) => p.id === booking.property_id);
        return property ? { ...booking, ...property } : booking;
      });

      // Convert to CSV
      if (!merged || merged.length === 0) {
        toast.error("No data to export", { style: TOAST_STYLE });
        return;
      }

      const headers = ["Name", "Email", "Phone", "Request Type", "Status", "Property", "Created At"];
      const rows = merged.map((booking) => [
        `${booking.first_name || ""} ${booking.last_name || ""}`,
        booking.email || "",
        booking.phone || "",
        booking.request_type || "",
        booking.status || "",
        booking.title || `Property ID: ${booking.property_id}`,
        booking.created_at || "",
      ]);

      const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookings_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Bookings exported successfully!", { style: TOAST_STYLE });
    } catch (error) {
      toast.error("Failed to export bookings", { style: TOAST_STYLE });
    }
  };

  const totalPages = Math.ceil(bookingCount / perPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4 mb-5">
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          Bookings
        </h2>
        <div className="flex gap-2 lg:gap-6">
          <button
            onClick={handleExport}
            className="bg-[#121420] px-4 py-2 rounded-sm text-white font-bold flex gap-1 items-center hover:bg-[#1a1b2e] transition-all duration-200"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
      <Card className="hidden lg:block md:block bg-white/10 rounded-xl p-5 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between text-white items-center mb-5 flex-wrap gap-4"
        >
          <p className="text-base font-medium">
            {bookingCount} {bookingCount === 1 ? "Booking" : "Bookings"}
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
                placeholder="Search bookings..."
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
                      setSortBy("status");
                      setSortOrder("asc");
                      setSortOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    Status: A-Z
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                <DropdownMenuTrigger className="px-3 py-2 bg-[#121420] rounded-sm text-xs flex items-center gap-1 hover:bg-[#1a1b2e] transition-all duration-200">
                  <Funnel size={14} />
                  Filter
                  {(filterStatus !== "all" || filterRequestType !== "all") && (
                    <span className="ml-1 bg-yellow-400 text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                      {(filterStatus !== "all" ? 1 : 0) + (filterRequestType !== "all" ? 1 : 0)}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
                  <div className="p-2">
                    <p className="text-white/60 text-xs mb-2 font-medium">Status</p>
                    <div className="space-y-1">
                      {["all", "pending", "contacted", "scheduled", "in progress", "completed", "canceled"].map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => {
                            setFilterStatus(status);
                            setCurrentPage(1);
                          }}
                          className={`cursor-pointer ${filterStatus === status ? "bg-yellow-400/20" : ""}`}
                        >
                          {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/10 my-1" />
                  <div className="p-2">
                    <p className="text-white/60 text-xs mb-2 font-medium">Request Type</p>
                    <div className="space-y-1">
                      {["all", "Tour", "Buy", "Rent"].map((type) => (
                        <DropdownMenuItem
                          key={type}
                          onClick={() => {
                            setFilterRequestType(type);
                            setCurrentPage(1);
                          }}
                          className={`cursor-pointer ${filterRequestType === type ? "bg-yellow-400/20" : ""}`}
                        >
                          {type === "all" ? "All Types" : type}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DataTable
            columns={columns(() => {
              fetchBookings(currentPage, perPage);
              countBookings();
            })}
            data={tableInfo}
            meta={{
              refreshData: () => {
                fetchBookings(currentPage, perPage);
                countBookings();
              },
            }}
          />
        </motion.div>
        <div className="flex justify-between items-center text-white mt-5">
          <div className="bg-[#121420] p-2 rounded-sm text-xs">
            {`Page ${currentPage} of ${totalPages}`}
          </div>
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
        <MobileBookingTable table={tableInfo} />
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
    </motion.div>
  );
}

