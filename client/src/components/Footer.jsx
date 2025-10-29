import { PhoneCall, ChevronUp, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import instagram from "@/assets/instagram.svg";
import tiktok from "@/assets/tiktok.svg";
import facebook from "@/assets/fb.svg";
import whatsapp from "@/assets/whatsapp.svg";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scrolling
    });
  };

  return (
    <div className="bg-[#232323] text-white">
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

export function MobileFooter() {
  return (
    <div className="bg-[#232323] text-white">
      <div className="bg-[#1D1D1D] flex px-[10%] py-[18px] justify-center items-center gap-2">
        <div className="h-[42px] min-w-[42px] rounded-full bg-white/5 p-3">
          <PhoneCall className="h-full w-full object-cover" />
        </div>

        <p className="text-sm ">
          {" "}
          Our support team can assist you with reservation{" "}
          <span className="text-base font-bold">+233 55 394 4428</span>
        </p>
      </div>

      <div className="px-[5%] py-[10%] flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold">GMB Lux</p>
            <Link className="text-xs text-white/50">Terms and Conditions</Link>
            <Link className="text-xs text-white/50">Privacy Policy</Link>
            <Link className="text-xs text-white/50">Cancellation Policy</Link>
            <Link className="text-xs text-white/50">Viewing Policy</Link>
            <Link className="text-xs text-white/50">Booking Guide</Link>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold">About</p>
            <Link className="text-xs text-white/50">Our Story</Link>
            <Link className="text-xs text-white/50">Contact</Link>
            <Link className="text-xs text-white/50">Blog</Link>
            <Link className="text-xs text-white/50">F.A.Q</Link>
          </div>
          <div className="flex gap-3 flex-col">
            <p className="text-sm font-bold">Properties</p>
            <Link className="text-xs text-white/50">Houses</Link>
            <Link className="text-xs text-white/50">Apartments</Link>
            <Link className="text-xs text-white/50">Lands</Link>
          </div>
        </div>
        <div className="flex py-10 justify-center">
          <div className="flex flex-col gap-3 justify-end">
            <p className="text-sm">
              Copyright © 2025. GMBRealEstate. All rights reserved.
            </p>
            <label className="text-lg font-bold">
              Subscribe to our newsletter
            </label>
            <div className="relative h-[42px] full">
              <input
                placeholder="Email address"
                className="border-b border-white/15 py-2 outline-none w-full"
              />
              <button className="h-[40px] w-[47px] bg-white/5 flex justify-center items-center rounded-full absolute top-0 right-0">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className=" text-white flex gap-4 group">
            <a
              href="https://www.instagram.com/gmb_realestate_ghana/"
              target="_blank"
              className="text-white text-lg font-medium  group-hover:text-white/90 hover:text-yellow-400"
            >
              <img src={instagram} className="h-5 w-5" />
            </a>
            <a
              href="https://www.tiktok.com/@gmb_realestateghana?_t=ZM-90x9p6ChCrT&_r=1"
              target="_blank"
              className="text-white text-lg font-medium hover:text-yellow-400  group-hover:text-white/90"
            >
              <img src={tiktok} className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100071139317552"
              target="_blank"
              className="text-white text-lg font-medium hover:text-yellow-400  group-hover:text-white/90"
            >
              <img src={facebook} className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/233553944428?"
              target="_blank"
              className="text-white text-lg font-medium hover:text-yellow-400  group-hover:text-white/90"
            >
              <img src={whatsapp} className="h-5 w-5" />
            </a>
          </div>

          <p className="text-xs text-center">
            Website created by{" "}
            <a className="text-green-500 font-bold">Mckot Digital</a>
          </p>
        </div>
      </div>
    </div>
  );
}
