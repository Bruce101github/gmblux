import Listings from "../components/Listings";

function PropertyLising() {
  return (
    <div className="px-[5%] lg:px-[10%] my-5">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-2">
          Rent
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-2">
          Sale
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-2">
          Houses
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-2">
          Apartments
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-2">
          Sale
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-2">
          Sale
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-2">
          Sale
        </button>
        <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-2">
          Sale
        </button>
      </div>
      <h2 className="text-3xl py-5">Recently Viewed</h2>
      <div className="overflow-x-auto no-scrollbar">
        <Listings smCols={3} lgCols={4} limit={3} />
      </div>
      <h2 className="text-3xl py-5">Recommended</h2>
      <div className="overflow-x-auto no-scrollbar">
        <Listings smCols={3} lgCols={4} limit={3} />
      </div>
    </div>
  );
}

export default PropertyLising;
