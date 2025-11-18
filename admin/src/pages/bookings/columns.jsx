import { EllipsisVertical, Edit, Trash2, Mail, Phone, Eye } from "lucide-react";
import { parseISO, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";
import { TOAST_STYLE } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

const isoDate = "2025-11-03T09:34:03.278773+00:00";
const date = parseISO(isoDate);

const formatted = format(date, "EEE dd MMM, yyyy");

// Actions cell component
function BookingActions({ booking, refreshData, updateBookingInTable }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleStatusUpdate = async (newStatus, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    
    // Don't update if it's already the same status
    if (booking.status === newStatus) {
      setOpen(false);
      return;
    }

    // Optimistically update the UI immediately
    if (updateBookingInTable) {
      updateBookingInTable(booking.id, { status: newStatus });
    }

    setOpen(false);

    try {
      const { error } = await supabase
        .from("booking")
        .update({ status: newStatus })
        .eq("id", booking.id);

      if (error) throw error;

      toast.success(`Booking status updated to ${newStatus}`, {
        style: TOAST_STYLE,
      });
      
      // Refresh to ensure data is in sync
      if (refreshData) refreshData();
    } catch (error) {
      // Revert optimistic update on error
      if (updateBookingInTable) {
        updateBookingInTable(booking.id, { status: booking.status });
      }
      toast.error(`Failed to update status: ${error.message}`, {
        style: TOAST_STYLE,
      });
    }
  };

  const handleDelete = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setOpen(false);
    
    const fullName = `${booking.first_name || ""} ${booking.last_name || ""}`.trim();
    if (!confirm(`Are you sure you want to delete the booking request from ${fullName || "this customer"}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("booking")
        .delete()
        .eq("id", booking.id);

      if (error) throw error;

      toast.success("Booking deleted successfully", {
        style: TOAST_STYLE,
      });
      if (refreshData) refreshData();
    } catch (error) {
      toast.error(`Failed to delete booking: ${error.message}`, {
        style: TOAST_STYLE,
      });
    }
  };

  const handleEdit = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setOpen(false);
    // TODO: Navigate to edit booking page or open edit modal
    toast.info("Edit booking functionality coming soon", {
      style: TOAST_STYLE,
    });
  };

  const handleViewDetails = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setOpen(false);
    // Show booking details in a modal or alert
    const details = `
Booking Details:
- Name: ${booking.first_name || ""} ${booking.last_name || ""}
- Email: ${booking.email || "N/A"}
- Phone: ${booking.phone || "N/A"}
- Request Type: ${booking.request_type || "N/A"}
- Status: ${booking.status || "N/A"}
- Property: ${booking.bedrooms ? `${booking.bedrooms} bedroom ${booking.property_type || ""}` : "N/A"}
- Location: ${booking.location || "N/A"}
- Created: ${booking.created_at ? format(parseISO(booking.created_at), "EEE dd MMM, yyyy") : "N/A"}
    `;
    alert(details);
  };

  const handleContact = (method, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setOpen(false);
    
    if (method === "email" && booking.email) {
      window.location.href = `mailto:${booking.email}`;
    } else if (method === "phone" && booking.phone) {
      window.location.href = `tel:${booking.phone}`;
    } else {
      toast.error(`No ${method} available for this booking`, {
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
    <div className="relative" ref={menuRef}>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="text-white/60 hover:text-white transition-colors"
        >
          <EllipsisVertical size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent open={open} align="end" className="min-w-[200px]">
          <DropdownMenuItem onSelect={handleViewDetails} icon={Eye}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleEdit} icon={Edit}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="p-2">
            <p className="text-white/60 text-xs mb-2 font-medium">Update Status</p>
            <div className="space-y-1">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={(e) => handleStatusUpdate(option.value, e)}
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
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onSelect={(e) => handleContact("email", e)} 
            icon={Mail}
            disabled={!booking.email}
          >
            Send Email
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={(e) => handleContact("phone", e)} 
            icon={Phone}
            disabled={!booking.phone}
          >
            Call
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleDelete}
            icon={Trash2}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns = (refreshData, updateBookingInTable) => [
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
      // Always use original to ensure we get the latest data
      const booking = row.original;
      const status = booking?.status || row.getValue("status");

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
          key={`status-${booking?.id}-${status}`}
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
      <BookingActions 
        booking={row.original} 
        refreshData={refreshData}
        updateBookingInTable={updateBookingInTable}
      />
    ),
  },
];
