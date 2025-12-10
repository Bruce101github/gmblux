import Listings from "../components/Listings";
import Pills from "@/components/Pills";
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
import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Label } from "@/components/ui/label";
import SideMenu from "@/components/SideMenu";

import Filter from "@/components/Filter";
import SEOHead from "@/components/SEOHead";
import StructuredData, { generateOrganizationSchema } from "@/components/StructuredData";

function Home({
  menuOpen,
  setMenuOpen,
  filterOpen,
  setFilterOpen,
  filters,
  setFilters,
}) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [localProperties, setLocalProperties] = useState([]);
  const [bestProperties, setBestProperties] = useState([]);

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
    <>
      <SEOHead
        title="GMB Luxury Properties - Premium Real Estate in Ghana | Houses, Apartments & Land for Sale & Rent"
        description="Find luxury homes, apartments, and properties for sale and rent in Ghana. Browse premium real estate listings in Accra, Kumasi, and across Ghana. Expert property management and consultation services."
        keywords="real estate Ghana, property for sale Ghana, houses for rent Ghana, luxury apartments Accra, property Ghana, real estate Accra, property management Ghana, houses for sale Ghana"
      />
      <StructuredData data={generateOrganizationSchema()} />
      <div className="px-[5%] w-full">
      {menuOpen && <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
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
          <Listings
            smCols={3}
            limit={3}
            tags={["best"]}
            filters={filters}
            properties={bestProperties}
            setProperties={setBestProperties}
          />
        </div>
      </div>
      <div className="overflow-x-auto md:overflow-x-visible no-scrollbar">
        <div className="flex md:grid md:grid-cols-3 gap-4 w-max md:w-full text-white">
          <div className="bg-white rounded-xl p-4  flex gap-x-2 items-center min-w-[250px]">
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
          <div className="bg-white rounded-lg p-4 flex gap-4 items-center min-w-[250px]">
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
          <div className="bg-white rounded-xl p-4 flex gap-x-2 items-center min-w-[250px]">
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
        <Link to="/listings"><p className="my-10 mx-auto bg-yellow-400 rounded-3xl py-2 px-10 text-white font-medium w-full lg:w-fit text-center">All listings</p></Link>
      </div>
      </div>
    </>
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
        <img 
          src={HeroImg} 
          alt="GMB Luxury Properties - Premium Real Estate in Ghana"
          className="w-full h-full object-cover" 
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1009}
          height={1080}
        />
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
        <img 
          src={HeroImg} 
          alt="GMB Luxury Properties - Premium Real Estate in Ghana"
          className="w-full h-full object-cover rounded-2xl" 
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1009}
          height={1080}
        />
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
