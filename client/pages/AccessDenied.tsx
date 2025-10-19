import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export default function AccessDenied() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const getHomeRoute = () => {
    switch (userRole) {
      case "PASSENGER":
        return "/passenger/home";
      case "DRIVER":
        return "/driver/home";
      case "ADMIN":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-lg bg-destructive/10 p-4">
            <Lock className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            This area is not available for your role ({userRole || "guest"}).
          </p>
        </div>
        <div className="space-y-3">
          <Button onClick={() => navigate(getHomeRoute())} className="w-full">
            Go to My Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="w-full"
          >
            Switch Account
          </Button>
        </div>
      </div>
    </div>
  );
}
