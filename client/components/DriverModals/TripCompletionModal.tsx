import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, DollarSign, Gift } from "lucide-react";

export interface TripPassenger {
  passengerId: string;
  passengerName: string;
  seatsBooked: number;
  farePerPassenger: number;
  totalFare: number;
}

interface TripCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip?: {
    id: string;
    origin: string;
    destination: string;
    carType: string;
    passengers: TripPassenger[];
    driverEarnings: number;
    rewardPoints: number;
  };
  onCompleteTrip?: (tripId: string) => void;
}

export function TripCompletionModal({
  open,
  onOpenChange,
  trip,
  onCompleteTrip,
}: TripCompletionModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  if (!trip) return null;

  const handleCompleteTrip = () => {
    if (onCompleteTrip) {
      onCompleteTrip(trip.id);
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onOpenChange(false);
    }, 2000);
  };

  const totalPassengers = trip.passengers.length;
  const carpoolBonus = totalPassengers >= 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Complete Trip & Settle Payments</DialogTitle>
          <DialogDescription>
            {trip.origin} → {trip.destination}
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Trip Completed!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Payments have been settled and rewards awarded.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Trip Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trip Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Vehicle</p>
                    <p className="font-semibold">{trip.carType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Passengers</p>
                    <p className="font-semibold">{totalPassengers}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                      Completed
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passengers & Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Passenger Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trip.passengers.map((passenger) => (
                  <div
                    key={passenger.passengerId}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {passenger.passengerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {passenger.seatsBooked} seat{passenger.seatsBooked > 1 ? "s" : ""} × {passenger.farePerPassenger} AED
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        -{passenger.totalFare.toFixed(2)} AED
                      </p>
                      <p className="text-xs text-muted-foreground">deducted</p>
                    </div>
                  </div>
                ))}

                {/* Total Collected */}
                <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total Collected:</span>
                  <span className="text-lg font-bold text-green-600">
                    +{trip.passengers.reduce((sum, p) => sum + p.totalFare, 0).toFixed(2)} AED
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Driver Earnings & Rewards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Your Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    +{trip.driverEarnings.toFixed(2)} AED
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    From {totalPassengers} passenger{totalPassengers > 1 ? "s" : ""}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Reward Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-yellow-600">
                    +{trip.rewardPoints}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {carpoolBonus
                      ? "Carpool bonus (3+ passengers)"
                      : "Trip completion bonus"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bonuses Info */}
            {carpoolBonus && (
              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg text-sm">
                <p className="text-green-900 dark:text-green-200">
                  <strong>✓ Carpool Bonus Unlocked!</strong> You earned an extra 80 reward points for having 3+ passengers on this trip.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCompleteTrip} className="flex-1">
                Complete Trip & Settle
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
