export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'writer' | 'user';
  isVerified: boolean;
  isActive: boolean;
  secretKey?: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  auther: User | string;
  status: 'pending' | 'published' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role:"user"|"writer"|"admin";
    isVerified: boolean;
    isActive: boolean;
  };
  token: {
  accessToken: string;
  refreshToken: string;
};
  secretkey?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'writer' | 'user';
}

export interface VerifyCredentials {
  email: string;
  otp: string;
}

export interface ResetPasswordLinkCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  password: string;
  comformpassword: string;
}

export interface BlogCreateData {
  title: string;
  content: string;
  category: string;
  status?: 'pending' | 'published' | 'draft';
}

export interface BlogUpdateData extends Partial<BlogCreateData> {
  blogId: string;
}

export interface BlogDeleteData {
  blogId: string;
}

export interface BlogApproveData {
  blogId: string;
}