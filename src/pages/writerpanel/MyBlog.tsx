import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  deleteExistingBlog,
  fetchMyBlogs,
} from "../../features/blog/blogSlice";

const MyBlog = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { blog=[],loading } = useAppSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchMyBlogs());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    navigate(`/writer/edit-blog/${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await dispatch(deleteExistingBlog(id)).unwrap();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const getStatusColor = (
    status: string,
  ): "warning" | "success" | "error" | "default" => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";

      case "published":
        return "success";

      case "rejected":
        return "error";

      default:
        return "default";
    }
  };

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
          alignItems: "center",
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
            My Blogs
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mt: 0.5,
            }}
          >
            Manage your created blogs
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate("/writer/create-blog")}
        >
          Create Blog
        </Button>
      </Box>

      
      {loading && blog.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
          }}
        >
          <CircularProgress />
        </Box>
      ) : blog.length === 0 ? (
        
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px dashed #d1d5db",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#374151",
            }}
          >
            No blogs found
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mt: 1,
              mb: 2,
            }}
          >
            You haven't created any blogs yet.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/writer/create-blog")}
          >
            Create Your First Blog
          </Button>
        </Box>
      ) : (
        
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {blog.map((item) => (
            <Card
              key={item._id}
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
              }}
            >
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
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
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
                  {item.category}
                </Typography>

                
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    lineHeight: 1.7,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 72,
                  }}
                >
                  {item.content}
                </Typography>

                
                <Box
                  sx={{
                    mt: 2.5,
                    pt: 2,
                    borderTop: "1px solid #f3f4f6",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleEdit(item._id)}
                    sx={{
                      color: "#2563eb",
                      border: "1px solid #bfdbfe",
                      borderRadius: "8px",
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    onClick={() => handleDelete(item._id)}
                    disabled={loading}
                    sx={{
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyBlog;