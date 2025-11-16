import { Card } from "@/components/ui/card";
import { parseISO, format } from "date-fns";
import { User, Calendar, Home } from "lucide-react";

export default function MobileBookingTable({ table }) {
  if (!table || table.length === 0) {
    return (
      <div className="px-[5%] py-8 text-center">
        <p className="text-white/60">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="px-[5%]">
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

