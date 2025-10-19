import { useAuth } from "@/context/AuthContext";
import { RoleProtectedRoute } from "@/components/RoleGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopNav } from "@/components/TopNav";
import { useNavigate } from "react-router-dom";
import { Settings, Users, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <RoleProtectedRoute allowedRoles="ADMIN">
      <div className="min-h-screen bg-background">
        <TopNav
          userName={user?.name}
          walletBalance={user?.wallet_balance_aed}
          onLogout={handleLogout}
        />

        <main className="container py-8">
          <div className="space-y-6">
            {/* Admin Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                System management, policies, and platform oversight
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">4</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">3</div>
                  <p className="text-xs text-muted-foreground mt-1">Platform-wide</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">2,200 AED</div>
                  <p className="text-xs text-muted-foreground mt-1">Collected</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">2</div>
                  <p className="text-xs text-muted-foreground mt-1">Online now</p>
                </CardContent>
              </Card>
            </div>

            {/* Management Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    View, manage, and monitor user accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Manage Users</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Policy Control
                  </CardTitle>
                  <CardDescription>
                    Configure rewards, fares, and platform rules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Edit Policies
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Analytics
                  </CardTitle>
                  <CardDescription>
                    View platform metrics and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Moderation
                  </CardTitle>
                  <CardDescription>
                    Handle reports and platform issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
