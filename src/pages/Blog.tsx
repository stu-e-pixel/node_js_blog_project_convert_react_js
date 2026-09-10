
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useAppDispatch, useAppSelector } from "../../src/app/hook";
import { fetchBlogs } from "../../src/features/blog/blogSlice";
import UserNavbar from "../components/user/UserNavbar";

import Cookies from "js-cookie";
import UserFooter from "../components/user/UserFooter";

const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { blog, loading, error } = useAppSelector(
    (state) => state.blog,
  );

  // =========================
  // CHECK LOGIN
  // =========================

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    // User login না করলে register page এ পাঠাবে
    if (!accessToken) {
      navigate("/register", { replace: true });
    }
  }, [navigate]);

  // =========================
  // FETCH BLOGS
  // =========================

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken && !blog.length) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, blog.length]);

  // =========================
  // SELECT BLOG
  // =========================

  const selectedBlog = blog.find(
    (item) => item._id === id,
  );

  // =========================
  // LOADING
  // =========================

  if (loading && !selectedBlog) {
    return (
      <>
        <UserNavbar />

        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error && !selectedBlog) {
    return (
      <>
        <UserNavbar />

        <Box
          sx={{
            minHeight: "70vh",
            maxWidth: 900,
            mx: "auto",
            px: 2,
            py: 6,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#dc2626",
              fontWeight: 600,
            }}
          >
            {error}
          </Typography>

          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </Box>
      </>
    );
  }

  // =========================
  // BLOG NOT FOUND
  // =========================

  if (!selectedBlog) {
    return (
      <>
        <UserNavbar />

        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Blog not found
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            This blog may have been removed or is not available.
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </Box>
      </>
    );
  }

  // =========================
  // SINGLE BLOG
  // =========================

  return (
    <>
      <UserNavbar />

      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#f8fafc",
          py: {
            xs: 3,
            sm: 4,
            md: 6,
          },
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 950,
            mx: "auto",
          }}
        >
          {/* BACK BUTTON */}

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              color: "#374151",
              fontWeight: 600,
              textTransform: "none",

              "&:hover": {
                backgroundColor: "#e5e7eb",
              },
            }}
          >
            Back
          </Button>

          {/* BLOG CARD */}

          <Box
            sx={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: {
                xs: 2,
                sm: 3,
              },
              overflow: "hidden",
              boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
            }}
          >
            <Box
              sx={{
                p: {
                  xs: 2.5,
                  sm: 4,
                  md: 5,
                },
              }}
            >
              {/* CATEGORY + STATUS */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 2.5,
                }}
              >
                <Chip
                  label={
                    typeof selectedBlog.category === "string"
                      ? selectedBlog.category
                      : selectedBlog.category ||
                        "Uncategorized"
                  }
                  size="small"
                  sx={{
                    color: "#2563eb",
                    backgroundColor: "#eff6ff",
                    fontWeight: 600,
                  }}
                />

                <Chip
                  label={selectedBlog.status || "Published"}
                  color="success"
                  size="small"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* TITLE */}

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.2,
                  mb: 2.5,
                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3rem",
                  },
                  wordBreak: "break-word",
                }}
              >
                {selectedBlog.title || "Untitled Blog"}
              </Typography>

              {/* AUTHOR */}

              {selectedBlog.auther && (
                <Box
                  sx={{
                    mb: 3,
                    pb: 3,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9ca3af",
                      mb: 0.5,
                    }}
                  >
                    Written by
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    {typeof selectedBlog.auther === "string"
                      ? selectedBlog.auther
                      : selectedBlog.auther.name ||
                        selectedBlog.auther.email ||
                        "Unknown Author"}
                  </Typography>

                  {typeof selectedBlog.auther !== "string" &&
                    selectedBlog.auther.email && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "#6b7280",
                          mt: 0.3,
                        }}
                      >
                        {selectedBlog.auther.email}
                      </Typography>
                    )}
                </Box>
              )}

              {/* CREATED DATE */}

              {selectedBlog.createdAt && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#9ca3af",
                    mb: 3,
                  }}
                >
                  Published on{" "}
                  {new Date(
                    selectedBlog.createdAt,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              )}

              {/* CONTENT */}

              <Typography
                component="div"
                sx={{
                  color: "#374151",
                  fontSize: {
                    xs: "1rem",
                    sm: "1.05rem",
                  },
                  lineHeight: 1.9,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {selectedBlog.content || "No content available."}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <UserFooter/>
    </>
  );
};

export default Blog;

