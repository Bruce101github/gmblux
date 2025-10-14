import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddProperties from "./pages/AddProperties";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayouts";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Protected admin route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="admin/addproperties" element={<AddProperties />} />
      </Route>
    </Routes>
  );
}

export default App;
