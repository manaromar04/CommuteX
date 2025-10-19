import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@shared/types";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole | UserRole[];
  fallbackRoute?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackRoute = "/access-denied",
}: RoleGuardProps) {
  const { hasRole, userRole } = useAuth();

  if (!hasRole(allowedRoles)) {
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
}

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole | UserRole[];
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { userRole } = useAuth();
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!userRole || !rolesArray.includes(userRole)) {
    // Redirect to role-specific home
    if (userRole === "PASSENGER") {
      return <Navigate to="/passenger/home" replace />;
    } else if (userRole === "DRIVER") {
      return <Navigate to="/driver/home" replace />;
    } else if (userRole === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
