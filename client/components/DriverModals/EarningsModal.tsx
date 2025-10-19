import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Calendar } from "lucide-react";

interface EarningsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EarningsModal({ open, onOpenChange }: EarningsModalProps) {
  const earnings = [
    {
      id: 1,
      date: "2024-01-15",
      tripRoute: "Sharjah → Dubai",
      carType: "Sedan",
      passengers: 3,
      farePerPassenger: 15.75,
      amount: 47.25,
      bonusPoints: 80,
    },
    {
      id: 2,
      date: "2024-01-14",
      tripRoute: "Ajman → Dubai",
      carType: "Sedan",
      passengers: 2,
      farePerPassenger: 13.5,
      amount: 27,
      bonusPoints: 0,
    },
    {
      id: 3,
      date: "2024-01-13",
      tripRoute: "Sharjah → Dubai",
      carType: "Sedan",
      passengers: 4,
      farePerPassenger: 15.75,
      amount: 63,
      bonusPoints: 80,
    },
    {
      id: 4,
      date: "2024-01-12",
      tripRoute: "Sharjah → Abu Dhabi",
      carType: "SUV",
      passengers: 3,
      farePerPassenger: 19.35,
      amount: 58.05,
      bonusPoints: 80,
    },
  ];

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalTrips = earnings.length;
  const totalPassengers = earnings.reduce((sum, e) => sum + e.passengers, 0);
  const totalBonus = earnings.reduce((sum, e) => sum + e.bonusPoints, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Earnings Dashboard</DialogTitle>
          <DialogDescription>
            Track your income and bonus rewards from completed trips
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Total Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{totalEarnings} AED</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Completed Trips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{totalTrips}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Total Passengers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">{totalPassengers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Bonus Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">{totalBonus}</p>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Table */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm">Recent Earnings</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {earnings.map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {earning.tripRoute}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{earning.date}</span>
                      <span>{earning.carType}</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {earning.passengers} × {earning.farePerPassenger} AED
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      +{earning.amount.toFixed(2)} AED
                    </p>
                    {earning.bonusPoints > 0 && (
                      <p className="text-xs text-yellow-600 mt-1">
                        +{earning.bonusPoints} bonus pts
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm text-blue-900 dark:text-blue-200">
            <p className="font-medium mb-1">💡 Tip:</p>
            <p>
              Earn 80 bonus points for carpool trips with 3+ passengers. Track your earnings to maximize your income!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
