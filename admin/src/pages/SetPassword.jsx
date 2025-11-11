import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { EyeOff, Eye } from "lucide-react";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    // listen for the recovery/invite event
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY" || event === "USER_UPDATED") {
          console.log("User needs to set password");
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) setStatus(error.message);
    else setStatus("Password updated! You can now log in.");
  };

  const handleVisibility = (inputId) => {
    console.log(inputId);

    setVisibility((prev) => ({
      ...prev,
      [inputId]: !prev[inputId],
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121420] px-[5%]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white/10 rounded shadow rounded-2xl text-white"
      >
        <h2 className="text-lg font-bold text-center">Set Password</h2>
        <p className="text-xs lg:text-sm text-white/60 text-center mb-4 ">
          Keep your password safe and never share it. It helps protect your
          account.
        </p>
        <label htmlFor="password" className="text-xs lg:text-sm">
          Password
        </label>
        <div className="relative mb-3">
          <input
            id="password"
            type={visibility.password ? "text" : "password"}
            className="w-full  p-2 border border-white/10 rounded-md text-white placeholder:text-white/40"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="absolute inset-y-0 right-2 flex items-center text-white/60 hover:text-white"
            onClick={() => handleVisibility("password")}
          >
            {visibility.password ? <Eye /> : <EyeOff />}
          </button>
        </div>
        <label htmlFor="confirmPassword" className="text-xs lg:text-sm">
          Confirm Password
        </label>
        <div className="relative mb-3">
          <input
            id="confirmPassword"
            type={visibility.confirmPassword ? "text" : "password"}
            className="w-full p-2 border border-white/10 rounded-md text-white placeholder:text-white/40"
            placeholder="Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="absolute inset-y-0 right-2 flex items-center text-white/60 hover:text-white"
            onClick={() => handleVisibility("confirmPassword")}
          >
            {visibility.confirmPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-yellow-400 text-white rounded-md font-bold"
        >
          Set Password
        </button>
      </form>
    </div>
  );
}
