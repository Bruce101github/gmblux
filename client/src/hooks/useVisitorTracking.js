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

// Get IP address (client-side, may be approximate)
async function getIPAddress() {
  try {
    // Try to get IP from a public service
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || null;
  } catch (error) {
    // Fallback: Try another service
    try {
      const response = await fetch('https://ipapi.co/ip/');
      const ip = await response.text();
      return ip.trim() || null;
    } catch (fallbackError) {
      console.warn("Could not fetch IP address:", fallbackError);
      return null;
    }
  }
}

export function useVisitorTracking() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const deviceType = getDeviceType();
        const pagePath = location.pathname || "/";
        const ipAddress = await getIPAddress(); // Get IP address

        // Try RPC function first
        const { data: rpcData, error: rpcError } = await supabase.rpc("increment_visitor_count", {
          p_date: today,
          p_device_type: deviceType,
          p_page_path: pagePath,
          p_ip_address: ipAddress,
        });

        if (rpcError) {
          console.log("🔍 RPC failed, using fallback:", rpcError.message);
          // Fallback: Try to get existing record and increment, or insert new
          const { data: existing } = await supabase
            .from("visitor_tracking")
            .select("visit_count")
            .eq("date", today)
            .eq("device_type", deviceType)
            .eq("page_path", pagePath)
            .single();

          if (existing) {
            // Update existing record (get IP if not already set)
            const ipAddress = await getIPAddress();
            const { error: updateError } = await supabase
              .from("visitor_tracking")
              .update({
                visit_count: (existing.visit_count || 1) + 1,
                updated_at: new Date().toISOString(),
                ip_address: ipAddress || existing.ip_address
              })
              .eq("date", today)
              .eq("device_type", deviceType)
              .eq("page_path", pagePath);

            if (updateError) {
              console.warn("❌ Visitor tracking update error:", updateError);
            } else {
              console.log("✅ Visit tracked via fallback update");
            }
          } else {
            // Insert new record
            const ipAddress = await getIPAddress(); // Get IP for insert
            const { error: insertError } = await supabase
              .from("visitor_tracking")
              .insert({
                date: today,
                device_type: deviceType,
                page_path: pagePath,
                visit_count: 1,
                ip_address: ipAddress,
              });

            if (insertError) {
              // Check if it's a duplicate key error (race condition)
              const isDuplicate = insertError.code === "23505" ||
                                 insertError.message?.toLowerCase().includes("duplicate") ||
                                 insertError.message?.toLowerCase().includes("unique");

              if (!isDuplicate) {
                console.warn("Visitor tracking insert error:", insertError);
              } else {
                // Race condition - try update one more time
                const { data: retryData } = await supabase
                  .from("visitor_tracking")
                  .select("visit_count")
                  .eq("date", today)
                  .eq("device_type", deviceType)
                  .eq("page_path", pagePath)
                  .single();

                if (retryData) {
                  const ipAddress = await getIPAddress();
                  const { error: retryError } = await supabase
                    .from("visitor_tracking")
                    .update({
                      visit_count: (retryData.visit_count || 1) + 1,
                      updated_at: new Date().toISOString(),
                      ip_address: ipAddress || retryData.ip_address
                    })
                    .eq("date", today)
                    .eq("device_type", deviceType)
                    .eq("page_path", pagePath);

                  if (retryError) {
                    console.warn("❌ Visitor tracking retry update failed:", retryError);
                  } else {
                    console.log("✅ Visit tracked via retry update");
                  }
                }
              }
            } else {
              console.log("✅ Visit tracked via fallback insert");
            }
          }
        } else {
          console.log("✅ Visit tracked via RPC function");
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

