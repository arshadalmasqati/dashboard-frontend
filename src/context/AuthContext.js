import React, { createContext, useContext, useState, useEffect } from "react";

const BASE_URL = "http://localhost:8000";
//Can be changed when using gateway

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [userListMsg, setUserListMsg] = useState("");

  // Store token and user in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Login: POST /auth/login
  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) {
        const data = await res.json();
        // Decode JWT to get role (or fetch from backend if needed)
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        setToken(data.token);
        setCurrentUser({ username: payload.sub || username, role: payload.role });
        setLoading(false);
        return { success: true, role: payload.role };
      } else if (res.status === 401) {
        setLoading(false);
        return { success: false, message: "Invalid username or password" };
      } else {
        setLoading(false);
        return { success: false, message: res.statusText };
      }
    } catch (err) {
      setLoading(false);
      console.error("Login fetch error:", err);
      return {
        success: false,
        message:
          "Network error: " +
          err.message +
          ". Is the backend running at http://localhost:8080 and is CORS enabled?",
      };
    }
  };

  // Logout: clear token and user
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };



  // Register: POST /auth/register (admin only)
  const register = async (username, password) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) {
        return { success: true };
      } else if (res.status === 401) {
        logout();
        return { success: false, message: "Unauthorized. Please login again." };
      } else if (res.status === 403) {
        return { success: false, message: "Access denied. Admin only." };
      } else {
        const data = await res.text();
        return { success: false, message: data || "Registration failed" };
      }
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  };
  // Change password: POST /auth/change-password (admin only)
  const changePassword = async (username, newPassword) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, newPassword }),
      });
      if (res.status === 200) {
        return { success: true };
      } else if (res.status === 401) {
        logout();
        return { success: false, message: "Unauthorized. Please login again." };
      } else if (res.status === 403) {
        return { success: false, message: "Access denied. Admin only." };
      } else {
        const data = await res.text();
        return { success: false, message: data || "Change password failed" };
      }
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  };

  // Delete user: DELETE /admin/delete/{username} (admin only)
  const deleteUser = async (username) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const res = await fetch(`${BASE_URL}/admin/delete/${encodeURIComponent(username)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        return { success: true };
      } else if (res.status === 401) {
        logout();
        return { success: false, message: "Unauthorized. Please login again." };
      } else if (res.status === 403) {
        return { success: false, message: "Access denied. Admin only." };
      } else {
        const data = await res.text();
        return { success: false, message: data || "Delete user failed" };
      }
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        const data = await res.json();
        setUsers(data);
        setUserListMsg("");
      } else if (res.status === 401) {
        logout();
      } else if (res.status === 403) {
        setUserListMsg("Access denied. Admin only.");
      } else {
        setUserListMsg("Failed to fetch user list.");
      }
    } catch (err) {
      setUserListMsg("Network error fetching user list.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        login,
        register,
        logout,
        deleteUser,
        fetchUsers,
        changePassword,
        loading,
        users,
        userListMsg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
