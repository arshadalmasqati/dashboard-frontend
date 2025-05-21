import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import RiverDataview from "./components/RiverDataview";
import Navbar from "./components/Navbar";

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
  const showNavbar = location.pathname !== "/login";

  return (
    <>
      {showNavbar && <Navbar />}
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
    </>
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
