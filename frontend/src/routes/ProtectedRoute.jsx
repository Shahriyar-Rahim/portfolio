import { Navigate, Outlet } from "react-router";
import { useSessionCheck } from "../lib/hooks/useAuth";
import { useAuthStore } from "../lib/stores/authStore";
import Loader from "../components/Loader";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { checked } = useSessionCheck();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!checked) return <div className="min-h-screen flex items-center justify-center"><Loader label="verifying session" /></div>;

  return <Outlet />;
}
