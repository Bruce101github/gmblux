import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121420]">
        <Spinner className="w-8 h-8 text-yellow-400" />
      </div>
    );
  }
  // Match the route path in App.jsx (/Login with capital L)
  if (!user || !isAdmin) return <Navigate to="/Login" replace />;

  return children;
}
