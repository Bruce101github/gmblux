import { createClient } from "@supabase/supabase-js";

// These come from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // Add better error handling for network issues
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  // Add global error handler
  global: {
    headers: {
      'x-client-info': 'gmblux-client',
    },
  },
});
