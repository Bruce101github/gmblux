import { Card } from "@/components/ui/card";
import { parseISO, format } from "date-fns";
import { User, Calendar, Home, EllipsisVertical, Edit, Trash2, Mail, Phone, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";
import { TOAST_STYLE } from "@/lib/utils";

// Mobile Booking Actions Component
function MobileBookingActions({ booking, refreshData, updateBookingInTable }) {
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

    // Optimistically update the UI immediately - do this synchronously
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
    toast.info("Edit booking functionality coming soon", {
      style: TOAST_STYLE,
    });
  };

  const handleViewDetails = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setOpen(false);
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
    <div className="absolute top-4 right-4" ref={menuRef}>
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

export default function MobileBookingTable({ table, refreshData, updateBookingInTable }) {
  if (!table || table.length === 0) {
    return (
      <div className="px-[5%] py-8 text-center">
        <p className="text-white/60">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="px-[5%]" key={`mobile-${table.map(b => `${b.id}:${b.status}`).join('|')}`}>
      {Array.isArray(table) ? table.map((row) => {
        const status = row.status || "pending";

        let statusClasses = "";

        switch (status) {
          case "pending":
            statusClasses = "bg-white/10 text-white";
            break;
          case "completed":
            statusClasses = "bg-green-800/15 text-green-400";
            break;
          case "contacted":
            statusClasses = "bg-blue-800/15 text-blue-400";
            break;
          case "scheduled":
            statusClasses = "bg-indigo-800/15 text-indigo-400";
            break;
          case "in progress":
            statusClasses = "bg-yellow-800/15 text-yellow-400";
            break;
          case "canceled":
            statusClasses = "bg-red-800/5 text-red-400";
            break;
          default:
            statusClasses = "bg-white/10 text-white";
            break;
        }

        const fullName = `${row.first_name || ""} ${row.last_name || ""}`.trim();
        const propertyInfo = row.bedrooms && row.property_type && row.location
          ? `${row.bedrooms} bedroom ${row.property_type} at ${row.location}`
          : "Property information not available";
        
        const formattedDate = row.created_at
          ? format(parseISO(row.created_at), "EEE dd MMM, yyyy")
          : "N/A";

        return (
          <Card key={row.id} className="relative mb-4 text-white p-4 gap-2">
            <MobileBookingActions 
              booking={row} 
              refreshData={refreshData}
              updateBookingInTable={updateBookingInTable}
            />
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium text-base flex items-center gap-2">
                  <User size={16} className="text-white/60" />
                  {fullName || "Unknown"}
                </p>
                <p className="text-sm text-white/60 mt-1">{row.email || ""}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses}`}
              >
                {status}
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Home size={16} className="text-white/60" />
                <span>{propertyInfo}</span>
              </div>
              
              {row.request_type && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span className="text-white/60">Request:</span>
                  <span className="font-medium">{row.request_type}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar size={16} className="text-white/60" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </Card>
        );
      }) : Object.values(table).map((row) => {
        const status = row.status || "pending";

        let statusClasses = "";

        switch (status) {
          case "pending":
            statusClasses = "bg-white/10 text-white";
            break;
          case "completed":
            statusClasses = "bg-green-800/15 text-green-400";
            break;
          case "contacted":
            statusClasses = "bg-blue-800/15 text-blue-400";
            break;
          case "scheduled":
            statusClasses = "bg-indigo-800/15 text-indigo-400";
            break;
          case "in progress":
            statusClasses = "bg-yellow-800/15 text-yellow-400";
            break;
          case "canceled":
            statusClasses = "bg-red-800/5 text-red-400";
            break;
          default:
            statusClasses = "bg-white/10 text-white";
            break;
        }

        const fullName = `${row.first_name || ""} ${row.last_name || ""}`.trim();
        const propertyInfo = row.bedrooms && row.property_type && row.location
          ? `${row.bedrooms} bedroom ${row.property_type} at ${row.location}`
          : "Property information not available";
        
        const formattedDate = row.created_at
          ? format(parseISO(row.created_at), "EEE dd MMM, yyyy")
          : "N/A";

        return (
          <Card key={row.id} className="relative mb-4 text-white p-4 gap-2">
            <MobileBookingActions 
              booking={row} 
              refreshData={refreshData}
              updateBookingInTable={updateBookingInTable}
            />
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium text-base flex items-center gap-2">
                  <User size={16} className="text-white/60" />
                  {fullName || "Unknown"}
                </p>
                <p className="text-sm text-white/60 mt-1">{row.email || ""}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses}`}
              >
                {status}
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Home size={16} className="text-white/60" />
                <span>{propertyInfo}</span>
              </div>
              
              {row.request_type && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span className="text-white/60">Request:</span>
                  <span className="font-medium">{row.request_type}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar size={16} className="text-white/60" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

