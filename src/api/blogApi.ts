import axiosInstance from './axiosInstance';

import { getAuthCookie } from '../utils/cookieUtils';
import type { Blog, BlogApproveData, BlogCreateData, BlogDeleteData, BlogUpdateData } from '../typescript/type';


const getSecretKey = () => {
  const { secretKey } = getAuthCookie();
  if (!secretKey) {
    console.warn('Secret key not found in cookies');
  }
  return secretKey;
};


const getAccessToken = () => {
  const { accessToken } = getAuthCookie();
  if (!accessToken) {
    console.warn('Access token not found in cookies');
  }
  return accessToken;
};

const buildAuthHeaders = () => {
  const accessToken = getAccessToken();
  const secretKey = getSecretKey();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  if (secretKey) {
    headers['x-secret-key'] = secretKey;
  }
  
  return headers;
};

export const getAllBlogs = async (): Promise<{ blog: Blog[] }> => {
  try {
    const response = await axiosInstance.get('/api/blogs?action=list', {
      headers: buildAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getMyBlogs = async () => {
  const response = await axiosInstance.get("/api/blogs?action=myblogs");

  return response.data;
};

export const createBlog = async (
  data: BlogCreateData
): Promise<{ data: Blog }> => {
  try {
    const accessToken = getAccessToken();
    const secretKey = getSecretKey();

    if (!accessToken) {
      throw new Error("Access token is required to create a blog");
    }

    if (!secretKey) {
      throw new Error("Secret key is required to create a blog");
    }

    const response = await axiosInstance.post(
      "/api/blogs?action=create",
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-secret-key": secretKey,
        },
      }
    );

    console.log("CREATE BLOG API RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

export const updateBlog = async (data: BlogUpdateData): Promise<{ data: Blog }> => {
  try {
    const accessToken = getAccessToken();
    const secretKey = getSecretKey();
    
    if (!accessToken) {
      throw new Error('Access token is required to update a blog');
    }
    
    if (!secretKey) {
      throw new Error('Secret key is required to update a blog');
    }

    const response = await axiosInstance.put('/api/blogs?action=update', data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-secret-key': secretKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (data: BlogDeleteData): Promise<{ message: string }> => {
  try {
    const accessToken = getAccessToken();
    const secretKey = getSecretKey();
    
    if (!accessToken) {
      throw new Error('Access token is required to delete a blog');
    }
    
    if (!secretKey) {
      throw new Error('Secret key is required to delete a blog');
    }

    const response = await axiosInstance.delete('/api/blogs?action=delete', {
      data: data,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-secret-key': secretKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export const approveBlog = async (data: BlogApproveData): Promise<{ data: Blog }> => {
  try {
    const accessToken = getAccessToken();
    const secretKey = getSecretKey();
    
    if (!accessToken) {
      throw new Error('Access token is required to approve a blog');
    }
    
    if (!secretKey) {
      throw new Error('Secret key is required to approve a blog');
    }

    const response = await axiosInstance.patch('/api/blogs?action=approve', data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-secret-key': secretKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error approving blog:', error);
    throw error;
  }
};