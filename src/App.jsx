import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import RiverDataview from "./components/RiverDataview";
import Sidebar from "./components/Sidebar";
import { Box, Toolbar } from "@mui/material";

function isAdminRole(role) {
  return role === "admin" || role === "ROLE_ADMIN";
}

function PrivateRoute({ children, role }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (
    role &&
    ((role === "admin" && !isAdminRole(currentUser.role)) ||
      (role !== "admin" && currentUser.role !== role))
  ) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function LoginWrapper() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (isAdminRole(role)) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  if (currentUser) {
    return isAdminRole(currentUser.role) ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  return <Login onLogin={handleLogin} />;
}

function AppRoutes() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/login";

  return (
    <Box sx={{ display: "flex" }}>
      {showSidebar && <Sidebar />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {showSidebar && <Toolbar />} {/* spacing below drawer title */}
        <Routes>
          <Route path="/login" element={<LoginWrapper />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dataview"
            element={
              <PrivateRoute>
                <RiverDataview />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
