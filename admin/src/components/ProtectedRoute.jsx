import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  console.log("👤 ProtectedRoute — user:", user);
  console.log("🔑 ProtectedRoute — isAdmin:", isAdmin);
  console.log("⏳ ProtectedRoute — loading:", loading);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin)
    return <div className="p-8 text-center">Unauthorized — admin only.</div>;

  return children;
}
