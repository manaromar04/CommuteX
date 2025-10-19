import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Zap, LogOut } from "lucide-react";

interface TopNavProps {
  userName?: string;
  walletBalance?: number;
  onLogout?: () => void;
}

export function TopNav({ userName = "Guest", walletBalance = 0, onLogout }: TopNavProps) {
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
