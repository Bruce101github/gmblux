import { EllipsisVertical, Bed } from "lucide-react";
import { parseISO, format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

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
    cell: ({ row }) => {
      const id = row.getValue("id");

      return (
        <button className="text-white/20">
          <EllipsisVertical size={18} />
        </button>
      );
    },
  },
];
