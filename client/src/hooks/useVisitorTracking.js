import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

// Detect device type
function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function useVisitorTracking() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const deviceType = getDeviceType();
        const pagePath = location.pathname || "/";

        // Call the RPC function to increment visitor count
        const { error } = await supabase.rpc("increment_visitor_count", {
          p_date: today,
          p_device_type: deviceType,
          p_page_path: pagePath,
        });

        if (error) {
          console.warn("Visitor tracking error:", error);
        }
      } catch (error) {
        console.warn("Visitor tracking error:", error);
      }
    };

    // Small delay to ensure page is loaded and Supabase client is ready
    const timeoutId = setTimeout(() => {
      trackVisit();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
}

