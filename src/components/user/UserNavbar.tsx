
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

import Cookies from "js-cookie";

import { removeAuthCookies } from "../../utils/cookieUtils";
import { useAppDispatch } from "../../app/hook";
import { logout } from "../../features/auth/authSlice";

const UserNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const accessToken = Cookies.get("accessToken");
  const isLoggedIn = Boolean(accessToken);

  const handleProfileClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleSignup = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    removeAuthCookies();
    dispatch(logout());

    handleClose();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#8bd7df",
        color: "#111827",
        borderBottom: "1px solid #6497c0",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 64,
        }}
      >

        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          sx={{
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Blog Website
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
              width: {
                sm: 220,
                md: 280,
              },
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              px: 1,
            }}
          >
            <SearchIcon
              sx={{
                color: "#6b7280",
                fontSize: 21,
              }}
            />

            <TextField
              variant="standard"
              placeholder="Search..."
              fullWidth
              sx={{
                ml: 1,

                "& .MuiInput-underline:before": {
                  borderBottom: "none",
                },

                "& .MuiInput-underline:after": {
                  borderBottom: "none",
                },

                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottom: "none",
                },
              }}
            />
          </Box>

          {isLoggedIn ? (
            <>

              <IconButton
                onClick={handleProfileClick}
                sx={{
                  p: 0,
                }}
              >
                <Avatar
                  sx={{
                    width: 42,
                    height: 42,
                    backgroundColor: "#2563eb",
                    fontWeight: 600,
                  }}
                >
                  A
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      width: 250,
                      borderRadius: "12px",
                    },
                  },
                }}
              >

                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    User
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                    }}
                  >
                    Logged in user
                  </Typography>
                </Box>

                <Divider />

                <MenuItem onClick={handleMyProfile}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>

                  <ListItemText primary="My Profile" />
                </MenuItem>

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: "#dc2626",
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon
                      fontSize="small"
                      sx={{
                        color: "#dc2626",
                      }}
                    />
                  </ListItemIcon>

                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </>
          ) : (

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleLogin}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                }}
              >
                Login
              </Button>

              <Button
                variant="contained"
                onClick={handleSignup}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UserNavbar;
