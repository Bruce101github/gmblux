import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PropertyLising from "./pages/PropertyListing";
import Property from "./pages/Property";
import Search from "./pages/Search";
import Navbar, { MobileNavbar } from "./components/Navbar";
import Footer, { MobileFooter } from "./components/Footer";
import BookingModal from "./components/BookingModal";
import { useMediaQuery } from "react-responsive";
import ScrollToTop from "@/components/ScrollToTop";
import { SearchProvider } from "./components/SearchContext";
import { useState } from "react";

function App() {
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
        </Routes>
        {isMobile ? <MobileFooter /> : <Footer />}
      </main>
    </SearchProvider>
  );
}

export default App;
