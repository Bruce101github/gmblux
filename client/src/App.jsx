import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar, { MobileNavbar } from "./components/Navbar";
import Footer, { MobileFooter } from "./components/Footer";
import { useMediaQuery } from "react-responsive";

function App() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <main className="w-[100vw] bg-[#121420] h-auto overflow-x-hidden">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      {isMobile ? <MobileFooter /> : <Footer />}
    </main>
  );
}

export default App;
