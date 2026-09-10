import { useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArticleIcon from "@mui/icons-material/Article";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hook";
import type { RootState } from "../../app/store";

import {
  getAllUsersThunk,
  getPendingWritersThunk,
} from "../../features/auth/authSlice";

import { fetchMyBlogs } from "../../features/blog/blogSlice";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /* ================= REDUX STATE ================= */

  const {
    users = [],
    pendingWriters = [],
    loading: authLoading,
  } = useAppSelector((state: RootState) => state.user);

  const {
    blog = [],
    loading: blogLoading,
  } = useAppSelector((state: RootState) => state.blog);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    dispatch(getAllUsersThunk());
    dispatch(getPendingWritersThunk());
    dispatch(fetchMyBlogs());
  }, [dispatch]);

  /* ================= NORMAL USERS ================= */

  const normalUsers = useMemo(() => {
    return users.filter(
      (user) => user.role === "user"
    );
  }, [users]);

  /* ================= BLOG COUNTS ================= */

  const pendingBlogs = useMemo(() => {
    return blog.filter(
      (item) =>
        item.status?.toLowerCase() === "pending"
    );
  }, [blog]);

  const publishedBlogs = useMemo(() => {
    return blog.filter(
      (item) =>
        item.status?.toLowerCase() === "published"
    );
  }, [blog]);

  const rejectedBlogs = useMemo(() => {
    return blog.filter(
      (item) =>
        item.status?.toLowerCase() === "rejected"
    );
  }, [blog]);

  /* ================= LOADING ================= */

  const loading = authLoading || blogLoading;

  /* ================= CARD WIDTH ================= */

  const cardWrapperSx = {
    flex: {
      xs: "1 1 100%",
      sm: "1 1 calc(50% - 10px)",
      md: "1 1 calc(33.333% - 17px)",
    },
    minWidth: 0,
  };

  /* ================= CARD STYLE ================= */

  const clickableCardSx = {
    height: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: 3,
    cursor: "pointer",
    boxShadow: "none",
    transition: "all 0.2s ease",

    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    },
  };

  const normalCardSx = {
    height: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: 3,
    boxShadow: "none",
  };

  /* ================= STAT CARD CONTENT ================= */

  const renderStatContent = (
    title: string,
    value: number,
    description: string,
    icon: React.ReactNode,
  ) => {
    return (
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#111827",
                mt: 0.5,
              }}
            >
              {value}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "#6b7280",
                mt: 0.5,
              }}
            >
              {description}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f9fafb",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    );
  };

  /* ================= LOADING SCREEN ================= */

  if (loading && users.length === 0 && blog.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /* ================= DASHBOARD ================= */

  return (
    <Box
      sx={{
        width: "100%",
        p: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Admin Dashboard
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            mt: 0.5,
          }}
        >
          Manage users, writers and blogs from one place.
        </Typography>
      </Box>

      {/* ================= STATS ================= */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2.5,
        }}
      >
        {/* ================= NORMAL USERS ================= */}

        <Box sx={cardWrapperSx}>
          <Card
            onClick={() => navigate("/admin/user")}
            sx={clickableCardSx}
          >
            {renderStatContent(
              "Normal Users",
              normalUsers.length,
              "Registered normal users",
              <PeopleIcon
                sx={{
                  fontSize: 32,
                  color: "#2563eb",
                }}
              />,
            )}
          </Card>
        </Box>

        {/* ================= PENDING WRITERS ================= */}

        <Box sx={cardWrapperSx}>
          <Card
            onClick={() => navigate("/admin/writer")}
            sx={clickableCardSx}
          >
            {renderStatContent(
              "Pending Writers",
              pendingWriters.length,
              "Writers waiting for approval",
              <PersonAddIcon
                sx={{
                  fontSize: 32,
                  color: "#d97706",
                }}
              />,
            )}
          </Card>
        </Box>

        {/* ================= TOTAL BLOGS ================= */}

        <Box sx={cardWrapperSx}>
          <Card
            onClick={() => navigate("/admin/adminblog")}
            sx={clickableCardSx}
          >
            {renderStatContent(
              "Total Blogs",
              blog.length,
              "All blogs in the system",
              <ArticleIcon
                sx={{
                  fontSize: 32,
                  color: "#7c3aed",
                }}
              />,
            )}
          </Card>
        </Box>

        {/* ================= PENDING BLOGS ================= */}

        <Box sx={cardWrapperSx}>
          <Card
            onClick={() => navigate("/admin/writerblog")}
            sx={clickableCardSx}
          >
            {renderStatContent(
              "Pending Blogs",
              pendingBlogs.length,
              "Blogs waiting for approval",
              <PendingIcon
                sx={{
                  fontSize: 32,
                  color: "#d97706",
                }}
              />,
            )}
          </Card>
        </Box>

        {/* ================= PUBLISHED BLOGS ================= */}

        <Box sx={cardWrapperSx}>
          <Card sx={normalCardSx}>
            {renderStatContent(
              "Published Blogs",
              publishedBlogs.length,
              "Successfully published blogs",
              <CheckCircleIcon
                sx={{
                  fontSize: 32,
                  color: "#16a34a",
                }}
              />,
            )}
          </Card>
        </Box>

        {/* ================= REJECTED BLOGS ================= */}

        <Box sx={cardWrapperSx}>
          <Card sx={normalCardSx}>
            {renderStatContent(
              "Rejected Blogs",
              rejectedBlogs.length,
              "Rejected blogs",
              <CancelIcon
                sx={{
                  fontSize: 32,
                  color: "#dc2626",
                }}
              />,
            )}
          </Card>
        </Box>
      </Box>

      {/* ================= SUMMARY ================= */}

      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexWrap: "wrap",
          gap: 2.5,
        }}
      >
        {/* USER SUMMARY */}

        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              md: "1 1 calc(50% - 10px)",
            },
          }}
        >
          <Card
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#111827",
                  mb: 2,
                }}
              >
                User Overview
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280" }}
                >
                  Normal Users
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#2563eb",
                  }}
                >
                  {normalUsers.length}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280" }}
                >
                  Pending Writers
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#d97706",
                  }}
                >
                  {pendingWriters.length}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280" }}
                >
                  Total Registered Users
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {users.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* BLOG SUMMARY */}

        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              md: "1 1 calc(50% - 10px)",
            },
          }}
        >
          <Card
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#111827",
                  mb: 2,
                }}
              >
                Blog Overview
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280" }}
                >
                  Total Blogs
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#7c3aed",
                  }}
                >
                  {blog.length}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280" }}
                >
                  Pending
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#d97706",
                  }}
                >
                  {pendingBlogs.length}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280" }}
                >
                  Published
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  {publishedBlogs.length}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280" }}
                >
                  Rejected
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#dc2626",
                  }}
                >
                  {rejectedBlogs.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;