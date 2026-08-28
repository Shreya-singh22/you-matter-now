import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Gate for routes that need a signed-in user.
 *
 * Waits for AuthContext to finish verifying the stored token before deciding -
 * without that, a reload would bounce a signed-in user to /signin because the
 * /auth/me check hadn't returned yet.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand-primary"
          role="status"
          aria-label="Checking your session"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Remember where they were headed so sign-in can send them back.
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
