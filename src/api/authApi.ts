/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AuthResponse, LoginCredentials, ResetPasswordCredentials, ResetPasswordLinkCredentials, SignupCredentials, User, VerifyCredentials } from "../typescript/type";
import api from "./axiosInstance";

export const SignupUser = async(data:SignupCredentials):Promise<AuthResponse>=>{
        const response = await api.post("/api/create-user",data);
        return response.data
}

export const resendVerificationOTP = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await api.post('/api/resend-otp', { email });
    return response.data;
  } catch (error: any) {
    console.error('Error resending OTP:', error);
    throw error;
  }
};

export const verifyEmail = async(data:VerifyCredentials):Promise<AuthResponse>=>{
    const response = await api.post("/api/verify",data)
    return response.data
};

export const loginUser = async(data:LoginCredentials):Promise<AuthResponse>=>{
    const response = await api.post("/api/login",data)
    return response.data
};

export const profile = async():Promise<{user:User}>=>{
    const response = await api.get("/api/profile")
    return response.data
};

export const resetpasswordlink=async(data:ResetPasswordLinkCredentials):Promise<AuthResponse>=>{
    const response = await api.post("/api/reset-password/link",data);
    return response.data
};

export const resetpassword = async(id:string,token:string,data:ResetPasswordCredentials):Promise<AuthResponse>=>{
    const response = await api.post(`/api/resetpassword/${id}/${token}`,data)
    return response.data
};

export const approveWriter = async (
  userId: string,
  secretKey: string
): Promise<AuthResponse> => {
  const response = await api.patch(
    "/api/approve-writer",
    { userId },
    {
      headers: {
        "x-secret-key": secretKey,
      },
    }
  );

  return response.data;
};

export const getPendingWriters = async () => {
  const response = await api.get("/api/pending-writers");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/api/all-users");
  return response.data;
};