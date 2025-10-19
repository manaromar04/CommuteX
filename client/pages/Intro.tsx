import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, Users, MapPin, Zap as ZapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CommuteX</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Smart Commuting for the UAE
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Save money, earn rewards, and join a sustainable commuting community
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            <div className="rounded-lg border border-border bg-card/50 backdrop-blur p-6 text-left">
              <div className="flex items-start gap-3 mb-3">
                <Users className="h-6 w-6 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-foreground">Carpool Benefits</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Share rides and earn 80 reward points for every trip with 3+ passengers
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card/50 backdrop-blur p-6 text-left">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-foreground">Smart Hubs</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Book parking at Park & Ride locations and earn 40 points per booking
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card/50 backdrop-blur p-6 text-left">
              <div className="flex items-start gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-foreground">Tier Rewards</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Progress from BRONZE to PLATINUM and unlock exclusive benefits
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card/50 backdrop-blur p-6 text-left">
              <div className="flex items-start gap-3 mb-3">
                <ZapIcon className="h-6 w-6 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-foreground">AI Copilot</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Get personalized recommendations with Salma, your smart assistant
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="px-8 py-6 text-lg rounded-lg w-full md:w-auto"
            >
              Get Started
            </Button>
            <p className="text-sm text-muted-foreground">
              Join thousands of commuters reducing costs and emissions
            </p>
          </div>

          {/* Demo Users Info */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Try the app with demo accounts:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-card/50 backdrop-blur rounded-lg p-3 border border-border">
                <p className="font-medium text-foreground">Huda</p>
                <p className="text-xs text-muted-foreground">Passenger • SILVER Tier</p>
              </div>
              <div className="bg-card/50 backdrop-blur rounded-lg p-3 border border-border">
                <p className="font-medium text-foreground">Rami</p>
                <p className="text-xs text-muted-foreground">Driver • PLATINUM Tier</p>
              </div>
              <div className="bg-card/50 backdrop-blur rounded-lg p-3 border border-border">
                <p className="font-medium text-foreground">Salma</p>
                <p className="text-xs text-muted-foreground">Admin • GOLD Tier</p>
              </div>
              <div className="bg-card/50 backdrop-blur rounded-lg p-3 border border-border">
                <p className="font-medium text-foreground">Manar</p>
                <p className="text-xs text-muted-foreground">Driver • GOLD Tier</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur text-center py-6 text-sm text-muted-foreground">
        <p>CommuteX © 2024 • Making UAE commuting smarter and greener</p>
      </footer>
    </div>
  );
}
