import { Card } from "@/components/ui/card";
import { EllipsisVertical, Bed, ShowerHead, Edit, Trash2, CheckCircle, User, Eye } from "lucide-react";
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

export default function MobileTable({ table }) {
  return (
    <div className="px-[5%]">
      {Object.values(table).map((row) => {
        const property = row.property_type;
        const listing = row.listing_type;

        let colorClasses = "";
        let listingClasses = "";

        switch (listing) {
          case "rent":
            listingClasses = "bg-blue-300/10 text-blue-400";
            break;
          case "sale":
            listingClasses = "bg-yellow-300/10 text-yellow-400";
            break;
        }

        switch (property) {
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
          <Card key={row.id} className="relative mb-4 text-white p-4 gap-1">
            <MobilePropertyActions property={row} />
            <p className="font-medium text-base">{row.title}</p>
            <p className="text-sm text-white/60">{row.location}</p>
            <div className="flex gap-4">
              <span className="flex gap-2 text-sm jusitfy-center items-center">
                <Bed size={16} />
                {row.bedrooms}
              </span>
              <span className="flex gap-2 text-sm jusitfy-center items-center">
                <ShowerHead size={16} />
                {row.bathrooms}
              </span>
            </div>
            <span className="flex gap-2 mt-1">
              <p
                className={`text-sm font-medium px-3 py-1 rounded-3xl w-fit ${colorClasses}`}
              >
                {row.property_type}
              </p>{" "}
              <p
                className={`px-3 py-1 rounded-3xl w-fit text-sm ${listingClasses}`}
              >
                {row.listing_type}
              </p>
            </span>
            <p className="text-white font-bold text-base text-right">
              {row.currency === "ghs" ? "GH₵ " : "US$ "}{" "}
              {Number(row.price).toLocaleString()}
            </p>
          </Card>
        );
      })}
    </div>
  );
}

// Mobile Property Actions Dropdown Component
function MobilePropertyActions({ property }) {
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
      window.location.reload();
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
      window.location.reload();
    }
  };

  const handleViewOwner = () => {
    setOpen(false);
    alert(`Owner information for "${property.title}"\n\nOwner details would be displayed here.`);
  };

  const handleViewProperty = () => {
    setOpen(false);
    window.open(`/listing/${property.id}`, "_blank");
  };

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
          <EllipsisVertical size={16} />
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
