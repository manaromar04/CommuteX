import { useAuth } from "@/context/AuthContext";
import { RoleProtectedRoute } from "@/components/RoleGuard";
import Dashboard from "./Dashboard";

export default function PassengerHome() {
  const { user } = useAuth();

  return (
    <RoleProtectedRoute allowedRoles="PASSENGER">
      <div>
        {/* Passenger-specific content wrapper */}
        <Dashboard />
      </div>
    </RoleProtectedRoute>
  );
}
