
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";

import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { loginSchema } from "../../schemas/ValidationSchemas";
import { login } from "../../features/auth/authSlice";

import type { LoginCredentials } from "../../typescript/type/index";
import type { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hook";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector(
    (state: RootState) => state.user
  );

  const [showPassword, setShowPassword] = useState(false);
  const savedEmail =
    localStorage.getItem("rememberedEmail") || "";

  const [rememberMe, setRememberMe] = useState(
    Boolean(savedEmail)
  );

  const defaultValues: LoginCredentials = {
    email: savedEmail,
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      if (rememberMe) {
        localStorage.setItem(
          "rememberedEmail",
          data.email
        );
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      const result= await dispatch(login(data)).unwrap();
      console.log("role",result.user?.role);
      
      if(result.user?.role==='admin'){
        navigate("/admin/dashboard")
      }else if(result.user?.role==="writer"){
        navigate("/writer/dashboard")
      }else if(result.user?.role==="user"){
        navigate("/")
      }else{
        navigate("/")
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor: "primary.main",
          }}
        >
          <LockOutlinedIcon/>
        </Avatar>

        <Typography
          component="h1"
          variant="h5"
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Sign in to continue to your dashboard
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            mt: 1,
            width: "100%",
          }}
        >
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={
                        handleClickShowPassword
                      }
                      edge="end"
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "hide password"
                          : "show password"
                      }
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  color="primary"
                  disabled={loading}
                />
              }
              label="Remember me"
            />

            <Link
              to="/reset-password-link"
              style={{
                textDecoration: "none",
              }}
            >
              <Typography
                variant="body2"
                color="primary"
              >
                Forgot password?
              </Typography>
            </Link>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              "Sign In"
            )}
          </Button>
          <Box
            sx={{
              textAlign: "center",
              mt: 2,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                }}
              >
                <strong>Sign Up</strong>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
