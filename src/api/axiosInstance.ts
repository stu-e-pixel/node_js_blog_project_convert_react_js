// api/axiosInstance.ts
import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ✅ baseURL থেকে /api বাদ দিন
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3016";
console.log('📡 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL, // শুধু http://localhost:3016
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // ✅ Debug log - দেখুন কোন URL এ request যাচ্ছে
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    const accessToken = Cookies.get("accessToken");
    const secretKey = Cookies.get("secretKey");
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (secretKey) {
      config.headers["x-secret-key"] = secretKey;
    }

    if (config.data) {
      console.log('📤 Request Data:', config.data);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error: AxiosError) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      console.log('🔐 No refresh token, redirecting to login');
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("secretKey");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      console.log('🔄 Refreshing token...');
      
      // ✅ এখানে /api যোগ করুন কারণ baseURL এ /api নেই
      const response = await axios.post(
        `${API_URL}/api/refresh-token`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const newAccessToken = response.data.accessToken;

      if (!newAccessToken) {
        throw new Error("New access token was not returned by server");
      }

      Cookies.set("accessToken", newAccessToken);
      console.log('✅ Token refreshed successfully');

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      console.error('❌ Refresh token failed:', refreshError);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("secretKey");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }
);

export default api;