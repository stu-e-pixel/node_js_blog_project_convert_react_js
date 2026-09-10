/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../typescript/type";
import toast from "react-hot-toast";
import {
  approveWriter,
  getAllUsers,
  getPendingWriters,
  loginUser,
  profile,
  resendVerificationOTP,
  resetpassword,
  resetpasswordlink,
  SignupUser,
  verifyEmail,
} from "../../api/authApi";
import {
  getAuthCookie,
  removeAuthCookies,
  setAuthCookie,
} from "../../utils/cookieUtils";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  secretKey: string | null;
  verificationEmail: string | null;
  pendingWriters: User[];
  users: User[];
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  secretKey: null,
  verificationEmail: null,
  pendingWriters: [],
  users: [],
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    userData: {
      name: string;
      email: string;
      phone: string;
      password: string;
      role: "admin" | "writer" | "user";
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await SignupUser(userData);
      toast.success("Account created successfully! Please verify your email.");
      return {
        data: response.data,
        email: userData.email,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await loginUser(credentials);

      console.log(" FULL LOGIN RESPONSE:", response);
      console.log(" TOKEN:", response.token);
      console.log(" ACCESS TOKEN:", response.token?.accessToken);
      console.log(" REFRESH TOKEN:", response.token?.refreshToken);
      console.log(" SECRET KEY:", response.secretkey);

      if (
        response.token?.accessToken &&
        response.token?.refreshToken &&
        response.secretkey
      ) {
        setAuthCookie(
          response.token.accessToken,
          response.token.refreshToken,
          response.secretkey,
        );

        console.log("🍪 AUTH COOKIES SET");
      } else {
        console.error("❌ Token/secretkey missing:", {
          token: response.token,
          accessToken: response.token?.accessToken,
          refreshToken: response.token?.refreshToken,
          secretkey: response.secretkey,
        });
      }

      toast.success("Welcome back! Login successful.");

      return {
        user: {
          _id: response.data?.id,
          name: response.data?.name,
          email: response.data?.email,
          phone: response.data?.phone,
          role: response.data?.role,
          isVerified: response.data?.isVerified,
          isActive: response.data?.isActive,
        },
        secretKey: response.secretkey,
        accessToken: response.token?.accessToken,
        refreshToken: response.token?.refreshToken,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";

      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const VerifyEmail = createAsyncThunk(
  "auth/VerifyEmail",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await verifyEmail(data);
      toast.success("Email verified successfully! You can now login.");
      return {
        message: response.message,
        email: data.email,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resendVerificationOTP(email);
      toast.success("New verification code sent to your email");
      return {
        message: response.message,
        email: email,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to resend verification code";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profile();
      return response.user;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch profile";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const sendResetLink = createAsyncThunk(
  "auth/sendResetLink",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resetpasswordlink({ email });
      toast.success("Password reset link sent to your email!");
      return {
        message: response.message,
        email: email,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to send reset link";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const resetUserPassword = createAsyncThunk(
  "auth/resetUserPassword",
  async (
    data: {
      id: string;
      token: string;
      password: string;
      comformpassword: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await resetpassword(data.id, data.token, {
        password: data.password,
        comformpassword: data.comformpassword,
      });
      toast.success("Password reset successful! You can now login.");
      return {
        message: response.message,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const approveWriterThunk = createAsyncThunk(
  "auth/approveWriter",
  async (
    {
      userId,
      secretKey,
    }: {
      userId: string;
      secretKey: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await approveWriter(userId, secretKey);

      toast.success("Writer approved successfully!");

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to approve writer";

      toast.error(message);

      return rejectWithValue(message);
    }
  },
);

export const getPendingWritersThunk = createAsyncThunk(
  "auth/getPendingWriters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPendingWriters();
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch pending writers";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const getAllUsersThunk = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUsers();

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch users";

      toast.error(message);

      return rejectWithValue(message);
    }
  },
);

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCreadentials: (
      state,
      action: PayloadAction<{ user: User; secretKey?: string }>,
    ) => {
      state.user = action.payload.user;
      state.error = null;
      state.isAuthenticated = true;
      if (action.payload.secretKey) {
        state.secretKey = action.payload.secretKey;
      }
    },
    logout: (state) => {
      state.error = null;
      state.isAuthenticated = false;
      state.user = null;
      state.secretKey = null;
      state.verificationEmail = null;
      toast.success("Logged out successfully");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateSecretKey: (state, action: PayloadAction<string>) => {
      state.secretKey = action.payload;
      toast.success("Secret key updated successfully");
    },

    setVerificationEmail: (state, action: PayloadAction<string>) => {
      state.verificationEmail = action.payload;
    },
    clearVerificationEmail: (state) => {
      state.verificationEmail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        console.log("SIGNUP FULFILLED PAYLOAD:", action.payload);

        state.loading = false;
        state.verificationEmail = action.payload.email;
        state.error = null;

        console.log("VERIFICATION EMAIL SET:", state.verificationEmail);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.secretKey = action.payload.secretKey as string;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(VerifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(VerifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.verificationEmail = null;
        state.error = null;
      })
      .addCase(VerifyEmail.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        const { secretKey } = getAuthCookie();
        if (secretKey) {
          state.secretKey = secretKey;
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        removeAuthCookies();
      })

      .addCase(sendResetLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetLink.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendResetLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getPendingWritersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingWritersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingWriters = action.payload;
        state.error = null;
      })
      .addCase(getPendingWritersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })

      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCreadentials,
  logout,
  setLoading,
  setError,
  updateSecretKey,
  setVerificationEmail,
  clearVerificationEmail,
  clearError,
} = AuthSlice.actions;
export default AuthSlice.reducer;
