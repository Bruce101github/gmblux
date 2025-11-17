import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import PropertyLising from "./pages/PropertyListing";
import Property from "./pages/Property";
import Search from "./pages/Search";
import Navbar, { MobileNavbar } from "./components/Navbar";
import Footer, { MobileFooter } from "./components/Footer";
import BookingModal from "./components/BookingModal";
import { useMediaQuery } from "react-responsive";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import { SearchProvider } from "./components/SearchContext";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();
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
      <SmoothScroll>
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
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home
                      menuOpen={menuOpen}
                      setMenuOpen={setMenuOpen}
                      filterOpen={filterOpen}
                      setFilterOpen={setFilterOpen}
                      filters={filters}
                      setFilters={setFilters}
                    />
                  </PageTransition>
                }
              />
              <Route
                path="/listings"
                element={
                  <PageTransition>
                    <PropertyLising
                      filterOpen={filterOpen}
                      setFilterOpen={setFilterOpen}
                      setFilters={setFilters}
                      filters={filters}
                    />
                  </PageTransition>
                }
              />
              <Route 
                path="/listing/:id" 
                element={
                  <PageTransition>
                    <Property />
                  </PageTransition>
                } 
              />
              <Route 
                path="/booking" 
                element={
                  <PageTransition>
                    <BookingModal />
                  </PageTransition>
                } 
              />
              <Route
                path="/search"
                element={
                  <PageTransition>
                    <Search
                      setFilters={setFilters}
                      filters={filters}
                      setFilterOpen={setFilterOpen}
                      filterOpen={filterOpen}
                    />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
          {isMobile ? <MobileFooter /> : <Footer />}
          <Toaster position="top-right" />
        </main>
      </SmoothScroll>
    </SearchProvider>
  );
}

export default App;
