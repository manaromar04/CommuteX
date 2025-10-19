import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Zap, LogOut, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@shared/types";

interface TopNavProps {
  userName?: string;
  walletBalance?: number;
  onLogout?: () => void;
  showRoleSwitcher?: boolean;
}

export function TopNav({
  userName = "Guest",
  walletBalance = 0,
  onLogout,
  showRoleSwitcher = true,
}: TopNavProps) {
  const { userRole, setUserRole } = useAuth();

  const getRoleColor = (role: UserRole | null) => {
    const colors: Record<string, string> = {
      PASSENGER: "bg-blue-600",
      DRIVER: "bg-green-600",
    };
    return colors[role || "PASSENGER"] || "bg-slate-600";
  };

  const getRoleLabel = (role: UserRole | null) => {
    const labels: Record<string, string> = {
      PASSENGER: "Passenger",
      DRIVER: "Driver",
    };
    return labels[role || "PASSENGER"] || "Guest";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CommuteX</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end text-sm">
            <span className="font-medium text-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground">
              {walletBalance} AED
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-red-600" />

          {/* Role Pill */}
          {userRole && (
            <Badge className={`${getRoleColor(userRole)} text-white text-xs`}>
              {getRoleLabel(userRole)}
            </Badge>
          )}

          {/* Demo Role Switcher */}
          {showRoleSwitcher && userRole && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  title="Demo: Switch Role"
                >
                  <Users className="h-3 w-3" />
                  Switch
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setUserRole("PASSENGER")}
                  disabled={userRole === "PASSENGER"}
                >
                  Passenger
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setUserRole("DRIVER")}
                  disabled={userRole === "DRIVER"}
                >
                  Driver
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setUserRole("ADMIN")}
                  disabled={userRole === "ADMIN"}
                >
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ThemeToggle />
          {onLogout && (
            <Button
              variant="outline"
              size="icon"
              onClick={onLogout}
              title="Logout"
              className="rounded-full"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
