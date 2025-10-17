import Listings from "../components/Listings";
import {
  PhoneCall,
  SlidersHorizontal,
  ArrowDown,
  Building2,
  CalendarCheck2,
  MapPin,
} from "lucide-react";
import HeroImg from "../assets/hero.jpg";
import "../index.css";
import { useMediaQuery } from "react-responsive";

function Home() {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="px-[5%] w-full">
      {isMobile ? <MobileHero /> : <DesktopHero />}
      <h2 className="flex text-white text-3xl font-md lg:hidden md:hidden pb-3  pt-[30px]">
        Listed Properties
      </h2>
      <div className="flex items-end mb-4 gap-x-4 overflow-x-auto no-scrollbar scroll-smooth text-white">
        <div className="bg-white/15 rounded-3xl shadow px-6 py-10 h-[315px] lg:h-[400px] min-w-[300px] flex flex-col justify-end">
          <div className="h-[70px] w-[70px] bg-white/5 rounded-full p-5 mb-5 flex flex-col justify-left items-end">
            <PhoneCall className="h-full w-full object-cover" />
          </div>
          <p className="text-2xl font-medium min-w-[200px]">
            Start smart, start with a consultation this October.
          </p>
        </div>
        <div className="w-full">
          <h2 className="hidden text-white text-5xl font-md ml-5 mb-5 sm:flex">
            Listed Properties
          </h2>
          <Listings smCols={3} />
        </div>
      </div>
      <div className="flex w-full gap-4 overflow-x-auto no-scrollbar text-white">
        <div className="bg-white rounded-xl p-4  flex gap-x-2 items-center min-w-[350px]">
          <div className="h-[60px] w-[60px] rounded-full bg-blue-300 p-4">
            <Building2 className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-blue-600 text-xl font-bold ">
              Property Management
            </h3>
            <p className="text-black text-sm">
              Hassle-free management for your investments.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 flex gap-4 items-center min-w-[350px]">
          <div className="h-[60px] w-[60px] rounded-full bg-blue-300 p-4">
            <CalendarCheck2 className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-blue-600 text-lg font-bold">
              Fast & Easy Booking
            </h3>
            <p className="text-black text-sm ">
              Schedule your consultation quickly and conveniently.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 flex gap-x-2 items-center min-w-[350px]">
          <div className="h-[60px] w-[60px] rounded-full bg-blue-300 p-4">
            <MapPin className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-blue-600 text-lg font-bold">
              Property Listings
            </h3>
            <p className="text-black text-sm">
              Browse handpicked properties for every need.
            </p>
          </div>
        </div>
      </div>
      <div className="my-[100px]">
        <div className="flex justify-between my-10">
          <div className="flex gap-4">
            <button className="bg-yellow-400 rounded-3xl py-2 px-6 font-bold text-white">
              Rent
            </button>
            <button className="border border-gray-500 text-gray-500 rounded-3xl px-6 py-2">
              Sale
            </button>
          </div>
          <div className="">
            <button>
              <SlidersHorizontal />
            </button>
          </div>
        </div>
        <Listings lgCols={4} limit={8} />
      </div>
    </div>
  );
}

function DesktopHero() {
  return (
    <>
      <h1 className="text-[clamp(3vw,6vw,8vw)]/[1] font-bold text-white">
        Homes That fit <br />
        You Perfect
      </h1>
      <svg width="0" height="0">
        <clipPath id="myClip" clipPathUnits="objectBoundingBox">
          <path d="M 0.55,0.15 A 0.01,0.03 0,0,0 0.56,0.12 L 0.56,0.03  A 0.01,0.03 0,0,1 0.57,0 L 0.99,0  A 0.01,0.03 0,0,1 1,0.03 L 1,0.97  A 0.01,0.03 0,0,1 0.99,1 L 0.01,1  A 0.01,0.03 0,0,1 0,0.97 L 0,0.33  A 0.01,0.03 0,0,1 0.01,0.3 L 0.49,0.3  A 0.01,0.03 0,0,0 0.5,0.27 L 0.5,0.18  A 0.01,0.03 0,0,1 0.51,0.15 Z" />
        </clipPath>
      </svg>

      <div className="w-full h-[60vh] mt-[-18vh] path">
        <img src={HeroImg} className="w-full h-full object-cover" />
      </div>
      <div className="h-[120px] w-[120px] bg-yellow-400 rounded-full p-[5px] transform -translate-y-1/2 mx-auto text-white">
        <div className="h-[110px] w-[110px] border border-white rounded-full p-5">
          <ArrowDown className="w-full h-full object-cover" />
        </div>
      </div>
    </>
  );
}

function MobileHero() {
  return (
    <>
      <h1 className="text-5xl mt-5 text-white">Homes That fit You Perfect</h1>
      <div className="w-full h-[48vh] mt-5">
        <img src={HeroImg} className="w-full h-full object-cover rounded-2xl" />
      </div>
      <div className="h-[80px] w-[80px] bg-yellow-400 rounded-full p-[5px] transform -translate-y-1/2 mx-auto text-white">
        <div className="h-[70px] w-[70px] border border-white rounded-full p-3">
          <ArrowDown className="w-full h-full object-cover" />
        </div>
      </div>
    </>
  );
}

export default Home;
