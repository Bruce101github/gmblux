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
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { bookingPresets } from "@/utils/bookingPreset";
import { useSearch } from "../components/SearchContext";
import { supabase } from "../supabaseClient";

export default function Navbar() {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, setSubmittedSearch, submittedSearch } =
    useSearch();

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault(); // prevents form reload
      setSearchTerm(e.target.value);
      setSubmittedSearch(searchTerm);
      setTimeout(() => {
        navigate("/search");
      }, 100);
    }
  }

  return (
    <div className="flex w-auto justify-between px-[10%] pt-[20px] pb-[5%] text-white">
      <div className="flex gap-4">
        <div className="h-[50px] w-[50px] rounded-full bg-gray-300">
          <img 
            src={Logo} 
            alt="GMB Luxury Properties Logo" 
            className="rounded-full" 
            width={50}
            height={50}
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="relative min-w-[400px] bg-white rounded-4xl flex items-center px-1">
          <Search className="text-black/20 px-2" size={38} />
          <input
            className="text-black w-[90%] pr-[42px] focus:outline-hidden placeholder-black/25"
            placeholder="search something..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
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

export function MobileNavbar({ menuOpen, setMenuOpen, setFilterOpen }) {
  const location = useLocation();
  const path = location.pathname;

  // choose navbar style based on route
  const isHome = path === "/";
  const isListing = path.startsWith("/listings");
  const isProperty = path.startsWith("/listing/");
  const isBooking = path.startsWith("/booking");
  const isSearch = path.startsWith("/search");

  if (isListing)
    return (
      <>
        <MobileNavbar4 setFilterOpen={setFilterOpen} />
      </>
    );

  if (isProperty)
    return (
      <>
        <MobileNavbar2 />
      </>
    );

  if (isHome)
    return (
      <>
        <MobileNavbar1
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          setFilterOpen={setFilterOpen}
        />
      </>
    );

  if (isBooking)
    return (
      <>
        <MobileNavbar3 />
      </>
    );

  if (isSearch)
    return (
      <>
        <MobileNavbar4 setFilterOpen={setFilterOpen} />
      </>
    );
}

function MobileNavbar1({ menuOpen, setMenuOpen, setFilterOpen }) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, setSubmittedSearch, submittedSearch } =
    useSearch();

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault(); // prevents form reload
      setSearchTerm(e.target.value);
      setSubmittedSearch(searchTerm);
      setTimeout(() => {
        navigate("/listings");
      }, 100);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 p-[5%] text-white">
        <div className="flex justify-between ">
          <Link to="/">
            <div className="h-[50px] w-[50px] rounded-full bg-gray-300">
              <img 
                src={Logo} 
                alt="GMB Luxury Properties Logo" 
                className="rounded-full" 
                width={50}
                height={50}
                loading="eager"
                decoding="async"
              />
            </div>
          </Link>
          <Link to="">
            <button
              className="bg-white/5 p-2 rounded-full m-auto"
              onClick={() => {
                setMenuOpen(true);
              }}
            >
              <TextAlignJustify />
            </button>
          </Link>
        </div>
        <div className="flex justify-between items-center gap-4">
          <div className="relative w-[85%]  h-[45px] bg-white rounded-4xl flex items-center ">
            <Search className="text-black/20 px-2" size={38} />
            <input
              className="text-black w-full pr-[24px] focus:outline-hidden placeholder-black/25"
              placeholder="search something..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>{" "}
          <button
            className=" bg-yellow-400 rounded-full flex justify-center items-center p-2"
            onClick={() => {
              setFilterOpen(true);
            }}
          >
            {" "}
            <SlidersHorizontal />
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileNavbar2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  // Fetch property data for dynamic share text
  useEffect(() => {
    async function fetchProperty() {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          setProperty(data);
        }
      } catch (err) {
        // Silently fail - will use fallback text
      }
    }

    // Only fetch if we're on a property page
    if (location.pathname.startsWith("/listing/") && id) {
      fetchProperty();
    }
  }, [id, location.pathname]);

  const handleBack = () => {
    // If there's no history, fallback to home
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/"); // fallback
    }
  };

  const handleShare = async () => {
    // Create dynamic share text based on property data
    let shareText = "Checkout this property listed on gmblux";
    
    if (property) {
      const bedrooms = property.bedrooms || "";
      const propertyType = property.property_type?.toLowerCase() || "property";
      const location = property.location || "";
      
      shareText = `Checkout this ${bedrooms} bedroom ${propertyType} @ ${location} listed on gmblux`;
    }

    const shareData = {
      title: property 
        ? `${property.bedrooms} Bedroom ${property.property_type} for ${property.listing_type} in ${property.location}`
        : "Check out this property!",
      text: shareText,
      url: window.location.origin + location.pathname, // e.g. https://gmblux.com/listing/123
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied!");
      }
    } catch (err) {
      // Share failed silently - user can copy link manually
    }
  };

  return (
    <div className="flex justify-between w-full p-[5%] text-white z-999 absolute top-0">
      <button
        onClick={handleBack}
        className="bg-black/15 p-2 rounded-full backdrop-blur-sm w-10 h-10"
      >
        <ChevronLeft size={24} />
      </button>
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

function MobileNavbar3() {
  const navigate = useNavigate();
  const location = useLocation();
  const presetName = location.state?.preset;
  const preset = bookingPresets.find((p) => p.name === presetName);

  const handleBack = () => {
    // If there's no history, fallback to home
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/"); // fallback
    }
  };

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
      // Share failed silently - user can copy link manually
    }
  };

  return (
    <div className="flex items-center grid grid-cols-3 w-full p-[5%] text-white z-999">
      <button
        onClick={handleBack}
        className="bg-white/10 p-2 rounded-full backdrop-blur-sm w-10 h-10"
      >
        <ChevronLeft size={24} />
      </button>
      <h2 className="text-lg font-medium min-w-[120px] text-center">
        {preset.title}
      </h2>
    </div>
  );
}

function MobileNavbar4({ setFilterOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const presetName = location.state?.preset;
  const preset = bookingPresets.find((p) => p.name === presetName);
  const { searchTerm, setSearchTerm, submittedSearch, setSubmittedSearch } =
    useSearch();

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault(); // prevents form reload
      setSearchTerm(e.target.value);
      setSubmittedSearch(searchTerm);
    }
  }

  const handleBack = () => {
    // If there's no history, fallback to home
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/"); // fallback
    }
  };

  return (
    <div className="flex flex-col gap-10 p-[5%] text-white">
      <div className="flex items-center grid grid-cols-3 ">
        <button
          onClick={handleBack}
          className="bg-white/10 p-2 rounded-full backdrop-blur-sm w-10 h-10"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-medium min-w-[135px] text-center">
          Search Property
        </h2>
      </div>
      <div className="flex justify-between">
        <div className="relative w-[85%]  h-[45px] bg-white rounded-4xl flex items-center px-1">
          <Search className="text-black/20 px-2" size={38} />
          <input
            className="text-black w-full pr-[42px] focus:outline-hidden placeholder-black/25"
            placeholder="search something..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>{" "}
        <button
          className="h-[42px] w-[42px] bg-yellow-400 rounded-full flex justify-center items-center p-2"
          onClick={() => {
            setFilterOpen(true);
          }}
        >
          {" "}
          <SlidersHorizontal />
        </button>
      </div>
    </div>
  );
}
