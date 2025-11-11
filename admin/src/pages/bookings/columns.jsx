import { EllipsisVertical } from "lucide-react";
import { parseISO, format } from "date-fns";

const isoDate = "2025-11-03T09:34:03.278773+00:00";
const date = parseISO(isoDate);

const formatted = format(date, "EEE dd MMM, yyyy");
console.log(formatted); // "Mon 03 Nov, 2025"

export const columns = [
  {
    accessorKey: "first_name",
    header: "Name",
    cell: ({ row }) => {
      const fullName = `${row.getValue("first_name")} ${row.getValue("last_name")}`;
      console.log(fullName);
      return <>{fullName}</>;
    },
  },
  { accessorKey: "last_name", header: "", cell: () => {} },
  { accessorKey: "bedrooms", header: "", cell: () => {} },
  { accessorKey: "location", header: "", cell: () => {} },
  { accessorKey: "property_type", header: "", cell: () => {} },
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
