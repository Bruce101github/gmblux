import { PhoneCall, ChevronUp, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scrolling
    });
  };

  return (
    <div className="bg-[#232323]">
      <div className="flex items-center gap-4 justify-center py-10 bg-[#1D1D1D] px-[10%]">
        <div className="h-[70px] w-[70px] rounded-full bg-white/5 p-5">
          <PhoneCall className="h-full w-full object-cover" />
        </div>
        <p>
          Our support team can assist you with reservation{" "}
          <span className="text-lg font-bold">055 394 4428</span>
        </p>
      </div>
      <div className="flex py-10 px-[10%] justify-between">
        <div className="flex flex-col gap-6 justify-end">
          <p className="text-sm">
            Copyright © 2025. GMBRealEstate. <br />
            All rights reserved.
          </p>
          <label className="text-lg font-bold">
            Subscribe to our newsletter
          </label>
          <div className="relative h-[42px] w-[300px]">
            <input
              placeholder="Email address"
              className="border-b border-white/15 py-2 outline-none w-full"
            />
            <button className="h-[40px] w-[47px] bg-white/5 flex justify-center items-center rounded-full absolute top-0 right-0">
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-md font-bold">GMB Lux</p>
          <Link className="text-sm text-white/50">Terms and Conditions</Link>
          <Link className="text-sm text-white/50">Privacy Policy</Link>
          <Link className="text-sm text-white/50">Cancellation Policy</Link>
          <Link className="text-sm text-white/50">Viewing Policy</Link>
          <Link className="text-sm text-white/50">Booking Guide</Link>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-md font-bold">About</p>
          <Link className="text-sm text-white/50">Our Story</Link>
          <Link className="text-sm text-white/50">Contact</Link>
          <Link className="text-sm text-white/50">Blog</Link>
          <Link className="text-sm text-white/50">F.A.Q</Link>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="flex flex-col gap-3">
              <p className="text-md font-bold">Properties</p>
              <Link className="text-sm text-white/50">Houses</Link>
              <Link className="text-sm text-white/50">Apartments</Link>
              <Link className="text-sm text-white/50">Land</Link>
            </div>
            <button
              onClick={scrollToTop}
              className="h-[40px] w-[47px] bg-white/5 flex justify-center items-center rounded-full"
            >
              <ChevronUp />
            </button>
          </div>
          <div>
            <p className="text-sm">
              Website created by{" "}
              <a className="text-green-500 font-bold">Mckot Digital</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
