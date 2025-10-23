import Listings from "../components/Listings";

function PropertyLising() {
  return (
    <div className="px-[5%] lg:px-[10%] my-2">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <button className=" text-white bg-yellow-400 rounded-3xl px-6 py-1 font-medium text-sm">
          All
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Rent
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Sale
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Houses
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Apartments
        </button>

        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Sale
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Sale
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-1 font-medium text-sm">
          Sale
        </button>
      </div>
      <h2 className="text-2xl py-5 text-white font-medium">Recently Viewed</h2>
      <div className="overflow-x-auto no-scrollbar">
        <Listings smCols={4} lgCols={4} limit={4} />
      </div>
      <h2 className="text-2xl py-5 text-white font-medium">Recommended</h2>
      <div className="overflow-x-auto no-scrollbar">
        <Listings smCols={1} lgCols={4} limit={8} />
      </div>
    </div>
  );
}

export default PropertyLising;
