import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import instagram from "../assets/instagram.svg";
import tiktok from "../assets/tiktok.svg";
import fb from "../assets/fb.svg";
import whatsapp from "../assets/whatsapp.svg";

export default function SideMenu({ menuOpen, setMenuOpen }) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: menuOpen ? 0 : "100%" }}
      transition={
        menuOpen
          ? { duration: 0.6, ease: "easeOut" }
          : { duration: 0.4, ease: "easeIn" }
      }
      className="absolute top-0 w-full h-full bg-[#121420] mx-[-5%] px-[5%] fixed py-[20px] z-1000 overflow-hidden"
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
        <Link to="/listings" onClick={() => setMenuOpen(false)}>Listings</Link>
        <Link
          to="/listings"
          state={{ preset: "rent" }}
          className=" hover:text-yellow-400"
          onClick={() => setMenuOpen(false)}
        >
          Rent
        </Link>
        <Link
          to="/listings"
          state={{ preset: "sale" }}
          className=" hover:text-yellow-400"
          onClick={() => setMenuOpen(false)}
        >
          Buy
        </Link>
        <Link
          to="/about"
          className=" hover:text-yellow-400"
          onClick={() => setMenuOpen(false)}
        >
          Our Story
        </Link>
        <Link
          to="/booking"
          state={{ preset: "contact" }}
          className=" hover:text-yellow-400"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>{" "}
        <Link
          to="/booking"
          state={{ preset: "consultation" }}
          className=" hover:text-yellow-400"
          onClick={() => setMenuOpen(false)}
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
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="text-white text-lg font-medium  group-hover:text-white/90 hover:text-yellow-400"
            >
              <img src={instagram} alt="Instagram" className="h-5 w-5" />
            </a>
            <a
              href="https://www.tiktok.com/@gmb_realestateghana?_t=ZM-90x9p6ChCrT&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on TikTok"
              className="text-white text-lg font-medium hover:text-yellow-400  group-hover:text-white/90"
            >
              <img src={tiktok} alt="TikTok" className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100071139317552"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="text-white text-lg font-medium hover:text-yellow-400  group-hover:text-white/90"
            >
              <img src={fb} alt="Facebook" className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/233553944428?"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              className="text-white text-lg font-medium hover:text-yellow-400  group-hover:text-white/90"
            >
              <img src={whatsapp} alt="WhatsApp" className="h-5 w-5" />
            </a>
          </div>
      </div>
    </motion.div>
  );
}
