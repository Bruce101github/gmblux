import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import AddProperties from "./pages/AddProperties";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayouts";
import { Toaster, toast } from "react-hot-toast";

function App() {
  return (
    <main>
      <Routes>
        {/* Public route */}
        <Route path="/Login" element={<Login />} />

        {/* Protected admin route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="addproperties" element={<AddProperties />} />
          <Route path="properties" element={<Properties />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </main>
  );
}

export default App;
