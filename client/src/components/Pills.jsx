import { useState } from "react";

function Pills() {
  const pills = [{ name: "All" }, { name: "Rent" }, { name: "Sale" }];
  const [isSelected, setSelected] = useState();

  return (
    <div>
      {pills.map((pill) => {
        <button>pill.name</button>;
      })}
    </div>
  );
}

export default Pills;
