import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return children;
}
