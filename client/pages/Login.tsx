import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, getAvailableUsers } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const users = getAvailableUsers();

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      BRONZE: "bg-amber-600",
      SILVER: "bg-slate-400",
      GOLD: "bg-yellow-500",
      PLATINUM: "bg-indigo-600",
    };
    return colors[tier] || "bg-slate-500";
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      PASSENGER: "bg-blue-600",
      DRIVER: "bg-green-600",
      ADMIN: "bg-purple-600",
    };
    return colors[role] || "bg-slate-600";
  };

  const handleLogin = () => {
    if (!selectedUser) return;

    const user = users.find((u) => u.id === selectedUser);
    if (!user) return;

    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      login(user);

      // Redirect to role-specific home
      const role = user.role || "PASSENGER";
      if (role === "PASSENGER") {
        navigate("/passenger/home");
      } else if (role === "DRIVER") {
        navigate("/driver/home");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-8 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Select your account to continue</p>
        </div>

        {/* User Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {users.map((user) => (
            <Card
              key={user.id}
              className={`cursor-pointer transition-all ${
                selectedUser === user.id
                  ? "ring-2 ring-primary border-primary"
                  : "hover:border-border/80"
              }`}
              onClick={() => setSelectedUser(user.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-border mt-1">
                    {selectedUser === user.id && (
                      <div className="w-full h-full rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Role Badge */}
                <div>
                  <Badge className={`${getRoleColor(user.role)} text-white`}>
                    {user.role}
                  </Badge>
                </div>

                {/* Tier Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tier:</span>
                  <Badge className={`${getTierColor(user.tier)} text-white`}>
                    {user.tier}
                  </Badge>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="text-sm">
                    <p className="text-xs text-muted-foreground">Wallet Balance</p>
                    <p className="font-semibold text-foreground">
                      {user.wallet_balance_aed} AED
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-muted-foreground">Reward Points</p>
                    <p className="font-semibold text-yellow-500">
                      {user.reward_points}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogin}
            disabled={!selectedUser || isLoading}
            className="flex-1"
            size="lg"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>

        {/* Info Message */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 text-sm">
          <p className="text-blue-900 dark:text-blue-100">
            <strong>Demo Mode:</strong> Click on any user card to select them. This is a demo app with pre-loaded user accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
