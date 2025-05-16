import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box,TextField, Button, Typography, Container, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";

function Login({ onLogin }) {
  const theme = useTheme();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      setError("");
      // Normalize admin role for redirect
      const normalizedRole = result.role === "ROLE_ADMIN" ? "admin" : result.role;
      if (onLogin) onLogin(normalizedRole);
    } else {
      setError(result.message || "Invalid username or password");
    }
  };

  return (
    <Box
  sx={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(135deg,rgb(95, 103, 255),rgb(123, 164, 254))',
  }}
>
  <Typography variant="h3" align="center" gutterBottom>
    Water Monitoring Dashboard
  </Typography>
  <Container maxWidth="sm">



      <Paper elevation={3} style={{ padding: theme.spacing(4), marginTop: theme.spacing(10) }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography variant="body2" color="error" align="center" style={{ marginBottom: theme.spacing(2) }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Paper>
      </Container>
</Box>
  );
}

export default Login;
