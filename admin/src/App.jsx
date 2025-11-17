import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import AddProperties from "./pages/AddProperties";
import Bookings from "./pages/Bookings";
import Customers from "./pages/Customers";
import Marketing from "./pages/Marketing";
import Reports from "./pages/Reports";
import Tools from "./pages/Tools";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayouts";
import { Toaster, toast } from "react-hot-toast";

function App() {
  return (
    <main>
      <Routes>
        {/* Public route */}
        <Route path="/Login" element={<Login />} />
        <Route path="/setpassword" element={<SetPassword />} />

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
          <Route path="bookings" element={<Bookings />} />
          <Route path="customers" element={<Customers />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="reports" element={<Reports />} />
          <Route path="tools" element={<Tools />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </main>
  );
}

export default App;
