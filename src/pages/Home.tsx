import { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { useAppDispatch, useAppSelector } from "../../src/app/hook";
import { fetchBlogs } from "../../src/features/blog/blogSlice";
import UserNavbar from "../components/user/UserNavbar";
import UserFooter from "../components/user/UserFooter";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { blog = [], loading, error } = useAppSelector(
    (state) => state.blog,
  );

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // শুধু published blog
  const publishedBlogs = useMemo(() => {
    return blog.filter(
      (item) => item.status?.toLowerCase() === "published",
    );
  }, [blog]);

  const handleViewBlog = (blogId: string) => {
    const accessToken = Cookies.get("accessToken");

    // Register/Login করা user হলে single blog page
    if (accessToken) {
      navigate(`/blog/${blogId}`);
      return;
    }

    // Login করা না থাকলে register page
    navigate("/register");
  };

  if (loading && blog.length === 0) {
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

  return (

    <>

<UserNavbar/>

     <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#111827",
            mb: 0.8,
          }}
        >
          Latest Blogs
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#6b7280",
          }}
        >
          Explore our latest published articles and stories.
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#dc2626",
            }}
          >
            {error}
          </Typography>
        </Box>
      )}

      {/* Empty */}
      {publishedBlogs.length === 0 ? (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed #d1d5db",
            borderRadius: 3,
            backgroundColor: "#ffffff",
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#374151",
            }}
          >
            No published blogs found
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "#6b7280",
            }}
          >
            There are currently no published blogs available.
          </Typography>
        </Box>
      ) : (
        /* Blog Cards */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          {publishedBlogs.map((item) => (
            <Card
              key={item._id}
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                backgroundColor: "#ffffff",
                overflow: "hidden",
                transition: "all 0.2s ease",

                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 2.5,
                  "&:last-child": {
                    pb: 2.5,
                  },
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Title + Status */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1.35,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.title || "Untitled Blog"}
                  </Typography>

                  <Chip
                    label="Published"
                    color="success"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  />
                </Box>

                {/* Category */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "#2563eb",
                    fontWeight: 600,
                    mb: 1.5,
                  }}
                >
                  {item.category || "General"}
                </Typography>

                {/* Content */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    lineHeight: 1.7,
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 115,
                  }}
                >
                  {item.content || "No content available."}
                </Typography>

                {/* Author */}
                {item.auther && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#9ca3af",
                        mb: 0.3,
                      }}
                    >
                      Author
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      {typeof item.auther === "string"
                        ? item.auther
                        : item.auther?.name ||
                          item.auther?.email ||
                          "Unknown Author"}
                    </Typography>
                  </Box>
                )}

                {/* Date */}
                {item.createdAt && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1.5,
                      color: "#9ca3af",
                    }}
                  >
                    Published:{" "}
                    {new Date(
                      item.createdAt,
                    ).toLocaleDateString()}
                  </Typography>
                )}

                {/* View Button */}
                <Box
                  sx={{
                    mt: "auto",
                    pt: 2.5,
                    borderTop: "1px solid #f3f4f6",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewBlog(item._id)}
                    sx={{
                      minWidth: 110,
                      height: 38,
                      px: 2,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    View Blog
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Refresh loading */}
      {loading && blog.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}
    </Box>
    <UserFooter/>
    </>

   
  );
};

export default Home;