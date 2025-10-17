import {
  Search,
  TextAlignJustify,
  SlidersHorizontal,
  ChevronLeft,
  Heart,
  Share,
  EllipsisVertical,
} from "lucide-react";
import Logo from "../assets/gmblogo.JPG";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex w-auto justify-between px-[10%] pt-[20px] pb-[5%] text-white">
      <div className="flex gap-4">
        <div className="h-[50px] w-[50px] rounded-full bg-gray-300">
          <img src={Logo} className="rounded-full" />
        </div>
        <div className="relative min-w-[400px] bg-white rounded-4xl flex items-center px-1">
          <Search className="text-black/20 px-2" size={38} />
          <input
            className="text-black w-[90%] pr-[42px] focus:outline-hidden placeholder-black/25"
            placeholder="search something..."
          />

          <div className="h-[42px] w-[42px] bg-yellow-400 rounded-full flex justify-center items-center">
            {" "}
            <SlidersHorizontal />
          </div>
        </div>
      </div>
      <div className="flex gap-x-4">
        <a>Consultation</a>
        <Link to="listings">Listings</Link>
      </div>
    </div>
  );
}

export function MobileNavbar() {
  const location = useLocation();
  const path = location.pathname;

  // choose navbar style based on route
  const isHome = path === "/";
  const isListing = path.startsWith("/listing");

  if (isListing)
    return (
      <>
        <MobileNavbar2 />
      </>
    );
  if (isHome)
    return (
      <>
        <MobileNavbar1 />
      </>
    );
}

function MobileNavbar1() {
  return (
    <div>
      <div className="flex flex-col gap-3 p-[5%] text-white">
        <div className="flex justify-between ">
          <Link to="/">
            <div className="h-[50px] w-[50px] rounded-full bg-gray-300">
              <img src={Logo} className="rounded-full" />
            </div>
          </Link>
          <Link to="">
            <button className="bg-white/5 p-2 rounded-full m-auto">
              <TextAlignJustify />
            </button>
          </Link>
        </div>
        <div className="relative w-full  h-[45px] bg-white rounded-4xl flex items-center px-1">
          <Search className="text-black/20 px-2" size={38} />
          <input
            className="text-black w-full pr-[42px] focus:outline-hidden placeholder-black/25"
            placeholder="search something..."
          />
          <div className="h-[42px] w-[42px] bg-yellow-400 rounded-full flex justify-center items-center absolute right-[1px]">
            {" "}
            <SlidersHorizontal />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNavbar2() {
  const location = useLocation();

  const handleShare = async () => {
    const shareData = {
      title: "Check out this property!",
      text: "Found a great place on GMBLux!",
      url: window.location.origin + location.pathname, // e.g. https://gmblux.com/listings/123
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="flex justify-between w-full p-[5%] text-white absolute top-0 z-999">
      <Link to="/">
        <button className="bg-black/15 p-2 rounded-full m-auto backdrop-blur-sm">
          <ChevronLeft size={24} />
        </button>
      </Link>
      <div className="flex justify-between gap-3">
        <button
          onClick={handleShare}
          className="bg-black/15 p-3 rounded-full m-auto backdrop-blur-sm"
        >
          <Share size={20} />
        </button>
        <button className="bg-black/15 p-3 rounded-full m-auto backdrop-blur-sm">
          <EllipsisVertical size={20} />
        </button>
      </div>
    </div>
  );
}
