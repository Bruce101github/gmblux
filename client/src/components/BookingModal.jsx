import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useState, useEffect, useRef } from "react";
import { bookingPresets } from "../utils/bookingPreset";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Toaster, toast } from "react-hot-toast";

function BookingModal({ setBookingOpen }) {
  const location = useLocation();
  const presetName = location.state?.preset || "rent"; // fallback
  const preset = bookingPresets.find((p) => p.name === presetName);
  const property_id = location.state?.propertyId;
  const [loading, setLoading] = useState(true);
  const formPreset = {
    first_name: "",
    last_name: "",
    email: "",
    number: "",
    message: preset.preText,
    request_type: preset.type,
    property_id: property_id,
  };
  const [formData, setFormData] = useState({ ...formPreset });

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };
    if (document.readyState === "complete") {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  function handleState(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(name, value);
  }

  async function submitBooking(e) {
    e.preventDefault();
    toast.loading("Sending...", {
      style: {
        borderRadius: "10px",
        background: "#121420",
        color: "#fff",
        border: "0.4px solid gray",
      },
    }); // show loading toast
    try {
      const { data, error } = await supabase
        .from("booking")
        .insert({ ...formData });

      if (error) throw error;
      setTimeout(() => {
        toast.dismiss(); // remove the loading one
        toast.success("Form submitted successfully!", {
          style: {
            borderRadius: "10px",
            background: "#121420",
            color: "#fff",
            border: "0.4px solid gray",
          },
        });
        setFormData({ ...formPreset });
        // show success
      }, 2000);
    } catch (err) {
      console.error("Error inserting booking!");
      toast.dismiss(); // remove the loading one
      toast.error("Failed to submit!", {
        style: {
          borderRadius: "10px",
          background: "#121420",
          color: "#fff",
          border: "0.4px solid gray",
        },
      });
    }

    // Example async action
  }

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
    <form
      onSubmit={submitBooking}
      className="w-full h-full px-[5%] flex flex-col text-white mt-5 gap-3 "
    >
      <label htmlFor="first_name">First Name</label>
      <input
        className="border-b border-white/20  p-2 outline-none text-white/70 bg-white/2"
        type="text"
        required
        onChange={handleState}
        value={formData.first_name}
        name="first_name"
      />
      <label htmlFor="last_name">Last Name</label>
      <input
        className="border-b border-white/20  p-2 outline-none  text-white/70 bg-white/2"
        type="text"
        required
        onChange={handleState}
        name="last_name"
        value={formData.last_name}
      />

      <label htmlFor="email">Email</label>
      <input
        className="border-b border-white/20  p-2 outline-none text-white/70 bg-white/2"
        type="email"
        required
        onChange={handleState}
        name="email"
        value={formData.email}
      />
      <label htmlFor="number">Number</label>
      <input
        className="border-b border-white/20  p-2 outline-none text-white/70  bg-white/2"
        type="text"
        required
        onChange={handleState}
        name="number"
        value={formData.number}
      />
      <label htmlFor="message">Message</label>
      <textarea
        rows="5"
        cos="40"
        className="border-b border-white/20  p-2 outline-none text-white/70 bg-white/2"
        name="message"
        onChange={handleState}
        value={formData.message}
        defaultValue={preset.preText}
      />
      <button
        type="submit"
        className="bg-yellow-400 px-2 py-4 rounded-4xl my-5"
      >
        Send
      </button>
      <div className="pb-[100px]">
        <p className="text-xs text-white/70 mt-2">
          By contacting this property you agree to our{" "}
          <Link to="/" className="underline">
            Terms of Use
          </Link>
          . Visit our{" "}
          <Link to="/" className="underline">
            Privacy Policy
          </Link>{" "}
          for more information. When you click "Send request", we’ll forward
          your inquiry to the property manager, who will reach out to you
          swiftly to answer your questions.
        </p>
      </div>
    </form>
  );
}

export default BookingModal;
