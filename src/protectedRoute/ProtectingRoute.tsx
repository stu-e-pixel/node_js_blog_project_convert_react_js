import { Navigate, Outlet } from "react-router-dom";
import { getAuthCookie } from "../utils/cookieUtils";

type Role = "admin" | "writer" | "user";

interface ProtectedRouteProps {
  allowedRole: Role;
}

const getRoleFromToken = (token: string): string | null => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return decodedPayload.role || null;
  } catch (error) {
    console.error("Failed to decode access token:", error);
    return null;
  }
};

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { accessToken } = getAuthCookie();

  // No access token
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const role = getRoleFromToken(accessToken);

  // Token invalid / role missing
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (role !== allowedRole) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (role === "writer") {
      return <Navigate to="/writer/dashboard" replace />;
    }

    if (role === "user") {
      return <Navigate to="/user/blogs" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;