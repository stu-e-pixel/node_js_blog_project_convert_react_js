/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Blog } from "../../typescript/type";
import toast from "react-hot-toast";
import {
  approveBlog,
  createBlog,
  deleteBlog,
  getAllBlogs,
  getMyBlogs,
  updateBlog,
} from "../../api/blogApi";

interface BlogState {
  blog: Blog[];
  loading: boolean;
  error: string | null;
  selectedBlog: Blog | null;
}

const initialState: BlogState = {
  blog: [],
  loading: false,
  error: null,
  selectedBlog: null,
};

export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllBlogs();
      return response.blog;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch blogs";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const fetchMyBlogs = createAsyncThunk(
  "blog/fetchMyBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyBlogs();

      return response.blog;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch your blogs";

      toast.error(message);

      return rejectWithValue(message);
    }
  },
);

export const createNewBlog = createAsyncThunk(
  "blog/createNewBlog",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await createBlog(data);
      toast.success("Blog created successfully!");
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create blog";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const updateExistingBlog = createAsyncThunk(
  "blog/updateExistingBlog",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await updateBlog(data);
      toast.success("Blog updated successfully!");
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update  blog";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const deleteExistingBlog = createAsyncThunk(
  "blog/deleteExistingBlog",
  async (blogId: string, { rejectWithValue }) => {
    try {
      await deleteBlog({ blogId });
      toast.success("Blog deleted successfully!");
      return blogId;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete blog";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const approveExistingBlog = createAsyncThunk(
  "blog/approveExistingBlog",
  async (blogId: string, { rejectWithValue }) => {
    try {
      const response = await approveBlog({ blogId });
      toast.success("Blog approved and published!");
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to approve blog";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

const BlogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setSeletedBlog: (state, action: PayloadAction<Blog | null>) => {
      state.selectedBlog = action.payload;
    },
    setError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNewBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewBlog.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;

  if (!state.blog) {
    state.blog = [];
  }

  state.blog.unshift(action.payload);
})
      .addCase(createNewBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateExistingBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blog.findIndex(
          (blog) => (blog._id === action.payload._id),
        );
        if (index !== -1) {
          state.blog[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateExistingBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteExistingBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = state.blog.filter((blog) => blog._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteExistingBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(approveExistingBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveExistingBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blog.findIndex(
          (blog) => blog._id === action.payload._id,
        );
        if (index !== -1) {
          state.blog[index] = action.payload;
        }
      })
      .addCase(approveExistingBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyBlogs.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchMyBlogs.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  state.blog = action.payload || [];
})
.addCase(fetchMyBlogs.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
})
  },
});

export const { setSeletedBlog, setError } = BlogSlice.actions;
export default BlogSlice.reducer;
