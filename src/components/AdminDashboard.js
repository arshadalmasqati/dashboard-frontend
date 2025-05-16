import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Stack
} from "@mui/material";
import { useAuth } from "../context/AuthContext";


function AdminDashboard() {
  const theme = useTheme();
  const { currentUser, token, logout, register, deleteUser, fetchUsers, changePassword, users, userListMsg } = useAuth();

  // State for create user
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [createMsg, setCreateMsg] = useState("");

  // State for change password
  const [pwUsername, setPwUsername] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  // Fetch user list
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [token]);

  // Handle create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      setCreateMsg("Username and password required");
      return;
    }
    const result = await register(newUsername, newPassword);
    if (result.success) {
      setCreateMsg("User created");
      setNewUsername("");
      setNewPassword("");
      fetchUsers();
    } else {
      setCreateMsg(result.message || "Failed to create user");
    }
  };

  // Handle delete user
  const handleDeleteUser = async (username) => {
    if (username === "admin") {
      alert("Cannot delete admin user");
      return;
    }
    if (window.confirm(`Delete user "${username}"?`)) {
      const result = await deleteUser(username);
      if (result.success) {
        fetchUsers();
      } else {
        alert(result.message || "Failed to delete user");
      }
    }
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwUsername || !pwNew) {
      setPwMsg("Username and new password required");
      return;
    }
    const result = await changePassword(pwUsername, pwNew);
    if (result.success) {
      setPwMsg("Password changed");
      setPwUsername("");
      setPwNew("");
    } else {
      setPwMsg(result.message || "Failed to change password");
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'linear-gradient(135deg, rgb(95, 103, 255), rgb(123, 164, 254))',
      }}
    >
      {/* Navigation Bar */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: theme.spacing(2),
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <Typography variant="h3" align="left" gutterBottom>
          Admin Dashboard
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Container maxWidth="md" sx={{ marginTop: theme.spacing(16), marginBottom: theme.spacing(4) }}>
        <Paper elevation={3} sx={{ padding: theme.spacing(4) }}>
          <Typography variant="h5" align="center" gutterBottom>
            Welcome, {currentUser?.username}!
          </Typography>

          {/* User List */}
          <Box sx={{ marginY: 4 }}>
            <Typography variant="h6" gutterBottom>Delete Users</Typography>
            {userListMsg && (
              <Alert severity="error" sx={{ mb: 2 }}>{userListMsg}</Alert>
            )}
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Users</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.filter(u => u.role !== "ROLE_ADMIN").map(u => (
                    <TableRow key={u.username}>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>
                        {u.username !== "admin" && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteUser(u.username)}
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Create User */}
          <Box sx={{ marginY: 4 }}>
            <Typography variant="h6" gutterBottom>Create User</Typography>
            <form onSubmit={handleCreateUser}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Username"
                  variant="outlined"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  size="small"
                />
                <Button type="submit" variant="contained" color="primary">
                  Create
                </Button>
              </Stack>
            </form>
            {createMsg && (
              <Alert
                severity={createMsg === "User created" ? "success" : "error"}
                sx={{ mt: 2 }}
              >
                {createMsg}
              </Alert>
            )}
          </Box>

          {/* Change Password */}
          <Box sx={{ marginY: 4 }}>
            <Typography variant="h6" gutterBottom>Change Password</Typography>
            <form onSubmit={handleChangePassword}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Username"
                  variant="outlined"
                  value={pwUsername}
                  onChange={e => setPwUsername(e.target.value)}
                  size="small"
                />
                <TextField
                  label="New Password"
                  type="password"
                  variant="outlined"
                  value={pwNew}
                  onChange={e => setPwNew(e.target.value)}
                  size="small"
                />
                <Button type="submit" variant="contained" color="primary">
                  Change
                </Button>
              </Stack>
            </form>
            {pwMsg && (
              <Alert
                severity={pwMsg === "Password changed" ? "success" : "error"}
                sx={{ mt: 2 }}
              >
                {pwMsg}
              </Alert>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminDashboard;
