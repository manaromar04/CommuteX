import { RoleProtectedRoute } from "@/components/RoleGuard";
import Dashboard from "./Dashboard";

export default function DriverHome() {
  return (
    <RoleProtectedRoute allowedRoles="DRIVER">
      <Dashboard />
    </RoleProtectedRoute>
  );
}
