import { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DraftsIcon from "@mui/icons-material/Drafts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hook";
import { fetchMyBlogs } from "../../features/blog/blogSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { blog = [], loading, error } = useAppSelector((state) => state.blog);
  useEffect(() => {
    dispatch(fetchMyBlogs());
  }, [dispatch]);
  const stats = useMemo(() => {
    const pending = blog.filter(
      (item) => item.status?.toLowerCase() === "pending",
    ).length;

    const published = blog.filter(
      (item) => item.status?.toLowerCase() === "published",
    ).length;

    const draft = blog.filter(
      (item) => item.status?.toLowerCase() === "draft",
    ).length;

    return {
      total: blog.length,
      pending,
      published,
      draft,
    };
  }, [blog]);
  const recentBlogs = useMemo(() => {
    return [...blog]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [blog]);
  const getStatusColor = (
    status?: string,
  ): "warning" | "success" | "error" | "default" => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";

      case "published":
        return "success";

      case "rejected":
        return "error";

      case "draft":
        return "default";

      default:
        return "default";
    }
  };
  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <PendingActionsIcon fontSize="small" />;

      case "published":
        return <CheckCircleIcon fontSize="small" />;

      case "draft":
        return <DraftsIcon fontSize="small" />;

      default:
        return <ArticleIcon fontSize="small" />;
    }
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
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            Welcome Back, Writer
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 1,
              color: "#6b7280",
            }}
          >
            Manage your blogs, track their status and create new content.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/writer/create-blog")}
          sx={{
            minHeight: 42,
            px: 2.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Create Blog
        </Button>
      </Box>

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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.5,
          mb: 4,
        }}
      >
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  Total Blogs
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  {stats.total}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                <ArticleIcon />
              </Box>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1.5,
                color: "#9ca3af",
              }}
            >
              All blogs you have created
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  Pending
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  {stats.pending}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff7ed",
                  color: "#ea580c",
                }}
              >
                <PendingActionsIcon />
              </Box>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1.5,
                color: "#9ca3af",
              }}
            >
              Waiting for admin approval
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  Published
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  {stats.published}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0fdf4",
                  color: "#16a34a",
                }}
              >
                <CheckCircleIcon />
              </Box>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1.5,
                color: "#9ca3af",
              }}
            >
              Successfully published blogs
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  Drafts
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  {stats.draft}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f3f4f6",
                  color: "#4b5563",
                }}
              >
                <DraftsIcon />
              </Box>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1.5,
                color: "#9ca3af",
              }}
            >
              Blogs saved as drafts
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: {
              xs: "100%",
              lg: 320,
            },
            flexShrink: 0,
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Quick Actions
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: "#6b7280",
              }}
            >
              Manage your blog content
            </Typography>

            <Box
              sx={{
                mt: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/writer/create-blog")}
                sx={{
                  justifyContent: "flex-start",
                  minHeight: 46,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Create New Blog
              </Button>

              <Button
                variant="outlined"
                startIcon={<ArticleIcon />}
                onClick={() => navigate("/writer/my-blogs")}
                sx={{
                  justifyContent: "flex-start",
                  minHeight: 46,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Manage My Blogs
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f9fafb",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Blog Status
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  color: "#6b7280",
                  lineHeight: 1.6,
                }}
              >
                New blogs are submitted as pending and require admin approval
                before publishing.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            flex: 1,
            minWidth: 0,
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Recent Blogs
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    color: "#6b7280",
                  }}
                >
                  Your latest blog activity
                </Typography>
              </Box>

              {blog.length > 0 && (
                <Button
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/writer/my-blogs")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  View All
                </Button>
              )}
            </Box>

            <Box
              sx={{
                mt: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {recentBlogs.length === 0 ? (
                <Box
                  sx={{
                    minHeight: 220,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed #d1d5db",
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    p: 3,
                  }}
                >
                  <ArticleIcon
                    sx={{
                      fontSize: 42,
                      color: "#9ca3af",
                    }}
                  />

                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1.5,
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    No blogs yet
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      color: "#6b7280",
                      textAlign: "center",
                    }}
                  >
                    Create your first blog to get started.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/writer/create-blog")}
                    sx={{
                      mt: 2,
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                  >
                    Create Blog
                  </Button>
                </Box>
              ) : (
                recentBlogs.map((item, index) => (
                  <Box key={item._id}>
                    <Box
                      sx={{
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            flexShrink: 0,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f3f4f6",
                            color: "#4b5563",
                          }}
                        >
                          {getStatusIcon(item.status)}
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: "#111827",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.title || "Untitled Blog"}
                          </Typography>

                          <Box
                            sx={{
                              mt: 0.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#6b7280",
                              }}
                            >
                              {item.category || "No category"}
                            </Typography>

                            {item.createdAt && (
                              <>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#d1d5db",
                                  }}
                                >
                                  •
                                </Typography>

                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#9ca3af",
                                  }}
                                >
                                  {new Date(
                                    item.createdAt,
                                  ).toLocaleDateString()}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Chip
                        label={item.status || "Unknown"}
                        color={getStatusColor(item.status)}
                        size="small"
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      />
                    </Box>

                    {index < recentBlogs.length - 1 && <Divider />}
                  </Box>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {loading && blog.length > 0 && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
