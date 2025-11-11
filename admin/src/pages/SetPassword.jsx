import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { EyeOff, Eye } from "lucide-react";

export default function SetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [status, setStatus] = useState("");
  const location = useLocation();

  useEffect(() => {
    // 1) Preferred path: access_token / refresh_token are in the hash (after using {{ .ConfirmationURL }}&redirect_to=...)
    const hashParams = new URLSearchParams(
      window.location.hash.replace(/^#/, ""),
    );
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (accessToken && refreshToken) {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (error) setStatus(error.message);
          // Clean the URL hash after setting session
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        });
      return;
    }

    // 2) Optional legacy path: ?type=invite&token=... (works only if email is present)
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!accessToken && !refreshToken && type === "invite" && token && email) {
      supabase.auth
        .verifyOtp({ email, token, type: "invite" })
        .then(({ error }) => {
          if (error)
            toast.error(error.message, {
              style: {
                borderRadius: "10px",
                background: "#121420",
                color: "#fff",
                border: "0.4px solid gray",
              },
            });
        });
    }
  }, [location.search]);

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

    if (!password || !confirmPassword) {
      toast.error("Please enter and confirm your new password.", {
        style: {
          borderRadius: "10px",
          background: "#121420",
          color: "#fff",
          border: "0.4px solid gray",
        },
      });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        style: {
          borderRadius: "10px",
          background: "#121420",
          color: "#fff",
          border: "0.4px solid gray",
        },
      });
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    console.log("hasSession", sessionData?.session);
    if (!sessionData?.session) {
      toast.error(
        "No active session. Open this page from your invite email link.",
        {
          style: {
            borderRadius: "10px",
            background: "#121420",
            color: "#fff",
            border: "0.4px solid gray",
          },
        },
      );
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error("updateUser error", error);
      toast.error(error.message, {
        style: {
          borderRadius: "10px",
          background: "#121420",
          color: "#fff",
          border: "0.4px solid gray",
        },
      });
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setVisibility({
      password: false,
      confirmPassword: false,
    });
    toast.success("Password updated! You can now log in.", {
      style: {
        borderRadius: "10px",
        background: "#121420",
        color: "#fff",
        border: "0.4px solid gray",
      },
    });
    setTimeout(() => navigate("/"), 300);
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
            type="button"
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
            type="button"
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
