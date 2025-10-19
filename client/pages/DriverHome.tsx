import { useAuth } from "@/context/AuthContext";
import { RoleProtectedRoute } from "@/components/RoleGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopNav } from "@/components/TopNav";
import { useNavigate } from "react-router-dom";
import { Car, TrendingUp, MapPin, Calendar } from "lucide-react";

export default function DriverHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <RoleProtectedRoute allowedRoles="DRIVER">
      <div className="min-h-screen bg-background">
        <TopNav
          userName={user?.name}
          walletBalance={user?.wallet_balance_aed}
          onLogout={handleLogout}
        />

        <main className="container py-8">
          <div className="space-y-6">
            {/* Driver Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Driver Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your trips, track earnings, and monitor bookings
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {user?.wallet_balance_aed} AED
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Available funds</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">
                    {user?.reward_points}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total earned</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Tier Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-yellow-500 text-white">{user?.tier}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Member status</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">0</div>
                  <p className="text-xs text-muted-foreground mt-1">Ongoing</p>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Post a Trip
                  </CardTitle>
                  <CardDescription>
                    Create a new carpool trip and earn money
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Create New Trip</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Booking Requests
                  </CardTitle>
                  <CardDescription>
                    Review and manage passenger booking requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Requests (0)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Earnings
                  </CardTitle>
                  <CardDescription>
                    Track your income and trip statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Earnings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    My Trips
                  </CardTitle>
                  <CardDescription>
                    View all your posted and completed trips
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View All Trips
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
