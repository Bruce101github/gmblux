import { useState, useEffect } from "react";

function Pills({ filters, setFilters, type = "listing" }) {
  let pills = [];
  const listingType = [
    {
      name: "all",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, listingType: "all" })),
      type: "listingType",
    },
    {
      name: "rent",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, listingType: "rent" })),
      type: "listingType",
    },
    {
      name: "sale",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, listingType: "sale" })),
      type: "listingType",
    },
  ];

  const propertyType = [
    {
      name: "all",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, propertyType: "all" })),
      type: "propertyType",
    },
    {
      name: "apartment",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, propertyType: "apartment" })),
      type: "propertyType",
    },
    {
      name: "house",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, propertyType: "house" })),
      type: "propertyType",
    },
    {
      name: "mansion",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, propertyType: "mansion" })),
      type: "propertyType",
    },
    {
      name: "townhouse",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, propertyType: "townhouse" })),
      type: "propertyType",
    },

    {
      name: "duples",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, propertyType: "duples" })),
      type: "propertyType",
    },

    {
      name: "studio",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, propertyType: "studio" })),
      type: "propertyType",
    },
  ];

  const bedrooms = [
    {
      name: "any",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, bedrooms: "any" })),
      type: "bedrooms",
    },
    {
      name: "+1",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, bedrooms: 1 })),
      type: "bedrooms",
    },
    {
      name: "+2",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, bedrooms: 2 })),
      type: "bedrooms",
    },
    {
      name: "+3",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, bedrooms: 3 })),
      type: "bedrooms",
    },
    {
      name: "+4",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, bedrooms: 4 })),
      type: "bedrooms",
    },
    {
      name: "+5",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, bedrooms: 5 })),
      type: "bedrooms",
    },
  ];

  const bathrooms = [
    {
      name: "any",
      filter: (setFilters) =>
        setFilters((prev) => ({ ...prev, bathrooms: "any" })),
      type: "bathrooms",
    },
    {
      name: "+1",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, bathrooms: 1 })),
      type: "bathrooms",
    },
    {
      name: "+2",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, bathrooms: 2 })),
      type: "bathrooms",
    },
    {
      name: "+3",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, bathrooms: 3 })),
      type: "bathrooms",
    },
    {
      name: "+4",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, bathrooms: 4 })),
      type: "bathrooms",
    },
    {
      name: "+5",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, bathrooms: 5 })),
      type: "bathrooms",
    },
  ];

  if (type === "listing") {
    pills = listingType;
  }
  if (type === "property") {
    pills = propertyType;
  }
  if (type === "bed") {
    pills = bedrooms;
  }
  if (type === "bath") {
    pills = bathrooms;
  }

  const [selected, setSelected] = useState({});

  useEffect(() => {
    selectButton();
  }, [filters]);

  function selectButton() {
    Object.entries(filters).map(([key, value]) => {
      setSelected((prev) => ({
        ...prev,
        [key]: Number.isInteger(value) ? `+${value}` : value,
      }));
    });
  }

  return (
    <div className="flex gap-1 overflow-x-auto no-scrollbar">
      {pills.map((pill) => {
        return (
          <button
            key={pill.name}
            onClick={() => {
              setSelected((prev) => ({ ...prev, [pill.type]: pill.name }));
              pill.filter(setFilters);
            }}
            className={
              selected[pill.type] === pill.name
                ? "bg-yellow-400 px-4 py-1 rounded-3xl text-white font-bold border border-yellow-400"
                : "border border-white/40 py-1 px-4 rounded-3xl text-white/40 font-bold"
            }
          >
            {pill.name}
          </button>
        );
      })}
    </div>
  );
}

export default Pills;
