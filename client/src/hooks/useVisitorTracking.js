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

        // Debug logging (remove in production if needed)
        console.log("🔍 Tracking visit:", { today, deviceType, pagePath });

        // Try RPC function first
        const { data: rpcData, error: rpcError } = await supabase.rpc("increment_visitor_count", {
          p_date: today,
          p_device_type: deviceType,
          p_page_path: pagePath,
        });

        if (rpcError) {
          console.warn("⚠️ Visitor tracking RPC failed:", rpcError);
          console.log("📝 Attempting direct upsert as fallback...");
          
          // Fallback: Try to get existing record and increment, or insert new
          const { data: existing } = await supabase
            .from("visitor_tracking")
            .select("visit_count")
            .eq("date", today)
            .eq("device_type", deviceType)
            .eq("page_path", pagePath)
            .single();

          if (existing) {
            // Update existing record
            const { error: updateError } = await supabase
              .from("visitor_tracking")
              .update({ 
                visit_count: (existing.visit_count || 1) + 1,
                updated_at: new Date().toISOString()
              })
              .eq("date", today)
              .eq("device_type", deviceType)
              .eq("page_path", pagePath);

            if (updateError) {
              console.error("❌ Visitor tracking update error:", updateError);
            } else {
              console.log("✅ Visit tracked via update fallback");
            }
          } else {
            // Insert new record
            const { error: insertError } = await supabase
              .from("visitor_tracking")
              .insert({
                date: today,
                device_type: deviceType,
                page_path: pagePath,
                visit_count: 1,
              });

            if (insertError) {
              // Check if it's a duplicate key error (race condition)
              const isDuplicate = insertError.code === "23505" || 
                                 insertError.message?.toLowerCase().includes("duplicate") ||
                                 insertError.message?.toLowerCase().includes("unique");
              
              if (!isDuplicate) {
                console.error("❌ Visitor tracking insert error:", insertError);
              } else {
                console.log("ℹ️ Race condition - duplicate visit, trying update...");
                // Try update one more time in case of race condition
                // First get the current count
                const { data: retryData } = await supabase
                  .from("visitor_tracking")
                  .select("visit_count")
                  .eq("date", today)
                  .eq("device_type", deviceType)
                  .eq("page_path", pagePath)
                  .single();
                
                if (retryData) {
                  const { error: retryError } = await supabase
                    .from("visitor_tracking")
                    .update({ 
                      visit_count: (retryData.visit_count || 1) + 1,
                      updated_at: new Date().toISOString()
                    })
                    .eq("date", today)
                    .eq("device_type", deviceType)
                    .eq("page_path", pagePath);
                  
                  if (retryError) {
                    console.error("❌ Retry update failed:", retryError);
                  } else {
                    console.log("✅ Visit tracked via retry update");
                  }
                }
              }
            } else {
              console.log("✅ Visit tracked via insert fallback");
            }
          }
        } else {
          console.log("✅ Visit tracked via RPC function");
        }
      } catch (error) {
        console.error("❌ Visitor tracking error:", error);
      }
    };

    // Small delay to ensure page is loaded and Supabase client is ready
    const timeoutId = setTimeout(() => {
      trackVisit();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
}

