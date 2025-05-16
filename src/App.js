import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";

function isAdminRole(role) {
  return role === "admin" || role === "ROLE_ADMIN";
}

// Protected route for authenticated users
function PrivateRoute({ children, role }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (role && ((role === "admin" && !isAdminRole(currentUser.role)) || (role !== "admin" && currentUser.role !== role))) {
    // If role is specified and doesn't match, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// Wrapper to handle login and redirect
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
    // Already logged in, redirect
    if (isAdminRole(currentUser.role)) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Login onLogin={handleLogin} />;
}

function AppRoutes() {
  return (
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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
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
