import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PropertyLising from "./pages/PropertyListing";
import Property from "./pages/Property";
import Navbar, { MobileNavbar } from "./components/Navbar";
import Footer, { MobileFooter } from "./components/Footer";
import BookingModal from "./components/BookingModal";
import { useMediaQuery } from "react-responsive";
import ScrollToTop from "@/components/ScrollToTop";

function App() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <main className="w-[100vw] bg-[#121420] h-auto overflow-x-hidden">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<PropertyLising />} />
        <Route path="/listing/:id" element={<Property />} />
        <Route path="/booking" element={<BookingModal />} />
      </Routes>
      {isMobile ? <MobileFooter /> : <Footer />}
    </main>
  );
}

export default App;
