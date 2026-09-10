import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";

import AuthLayout from "../layout/AuthLayout";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Verify from "../pages/auth/Verify";

import ProtectedRoute from "../protectedRoute/ProtectingRoute";

import UserLayout from "../layout/UserLayout";
import BlogList from "../pages/userpanel/BlogList";
import BlogDetails from "../pages/userpanel/BlogDetails";
import Profile from "../pages/userpanel/Profile";

import WriteLayout from "../layout/WriterLayout";
import Dashboard from "../pages/writerpanel/Dashboard";
import CreateBlog from "../pages/writerpanel/CreateBlog";
import MyBlog from "../pages/writerpanel/MyBlog";
import EditBlog from "../pages/writerpanel/EditBlog";

import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/adminpanel/AdminDashboard";
import CreateBlogAdmin from "../pages/adminpanel/CreateBlogAdmin";
import AdminBlog from "../pages/adminpanel/AdminBlog";
import UpdateAdminBlog from "../pages/adminpanel/UpdateAdminBlog";
import User from "../pages/adminpanel/User";
import Writer from "../pages/adminpanel/Writer";
import WriterBlog from "../pages/adminpanel/WriterBlog";
import AdminProfile from "../pages/adminpanel/AdminProfile";
import Blog from "../pages/Blog";
import ResetPassword from "../pages/ResetPassword";
import ResetPasswordLink from "../pages/ResetPasswordLink";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/reset-password/:id/:token",
    element:<ResetPassword/>
  },
  {
    path:"/reset-password-link",
    element:<ResetPasswordLink/>
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/verify",
        element: <Verify />,
      },
      {
        path: "/blog/:id",
        element: <Blog/>,
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRole="user" />,
    children: [
      {
        path: "/user",
        element: <UserLayout />,
        children: [
          {
            index: true,
            element: <BlogList />,
          },
          {
            path: "blogs",
            element: <BlogList />,
          },
          {
            path: "blogs/:id",
            element: <BlogDetails />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRole="writer" />,
    children: [
      {
        path: "/writer",
        element: <WriteLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "create-blog",
            element: <CreateBlog />,
          },
          {
            path: "my-blogs",
            element: <MyBlog />,
          },
          {
            path: "edit-blog/:id",
            element: <EditBlog />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRole="admin" />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path:"create-blog",
            element:<CreateBlogAdmin/>
          },
          {
            path:"adminblog",
            element:<AdminBlog/>
          },
          {
            path:"updateadminblog/:id",
            element:<UpdateAdminBlog/>
          },
          {
            path:"user",
            element:<User/>
          },
          {
            path:"writer",
            element:<Writer/>
          },
          {
            path:"writerblog",
            element:<WriterBlog/>
          },
          {
            path:"profile",
            element:<AdminProfile/>
          }
        ],
      },
    ],
  },
]);

export default Routes;