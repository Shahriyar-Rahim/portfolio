import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AccountAdmin from "../pages/admin/Account";
import Home from "../pages/Home";
import BlogList from "../pages/BlogList";
import BlogDetail from "../pages/BlogDetail";
import TestimonialsPage from "../pages/TestimonialsPage";
import WorkDetailPage from "../pages/WorkDetailPage";
import CvProfilePage from "../pages/CvProfilePage";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import ProjectsPage from "../pages/ProjectsPage";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/admin/Dashboard";
import Inbox from "../pages/admin/Inbox";
import Blogs from "../pages/admin/Blogs";
import ExperienceAdmin from "../pages/admin/Experience";
import EducationAdmin from "../pages/admin/Education";
import ServicesAdmin from "../pages/admin/Services";
import HeroStatusAdmin from "../pages/admin/HeroStatus";
import TestimonialsAdmin from "../pages/admin/Testimonials";
import JobsAdmin from "../pages/admin/Jobs";
import CvProfileAdmin from "../pages/admin/CvProfile";
import AboutAdmin from "../pages/admin/About";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/blog", element: <BlogList /> },
      { path: "/blog/:id", element: <BlogDetail /> },
      { path: "/testimonials", element: <TestimonialsPage /> },
      { path: "/works/:repo", element: <WorkDetailPage /> },
      { path: "/cv", element: <CvProfilePage /> },
      { path: "/projects", element: <ProjectsPage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "inbox", element: <Inbox /> },
          { path: "blogs", element: <Blogs /> },
          { path: "experience", element: <ExperienceAdmin /> },
          { path: "education", element: <EducationAdmin /> },
          { path: "services", element: <ServicesAdmin /> },
          { path: "hero-status", element: <HeroStatusAdmin /> },
          { path: "testimonials", element: <TestimonialsAdmin /> },
          { path: "jobs", element: <JobsAdmin /> },
          { path: "cv", element: <CvProfileAdmin /> },
          { path: "about", element: <AboutAdmin /> },
          { path: "account", element: <AccountAdmin /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
