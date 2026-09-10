
import { useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  fetchBlogs,
  updateExistingBlog,
} from "../../features/blog/blogSlice";

interface EditBlogFormData {
  title: string;
  category: string;
  content: string;
}

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { blog, loading } = useAppSelector((state) => state.blog);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditBlogFormData>({
    defaultValues: {
      title: "",
      category: "",
      content: "",
    },
  });

  
  useEffect(() => {
    if (!blog || blog.length === 0) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, blog]);

  
  useEffect(() => {
    if (!id || !blog) return;

    const selectedBlog = blog.find(
      (item) => item?._id === id,
    );

    if (selectedBlog) {
      reset({
        title: selectedBlog.title || "",
        category: selectedBlog.category || "",
        content: selectedBlog.content || "",
      });
    }
  }, [id, blog, reset]);

  
  const onSubmit = async (data: EditBlogFormData) => {
    if (!id) {
      return;
    }

    try {
      await dispatch(
        updateExistingBlog({
          blogId: id,
          ...data,
        }),
      ).unwrap();

      navigate("/writer/my-blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  
  const selectedBlog = blog?.find(
    (item) => item?._id === id,
  );

  if (loading && (!blog || blog.length === 0)) {
    return (
      <Box
        sx={{
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

  if (!selectedBlog && !loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6">
          Blog not found
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/writer/my-blogs")}
        >
          Back to My Blogs
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          border: "1px solid #e5e7eb",
          borderRadius: 3,
        }}
      >
        
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Edit Blog
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: "#6b7280",
            }}
          >
            Update your blog information and content.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            
            <TextField
              {...register("title", {
                required: "Blog title is required",
                minLength: {
                  value: 5,
                  message:
                    "Title must be at least 5 characters",
                },
              })}
              label="Blog Title"
              placeholder="Enter your blog title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={loading}
            />

            
            <TextField
              {...register("category", {
                required: "Category is required",
              })}
              label="Category"
              placeholder="Enter blog category"
              fullWidth
              error={!!errors.category}
              helperText={errors.category?.message}
              disabled={loading}
            />

            
            <TextField
              {...register("content", {
                required: "Blog content is required",
                minLength: {
                  value: 20,
                  message:
                    "Content must be at least 20 characters",
                },
              })}
              label="Blog Content"
              placeholder="Write your blog content..."
              fullWidth
              multiline
              minRows={12}
              error={!!errors.content}
              helperText={errors.content?.message}
              disabled={loading}
            />

            
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#fff7ed",
                border: "1px solid #fed7aa",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#9a3412",
                  fontWeight: 600,
                }}
              >
                Current Status:{" "}
                {selectedBlog?.status || "pending"}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  color: "#c2410c",
                }}
              >
                Blog status is managed by the admin.
              </Typography>
            </Box>

            
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                mt: 1,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() =>
                  navigate("/writer/my-blogs")
                }
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={18} />
                  ) : undefined
                }
              >
                {loading ? "Updating..." : "Update Blog"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditBlog;

