import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to check admin status
  const checkAdmin = async (currentUser) => {
    try {
      const { data, error } = await supabase
        .from("admins") // ✅ match your actual table name
        .select("is_admin")
        .eq("user_id", currentUser.id)
        .maybeSingle(); // ✅ avoid error if no row

      if (error) {
        console.error("Error fetching admin status:", error);
        setIsAdmin(false);
      } else if (!data) {
        console.warn("No admin record found for user:", currentUser.id);
        setIsAdmin(false);
      } else {
        setIsAdmin(data.is_admin);
      }
    } catch (err) {
      console.error("Unexpected error checking admin:", err);
      setIsAdmin(false);
    }
  };

  // Initialize session + admin check
  useEffect(() => {
    let subscription;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;
        setUser(session?.user ?? null);

        if (session?.user) {
          await checkAdmin(session.user); // ✅ wait before ending loading
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error initializing auth:", err);
        setLoading(false);
      }

      // Listen for auth state changes (login/logout)
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setUser(session?.user ?? null);
          if (session?.user) {
            await checkAdmin(session.user);
          } else {
            setIsAdmin(false);
          }
          setLoading(false);
        },
      );

      subscription = listener?.subscription;
    };

    init();

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
