import { useState } from "react";

function Pills({ filters, setFilters }) {
  const pills = [
    {
      name: "all",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, type: "all" })),
    },
    {
      name: "rent",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, type: "rent" })),
    },
    {
      name: "sale",
      filter: (setFilters) => setFilters((prev) => ({ ...prev, type: "sale" })),
    },
  ];
  const [selected, setSelected] = useState("all");

  return (
    <div className="flex gap-2 overflow-x-auto">
      {pills.map((pill) => {
        return (
          <button
            key={pill.name}
            onClick={() => {
              setSelected(pill.name);
              pill.filter(setFilters);
            }}
            className={
              selected === pill.name
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
