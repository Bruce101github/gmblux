import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { KeySquare } from "lucide-react";
import { TOAST_STYLE } from "@/lib/utils";

// Email validation helper
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error("Please enter both email and password.", {
        style: TOAST_STYLE,
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.", {
        style: TOAST_STYLE,
      });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Failed to login. Try again!", {
        style: TOAST_STYLE,
      });
      return;
    }
    // on success the auth listener will update AuthContext
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121420] px-[5%]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white/10 rounded shadow rounded-2xl"
      >
        <h2 className="text-xl font-bold mb-4 text-white/60">Sign in</h2>
        <input
          className="w-full mb-3 p-2 border border-white/10 rounded-md text-white placeholder:text-white/40"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type={visibility ? "text" : "password"}
          className="w-full mb-3 p-2 border border-white/10 rounded-md text-white placeholder:text-white/40"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="flex justify-center items-center gap-2 w-full p-2 bg-yellow-400 text-white rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <Spinner className="w-[18px] h-[18px] " />
          ) : (
            <KeySquare size={18} />
          )}{" "}
          <span>Sign in</span>
        </button>
      </form>
    </div>
  );
}
