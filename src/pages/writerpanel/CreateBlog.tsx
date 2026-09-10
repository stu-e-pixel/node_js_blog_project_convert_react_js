import  { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAppDispatch } from "../../app/hook";
import { createNewBlog } from "../../features/blog/blogSlice";

import {
  blogSchema,
  type BlogFormData,
} from "../../schemas/BlogValidation";

const CreateBlog = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<BlogFormData>({
    resolver: yupResolver(blogSchema),

    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    try {
      setLoading(true);

      const blogData = {
        ...data,
        status: "pending",
      };

      console.log("Blog data:", blogData);

      await dispatch(createNewBlog(blogData)).unwrap();

      reset();
    } catch (error) {
      console.log("Error creating blog:", error);
    } finally {
      setLoading(false);
    }
  };

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
          p: { xs: 2, md: 4 },
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Create New Blog
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: "#6b7280",
            }}
          >
            Create your blog and submit it for admin approval.
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* Title */}
            <TextField
              {...register("title")}
              label="Blog Title"
              placeholder="Enter your blog title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={loading}
            />

            {/* Category */}
            <TextField
              {...register("category")}
              label="Category"
              placeholder="Enter blog category"
              fullWidth
              error={!!errors.category}
              helperText={errors.category?.message}
              disabled={loading}
            />

            {/* Content */}
            <TextField
              {...register("content")}
              label="Blog Content"
              placeholder="Write your blog content here..."
              fullWidth
              multiline
              minRows={12}
              error={!!errors.content}
              helperText={errors.content?.message}
              disabled={loading}
            />

            {/* Status Info */}
            <Box
              sx={{
                p: 2,
                borderRadius: "8px",
                backgroundColor: "#fff7ed",
                border: "1px solid #fed7aa",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#9a3412",
                  fontWeight: 500,
                }}
              >
                Status: Pending
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#c2410c",
                }}
              >
                Your blog will be submitted for admin approval.
              </Typography>
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 1,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() => reset()}
                disabled={loading}
              >
                Clear
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading ? "Submitting..." : "Submit Blog"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateBlog;