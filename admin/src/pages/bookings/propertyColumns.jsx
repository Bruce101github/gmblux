import { EllipsisVertical, Bed, Edit, Trash2, CheckCircle, User, Eye } from "lucide-react";
import { parseISO, format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
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

const isoDate = "2025-11-03T09:34:03.278773+00:00";
const date = parseISO(isoDate);

const formatted = format(date, "EEE dd MMM, yyyy");

export const propertyColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "property_type",
    header: "Property type",
    cell: ({ row }) => {
      const status = row.getValue("property_type");

      let colorClasses = "";

      switch (status) {
        case "house":
          colorClasses = "bg-orange-300/10 text-orange-400";
          break;
        case "apartment":
          colorClasses = "bg-blue-300/10 text-blue-400";
          break;
        case "mansion":
          colorClasses = "bg-green-300/10 text-green-400";
          break;
        case "duplex":
          colorClasses = "bg-indigo-300/10 text-indigo-400";
          break;
        case "townhouse":
          colorClasses = "bg-yellow-300/10 text-yellow-400";
          break;
        case "studio":
          colorClasses = "bg-red-300/10 text-red-400";
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
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size = row.getValue("size");
      return size ? <span>{size}ft</span> : "";
    },
  },
  {
    accessorKey: "listing_type",
    header: "Rent/Sale",
  },
  {
    accessorKey: "bedrooms",
    header: "Bedrooms",
    cell: ({ row }) => {
      const beds = row.getValue("bedrooms");
      return (
        <span className="flex gap-2 text-sm jusitfy-center items-center">
          <Bed size={16} />
          {beds}
        </span>
      );
    },
  },

  { accessorKey: "location", header: "Location" },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const currency = row.getValue("currency");
      const price = row.getValue("price");
      return (
        <span>
          {currency === "ghs" ? "GH₵" : "US$"} {price.toLocaleString()}
        </span>
      );
    },
  },
  { accessorKey: "currency", header: "", cell: () => {} },
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
  { accessorKey: "id", header: "", cell: () => {} },
  {
    accessorKey: "Actions",
    header: "",
    cell: ({ row, table }) => {
      const property = row.original;
      const id = row.getValue("id");

      return (
        <PropertyActions property={property} table={table} />
      );
    },
  },
];

// Property Actions Dropdown Component
function PropertyActions({ property, table }) {
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

  const handleEdit = () => {
    setOpen(false);
    // Navigate to edit page - you may need to create this route
    window.location.href = `/addproperties?edit=${property.id}`;
  };

  const handleDelete = async () => {
    setOpen(false);
    if (!confirm(`Are you sure you want to delete "${property.title}"?`)) {
      return;
    }

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", property.id);

    if (error) {
      toast.error(`Failed to delete property: ${error.message}`, {
        style: TOAST_STYLE,
      });
    } else {
      toast.success("Property deleted successfully", {
        style: TOAST_STYLE,
      });
      // Refresh the table
      if (table.options.meta?.refreshData) {
        table.options.meta.refreshData();
      } else {
        window.location.reload();
      }
    }
  };

  const handleMarkAsSold = async () => {
    setOpen(false);
    if (!confirm(`Mark "${property.title}" as sold?`)) {
      return;
    }

    const { error } = await supabase
      .from("properties")
      .update({ status: "sold", sold_at: new Date().toISOString() })
      .eq("id", property.id);

    if (error) {
      toast.error(`Failed to mark as sold: ${error.message}`, {
        style: TOAST_STYLE,
      });
    } else {
      toast.success("Property marked as sold", {
        style: TOAST_STYLE,
      });
      // Refresh the table
      if (table.options.meta?.refreshData) {
        table.options.meta.refreshData();
      } else {
        window.location.reload();
      }
    }
  };

  const handleViewOwner = () => {
    setOpen(false);
    // Show owner information - you may need to implement a modal or page
    alert(`Owner information for "${property.title}"\n\nOwner details would be displayed here.`);
  };

  const handleViewProperty = () => {
    setOpen(false);
    // Navigate to property view page
    window.open(`/listing/${property.id}`, "_blank");
  };

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
        <DropdownMenuContent
          open={open}
          align="end"
          className="min-w-[180px]"
        >
          <DropdownMenuItem onSelect={handleViewProperty} icon={Eye}>
            View Property
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleEdit} icon={Edit}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleMarkAsSold} icon={CheckCircle}>
            Mark as Sold
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleViewOwner} icon={User}>
            View Owner
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
