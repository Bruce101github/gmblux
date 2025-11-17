import { EllipsisVertical } from "lucide-react";
import { parseISO, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";
import { TOAST_STYLE } from "@/lib/utils";
import { useState } from "react";

const isoDate = "2025-11-03T09:34:03.278773+00:00";
const date = parseISO(isoDate);

const formatted = format(date, "EEE dd MMM, yyyy");

// Actions cell component
function BookingActions({ booking, refreshData }) {
  const [open, setOpen] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const { error } = await supabase
        .from("booking")
        .update({ status: newStatus })
        .eq("id", booking.id);

      if (error) throw error;

      toast.success(`Booking status updated to ${newStatus}`, {
        style: TOAST_STYLE,
      });
      setOpen(false);
      if (refreshData) refreshData();
    } catch (error) {
      toast.error(`Failed to update status: ${error.message}`, {
        style: TOAST_STYLE,
      });
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "contacted", label: "Contacted" },
    { value: "scheduled", label: "Scheduled" },
    { value: "in progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "canceled", label: "Canceled" },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="text-white/20 hover:text-white/40 transition-colors">
        <EllipsisVertical size={18} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <div className="p-2">
          <p className="text-white/60 text-xs mb-2 font-medium">Update Status</p>
          <div className="space-y-1">
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleStatusUpdate(option.value)}
                className={`cursor-pointer ${
                  booking.status === option.value ? "bg-yellow-400/20" : ""
                }`}
              >
                {option.label}
                {booking.status === option.value && (
                  <span className="ml-auto text-xs text-yellow-400">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns = (refreshData) => [
  {
    accessorKey: "first_name",
    header: "Name",
    cell: ({ row }) => {
      const fullName = `${row.getValue("first_name")} ${row.getValue("last_name")}`;
      return <>{fullName}</>;
    },
  },
  { accessorKey: "last_name", header: "", cell: () => {} },
  { accessorKey: "bedrooms", header: "", cell: () => {} },
  { accessorKey: "location", header: "", cell: () => {} },
  { accessorKey: "property_type", header: "", cell: () => {} },
  { accessorKey: "id", header: "", cell: () => {} },
  {
    accessorKey: "request_type",
    header: "Request",
  },
  {
    accessorKey: "property_id",
    header: "Property",
    cell: ({ row }) => {
      return (
        <p>
          {row.getValue("bedrooms")} bedroom {row.getValue("property_type")} at{" "}
          {row.getValue("location")}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      let colorClasses = "";

      switch (status) {
        case "pending":
          colorClasses = "bg-white/10 text-white";
          break;
        case "completed":
          colorClasses = "bg-green-800/15 text-green-400";
          break;
        case "contacted":
          colorClasses = "bg-blue-800/15 text-blue-400";
          break;
        case "scheduled":
          colorClasses = "bg-indigo-800/15 text-indigo-400";
          break;
        case "in progress":
          colorClasses = "bg-yellow-800/15 text-yellow-400";
          break;
        case "canceled":
          colorClasses = "bg-red-800/5 text-red-400";
          break;
        default:
          colorClasses = "bg-white/10 text-white";
          break;
      }

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row }) => {
      const isoDate = row.getValue("created_at");
      const date = parseISO(isoDate);
      const formatted = format(date, "EEE dd MMM, yyyy");
      return <>{formatted}</>;
    },
  },
  {
    accessorKey: "Actions",
    header: "",
    cell: ({ row }) => (
      <BookingActions booking={row.original} refreshData={refreshData} />
    ),
  },
];
