import { tourRequestEmail } from "./emails/tourRequestEmail.ts";
import { adminNotificationEmail } from "./emails/adminNotificationEmail.ts";

// Get environment variables
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const NOTIFICATION_EMAILS = Deno.env.get("NOTIFICATION_EMAILS");
// Import Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const handler = async (_request) => {
  try {
    // 🧠 Check keys
    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({
          error: "Missing environment variables",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    // 📦 Fetch bookings that haven't been notified
    const { data: bookings, error } = await supabase
      .from("booking")
      .select("*")
      .eq("notified", false);
    if (error) throw error;
    if (!bookings || bookings.length === 0) {
      console.log("No new bookings to notify.");
      return new Response(
        JSON.stringify({
          status: "no new bookings",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // ✉️ Send email for each booking
    for (const booking of bookings) {
      const {
        first_name,
        last_name,
        email,
        request_type,
        property_id,
        id,
        message,
        number,
      } = booking;

      const { data: property, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", property_id)
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      if (!property) {
        console.error("❌ No property found for ID:", property_id);
        throw new Error(`Property not found for ID: ${property_id}`);
      }

      const { title, location, bedrooms, bathrooms, size, price, images } =
        property;

      const image = images?.[0];
      const formattedPrice = price.toLocaleString();

      // Fill in the template placeholders
      const html = tourRequestEmail({
        first_name: first_name,
        request_type: request_type,
        email: email,
        last_name: last_name,
        title: title,
        location: location,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        size: size,
        formattedPrice: formattedPrice,
        image: image,
        property_id: property_id,
      });

      const html1 = adminNotificationEmail({
        first_name: first_name,
        request_type: request_type,
        email: email,
        last_name: last_name,
        title: title,
        location: location,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        size: size,
        formattedPrice: formattedPrice,
        image: image,
        property_id: property_id,
        message: message,
        number: number,
      });

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "GMB LUX <noreply@gmblux.com>",
          to: [
            `${email}`, // ${templates.booking.email}
          ],
          subject: `Your Property ${request_type} Request Has Been Received`,
          html,
        }),
      });
      const res1 = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "GMB LUX NOTIFICATION <noreply@gmblux.com>",
          to: [
            `${NOTIFICATION_EMAILS}` // ${templates.booking.email}
          ],
          subject: `New Property ${request_type} Request.`,
          html: html1,
        }),
      });

      const data = await res.json();
      const data1 = await res1.json();
      if (!res.ok) {
        console.error("failed to send email for booking:", id, data);
        continue;
      }
      if (!res1.ok) {
        console.error("failed to send email for booking:", id, data1);
        continue;
      }

      console.log("✅ Email sent for booking:", id);
      // ✅ Mark booking as notified
      await supabase
        .from("booking")
        .update({
          notified: true,
        })
        .eq("id", id);
    }
    return new Response(
      JSON.stringify({
        status: "success",
        sent: bookings.length,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        status: "failed",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
// Start the server
Deno.serve(handler);
