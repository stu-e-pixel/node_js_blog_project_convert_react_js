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
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

import { removeAuthCookies } from "../../utils/cookieUtils";
import { useAppDispatch } from "../../app/hook";
import { logout } from "../../features/auth/authSlice";

const UserNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    removeAuthCookies();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar
        sx={{
          
          
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          Admin Panel
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
              display: "flex",
              alignItems: "center",
              width: { xs: 160, sm: 220, md: 280 },
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

            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                Aaa
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                }}
              >
                aaa@example.com
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UserNavbar;