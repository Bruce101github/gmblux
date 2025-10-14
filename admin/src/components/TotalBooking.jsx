import { useState } from "react";

function TotalBooking(data) {
  const [isTotal, setTotal] = useState(data.length);
  console.log("This is a total booking:", isTotal);

  return <p className="text-2xl font-bold text-black">{isTotal}</p>;
}

export default TotalBooking;
