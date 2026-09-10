import React, { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";

import PublishIcon from "@mui/icons-material/Publish";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useAppDispatch, useAppSelector } from "../../app/hook";

import { approveExistingBlog, fetchMyBlogs } from "../../features/blog/blogSlice";

import type { Blog, User } from "../../typescript/type";

const WriterBlog = () => {
  const dispatch = useAppDispatch();

  const { blog = [], loading, error } = useAppSelector((state) => state.blog);
  useEffect(() => {
    dispatch(fetchMyBlogs());
  }, [dispatch]);
  const writerBlogs = useMemo(() => {
    return blog.filter((item: Blog) => {
      if (!item?.auther) {
        return false;
      }
      if (typeof item.auther === "string") {
        return false;
      }

      return item.auther.role === "writer";
    });
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
  const getAuthorName = (author: User | string) => {
    if (typeof author === "string") {
      return author;
    }

    return author?.name || author?.email || "Unknown Author";
  };
  const handlePublish = async (blogId: string) => {
    const confirmPublish = window.confirm(
      "Are you sure you want to publish this blog?",
    );

    if (!confirmPublish) {
      return;
    }

    try {
      await dispatch(approveExistingBlog(blogId)).unwrap();
    } catch (error) {
      console.error("Error publishing blog:", error);
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
          mb: 3,
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
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Writer Blogs
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: "#6b7280",
            }}
          >
            Manage writer blogs and publish pending blogs.
          </Typography>
        </Box>

        <Chip label={`${writerBlogs.length} Blogs`} variant="outlined" />
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

      {writerBlogs.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <Chip label={`All: ${writerBlogs.length}`} variant="outlined" />

          <Chip
            label={`Pending: ${
              writerBlogs.filter(
                (item) => item.status?.toLowerCase() === "pending",
              ).length
            }`}
            color="warning"
            variant="outlined"
          />

          <Chip
            label={`Published: ${
              writerBlogs.filter(
                (item) => item.status?.toLowerCase() === "published",
              ).length
            }`}
            color="success"
            variant="outlined"
          />

          <Chip
            label={`Draft: ${
              writerBlogs.filter(
                (item) => item.status?.toLowerCase() === "draft",
              ).length
            }`}
            variant="outlined"
          />
        </Box>
      )}

      {writerBlogs.length === 0 ? (
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
            p: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#374151",
            }}
          >
            No writer blogs found
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            There are currently no blogs created by writers.
          </Typography>
        </Box>
      ) : (

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {writerBlogs.map((item) => (
            <Card
              key={item._id}
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                backgroundColor: "#ffffff",
                height: "100%",
                transition: "all 0.2s ease",

                "&:hover": {
                  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 2.5,
                  "&:last-child": {
                    pb: 2.5,
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >

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
                      lineHeight: 1.3,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.title || "Untitled Blog"}
                  </Typography>

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

                <Typography
                  variant="body2"
                  sx={{
                    color: "#2563eb",
                    fontWeight: 600,
                    mb: 1.5,
                  }}
                >
                  {item.category || "No category"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    lineHeight: 1.7,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 95,
                  }}
                >
                  {item.content || "No content available."}
                </Typography>

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
                      {getAuthorName(item.auther)}
                    </Typography>

                    {typeof item.auther !== "string" && item.auther.email && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "#6b7280",
                          mt: 0.3,
                        }}
                      >
                        {item.auther.email}
                      </Typography>
                    )}
                  </Box>
                )}

                {item.createdAt && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1.5,
                      color: "#9ca3af",
                    }}
                  >
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </Typography>
                )}
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid #f3f4f6",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",

                    width: "100%",
                    minHeight: 60,

                    boxSizing: "border-box",
                    flexShrink: 0,

                    overflow: "visible",
                  }}
                >
                  {item.status?.toLowerCase() === "pending" && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<PublishIcon />}
                      disabled={loading}
                      onClick={() => handlePublish(item._id)}
                      sx={{
                        height: 38,
                        minWidth: 105,
                        px: 2,

                        flexShrink: 0,
                        whiteSpace: "nowrap",

                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Publish
                    </Button>
                  )}
                  {item.status?.toLowerCase() === "published" && (
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      disabled
                      sx={{
                        height: 38,
                        minWidth: 115,
                        px: 2,

                        flexShrink: 0,
                        whiteSpace: "nowrap",

                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",

                        opacity: 1,

                        color: "#16a34a",
                        borderColor: "#16a34a",

                        "&:hover": {
                          borderColor: "#16a34a",
                          backgroundColor: "#f0fdf4",
                        },

                        "&.Mui-disabled": {
                          color: "#16a34a",
                          borderColor: "#16a34a",
                          opacity: 1,
                        },

                        "&.Mui-disabled .MuiSvgIcon-root": {
                          color: "#16a34a",
                        },

                        "& .MuiButton-startIcon": {
                          color: "#16a34a",
                          marginRight: 0.8,
                        },
                      }}
                    >
                      Published
                    </Button>
                  )}
                  {item.status?.toLowerCase() === "draft" && (
                    <Chip
                      label="Draft"
                      size="small"
                      sx={{
                        height: 32,
                        px: 1,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {loading && blog.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}
    </Box>
  );
};

export default WriterBlog;
