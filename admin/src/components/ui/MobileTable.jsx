import { Card } from "@/components/ui/card";
import { EllipsisVertical, Bed, ShowerHead } from "lucide-react";

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
          <Card className="relative mb-4 text-white p-4 gap-1">
            <button className="absolute top-4 right-4">
              <EllipsisVertical size={16} />
            </button>
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
