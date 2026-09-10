
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import { useAppDispatch, useAppSelector } from "../app/hook";
import { sendResetLink } from "../features/auth/authSlice";

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const result = await dispatch(sendResetLink(email));

    if (sendResetLink.fulfilled.match(result)) {
      
      setEmail("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 450,
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
          }}
        >
          
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <EmailOutlinedIcon fontSize="large" />
            </Box>

            <Typography
              
            >
              Forgot Password?
            </Typography>

            <Typography
              sx={{
                mt: 1,
                maxWidth: 350,
              }}
            >
              Enter your registered email address and we'll
              send you a password reset link.
            </Typography>
          </Box>

          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
              required
              disabled={loading}
              error={Boolean(error)}
              helperText={error}
              autoComplete="email"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.4,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <Button
              type="button"
              fullWidth
              variant="text"
              disabled={loading}
              onClick={() => navigate("/login")}
              sx={{
                mt: 1,
                fontWeight: 500,
              }}
            >
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;