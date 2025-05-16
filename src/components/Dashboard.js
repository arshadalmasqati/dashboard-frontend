import React from "react";
import { useTheme } from "@mui/material/styles";
import { Fade, Card, CardContent, Chip, Box, Typography, Button, Container } from "@mui/material";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const theme = useTheme();
  const { currentUser, logout } = useAuth();

  const BASE_URL = "http://localhost:8080";
//URL for Microservices Gateway

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processMsg, setProcessMsg] = React.useState("");

  const processCsv = async () => {
    setIsProcessing(true);
    setProcessMsg("");
    try {
      const response = await fetch(`${BASE_URL}/api/monitoring/process-csv`, {
        method: 'POST',
      });
      if (response.status === 201) {
        setProcessMsg("CSV processed successfully.");
        setIsProcessing(false);
      } else {
        setProcessMsg("Failed to process CSV.");
        setIsProcessing(false);
      }
    } catch (error) {
      setProcessMsg("Error processing CSV.");
      setIsProcessing(false);
      console.error('Error processing CSV:', error);
    }
  }
  
  const [data, setData] = React.useState(null);
  const [statusError, setStatusError] = React.useState("");
  const getStatusDetails = (status) => {
    if (status === 'Green') {
      return { label: 'Safe', color: 'success', description: 'Water is within safe limits.' };
    }
    return { label: 'Unsafe', color: 'warning', description: 'Water quality is below safety standards.' };
  };

  // Polling for latest status
  React.useEffect(() => {
    let isMounted = true;
    let intervalId;
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/water-quality/check`);
        if (response.status === 200) {
          const result = await response.json();
          if (isMounted) {
            setData(result);
            setStatusError("");
          }
        } else {
          if (isMounted) {
            setData(null);
            setStatusError(`Error: Status ${response.status}`);
          }
        }
      } catch (error) {
        if (isMounted) {
          setData(null);
          setStatusError("Error fetching water quality status");
        }
      }
    };
    fetchStatus();
    intervalId = setInterval(fetchStatus, 10000); // poll every 5 seconds
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
            }}
    >
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
          Water Monitoring Dashboard
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Container maxWidth="sm" sx={{ marginTop: theme.spacing(16) }}>


<Typography variant="h5" align="left" gutterBottom>
  Welcome {currentUser.username},
</Typography>

<Button variant="contained" color="primary" onClick={processCsv} disabled={isProcessing}>
  Start
</Button>
<Typography variant="body2" color={processMsg.includes("successfully") ? "success.main" : "error.main"} sx={{ mt: 1, minHeight: '1.5em' }}>
  {processMsg}
</Typography>
        {data ? (
          <Fade in>
            <Card
              sx={{
                maxWidth: 420,
                bgcolor: 'white',
                color: 'text.primary',
                mt: 2,
                boxShadow: 10,
                borderRadius: 4,
                transition: 'box-shadow 0.3s, background 0.3s'
              }}
              elevation={4}
            >
              {}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: data.safetyStatus === 'Green'
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  color: 'common.white',
                  px: 2,
                  py: 1.5,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >

                <Typography variant="h6" fontWeight={700} sx={{ color: 'white', letterSpacing: 1 }}>
                  {getStatusDetails(data.safetyStatus).label}
                </Typography>
              </Box>
              <CardContent>
                {}
                <Chip
                  label={data.safetyStatus}
                  color={data.safetyStatus === 'Green' ? 'success' : 'error'}
                  variant="filled"
                  size="small"
                  sx={{ fontWeight: 700, fontSize: 16, letterSpacing: 1.2, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {getStatusDetails(data.safetyStatus).description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Record ID: {data.objectId}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        ) : (
          <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
            {statusError}
          </Typography>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;
