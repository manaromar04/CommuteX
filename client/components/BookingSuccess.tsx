import { CheckCircle, MapPin, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Booking, Trip } from "@shared/types";

interface BookingSuccessProps {
  booking: Booking;
  trip: Trip;
  onClose: () => void;
}

export function BookingSuccess({ booking, trip, onClose }: BookingSuccessProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative w-full max-w-md shadow-xl">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground">
              Your trip has been successfully booked
            </p>
          </div>

          <div className="space-y-3 bg-muted rounded-lg p-4 text-left">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {trip.origin} → {trip.destination}
                </p>
              </div>
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">Booking ID</p>
              <p className="text-muted-foreground font-mono text-xs">{booking.id}</p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">Seats Booked</p>
              <p className="text-muted-foreground">{booking.seats_booked}</p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">Fare</p>
              <p className="text-primary font-bold">{booking.total_fare_aed} AED</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg p-3">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
            <div className="text-sm">
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                +{booking.reward_points_earned} Reward Points
              </p>
            </div>
          </div>

          <Button onClick={onClose} className="w-full mt-4">
            Done
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
