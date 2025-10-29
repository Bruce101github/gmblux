import Listings from "../components/Listings";
import Pills from "@/components/Pills";
import {
  PhoneCall,
  SlidersHorizontal,
  ArrowDown,
  Building2,
  CalendarCheck2,
  MapPin,
  X,
} from "lucide-react";
import HeroImg from "../assets/hero.jpg";
import "../index.css";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Label } from "@/components/ui/label";
import instagram from "../assets/instagram.svg";
import tiktok from "../assets/tiktok.svg";
import fb from "../assets/fb.svg";
import whatsapp from "../assets/whatsapp.svg";

import Filter from "@/components/Filter";

function Home({
  menuOpen,
  setMenuOpen,
  filterOpen,
  setFilterOpen,
  filters,
  setFilters,
}) {
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = HeroImg;
    img.onload = () => setHeroLoaded(true);
  }, []);

  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleLoad = () => {
      if (heroLoaded) {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    if (document.readyState === "complete") {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, [heroLoaded]);

  const isMobile = useMediaQuery({ maxWidth: 767 });
  useEffect(() => {}, [filters]);

  if (loading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#121420] transition-opacity duration-400 ${
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Spinner size={64} variant={"ring"} className="text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="px-[5%] w-full">
      {menuOpen ? (
        <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      ) : null}
      {filterOpen ? (
        <Filter
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          setFilters={setFilters}
          filters={filters}
        />
      ) : null}
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
          <Listings smCols={3} limit={3} />
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
          <Pills filters={filters} setFilters={setFilters} />;
          <div className="text-white">
            <button
              onClick={() => {
                setFilterOpen(true);
              }}
            >
              <SlidersHorizontal />
            </button>
          </div>
        </div>
        <Listings
          lgCols={4}
          limit={8}
          filters={filters}
          setFilters={setFilters}
        />
        <button>All listings</button>
      </div>
    </div>
  );
}

function DesktopHero() {
  return (
    <>
      <h1 className="text-[clamp(3vw,6vw,8vw)]/[1] font-bold text-white">
        Homes That fit <br />
        You Perfectly
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
      <h1 className="text-5xl mt-5 text-white">Homes That fit You Perfectly</h1>
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

function SideMenu({ menuOpen, setMenuOpen }) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: menuOpen ? 0 : "100%" }}
      transition={
        menuOpen
          ? { duration: 0.6, ease: "easeOut" }
          : { duration: 0.4, ease: "easeIn" }
      }
      className="absolute top-0 w-full h-full bg-[#121420] mx-[-5%] px-[5%] fixed py-[20px] z-1000"
    >
      <div className="flex justify-end ">
        <button
          className="text-white/90 bg-white/5 p-1.5 rounded-full w-10 h-10 flex justify-center items-center"
          onClick={() => {
            setMenuOpen(false);
          }}
        >
          <X size={38} />
        </button>
      </div>
      <div className="text-white text-5xl flex flex-col gap-2 mt-10 ">
        <Link to="/listings">Listings</Link>
        <Link
          to="/listings"
          state={{ preset: "rent" }}
          className=" hover:text-yellow-400"
        >
          Rent
        </Link>
        <Link
          to="/listings"
          state={{ preset: "sale" }}
          className=" hover:text-yellow-400"
        >
          Buy
        </Link>
        <Link
          to="/booking"
          state={{ preset: "contact" }}
          className=" hover:text-yellow-400"
        >
          Contact
        </Link>{" "}
        <Link
          to="/booking"
          state={{ preset: "consultation" }}
          className=" hover:text-yellow-400"
        >
          Consultation
        </Link>
      </div>
      <div className="fixed bottom-10">
        <p className="text-yellow-400 font-medium mb-3">Socials</p>
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
            <img src={fb} className="h-5 w-5" />
          </a>
          <a
            href="https://wa.me/233553944428?"
            target="_blank"
            className="text-white text-lg font-medium hover:text-yellow-400  group-hover:text-white/90"
          >
            <img src={whatsapp} className="h-5 w-5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
