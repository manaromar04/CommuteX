import { RoleProtectedRoute } from "@/components/RoleGuard";
import Dashboard from "./Dashboard";

export default function AdminDashboard() {
  return (
    <RoleProtectedRoute allowedRoles="ADMIN">
      <Dashboard />
    </RoleProtectedRoute>
  );
}
