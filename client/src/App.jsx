import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PropertyLising from "./pages/PropertyListing";
import Property from "./pages/Property";
import Search from "./pages/Search";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CancellationPolicy from "./pages/CancellationPolicy";
import ViewingPolicy from "./pages/ViewingPolicy";
import BookingGuide from "./pages/BookingGuide";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Navbar, { MobileNavbar } from "./components/Navbar";
import Footer, { MobileFooter } from "./components/Footer";
import BookingModal from "./components/BookingModal";
import SideMenu from "./components/SideMenu";
import { useMediaQuery } from "react-responsive";
import ScrollToTop from "@/components/ScrollToTop";
import { SearchProvider } from "./components/SearchContext";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useVisitorTracking } from "./hooks/useVisitorTracking";

function App() {
  // Track visitors on public site only (NOT admin panel)
  useVisitorTracking();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    listingType: "all",
    propertyType: "all",
    bedrooms: "any",
    bathrooms: "any",
    price: [0, 10000000],
  });

  return (
    <SearchProvider>
      <main className="w-[100vw] bg-[#121420] h-auto overflow-x-hidden">
        {isMobile ? (
          <MobileNavbar
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />
        ) : (
          <Navbar />
        )}
        <ScrollToTop />
        {isMobile && <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                filters={filters}
                setFilters={setFilters}
              />
            }
          />
          <Route
            path="/listings"
            element={
              <PropertyLising
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                setFilters={setFilters}
                filters={filters}
              />
            }
          />
          <Route path="/listing/:id" element={<Property />} />
          <Route path="/booking" element={<BookingModal />} />
          <Route
            path="/search"
            element={
              <Search
                setFilters={setFilters}
                filters={filters}
                setFilterOpen={setFilterOpen}
                filterOpen={filterOpen}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/viewing-policy" element={<ViewingPolicy />} />
          <Route path="/booking-guide" element={<BookingGuide />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
        {isMobile ? <MobileFooter /> : <Footer />}
        <Toaster position="top-right" />
      </main>
    </SearchProvider>
  );
}

export default App;
