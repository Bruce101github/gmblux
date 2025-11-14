import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { EyeOff, Eye, Lock } from "lucide-react";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { TOAST_STYLE } from "@/lib/utils";

// Constants
const REDIRECT_DELAY_MS = 1000; // Delay before redirecting after successful password update

// Password validation function
function validatePassword(password) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }
  return null;
}

export default function SetPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [sessionReady, setSessionReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 1) Preferred path: access_token / refresh_token are in the hash (after using {{ .ConfirmationURL }}&redirect_to=...)
    const hashParams = new URLSearchParams(
      window.location.hash.replace(/^#/, ""),
    );
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    // 2) Optional legacy path: ?type=invite&token=... (works only if email is present)
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (accessToken && refreshToken) {
      // Handle hash-based auth
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (error) {
            toast.error(error.message || "Failed to initialize session.", {
              style: TOAST_STYLE,
            });
            setSessionReady(true); // Allow user to try again
            return;
          }
          // Clean the URL hash after setting session
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
          setSessionReady(true);
        })
        .catch((err) => {
          toast.error("Unexpected error initializing session.", {
            style: TOAST_STYLE,
          });
          setSessionReady(true);
        });
    } else if (type === "invite" && token && email) {
      // Handle invite token path
      supabase.auth
        .verifyOtp({ email, token, type: "invite" })
        .then(({ error }) => {
          if (error) {
            toast.error(error.message, {
              style: TOAST_STYLE,
            });
            setSessionReady(true); // Allow user to try again even on error
          } else {
            setSessionReady(true);
          }
        })
        .catch((err) => {
          toast.error("Failed to verify invitation token.", {
            style: TOAST_STYLE,
          });
          setSessionReady(true); // Allow user to try again
        });
    } else {
      // No auth tokens found - check if user already has a session
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session) {
          setSessionReady(true);
        } else {
          // No session found, but set ready anyway so user sees the form
          // They'll get an error when trying to submit without a session
          setSessionReady(true);
        }
      });
    }
  }, [location.search]);

  async function updatePasswordWithAxios(newPassword) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData?.session) {
      throw new Error("No active session found.");
    }

    const accessToken = sessionData.session.access_token;

    try {
      const response = await axios.put(
        `${supabaseUrl}/auth/v1/user`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: supabaseAnonKey,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      // Axios error handling
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to update password",
        );
      }
      throw error;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!sessionReady) {
      setLoading(false);
      toast.error("Session not initialized yet, please wait...", {
        style: TOAST_STYLE,
      });
      return;
    }

    if (!password || !confirmPassword) {
      setLoading(false);
      toast.error("Please enter and confirm your new password.", {
        style: TOAST_STYLE,
      });
      return;
    }

    // Password strength validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      setLoading(false);
      toast.error(passwordError, {
        style: TOAST_STYLE,
      });
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      toast.error("Passwords do not match.", {
        style: TOAST_STYLE,
      });
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      setLoading(false);
      toast.error(
        "No active session. Open this page from your invite email link.",
        {
          style: TOAST_STYLE,
        },
      );
      return;
    }

    try {
      await updatePasswordWithAxios(password);
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
      toast.success("Password updated! Redirecting...", {
        style: TOAST_STYLE,
      });
      setTimeout(() => navigate("/"), REDIRECT_DELAY_MS);
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update password";
      toast.error(errorMessage, {
        style: TOAST_STYLE,
      });
    }
  }
  const handleVisibility = (inputId) => {
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
            {visibility.password ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        <label htmlFor="confirmPassword" className="text-xs lg:text-sm">
          Confirm Password
        </label>
        <div className="relative mb-6">
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
            {visibility.confirmPassword ? (
              <Eye size={18} />
            ) : (
              <EyeOff size={18} />
            )}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading || !sessionReady}
          className="flex gap-2 w-full p-2 bg-yellow-400 text-white rounded-md font-medium items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Spinner className="w-[18px] h-[18px] " />
          ) : (
            <Lock size={18} />
          )}{" "}
          <span>Set password</span>
        </button>
      </form>
    </div>
  );
}
