import { Trip, User, Booking } from "@shared/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MapPin, Clock, Users } from "lucide-react";

interface BookingModalProps {
  trip: Trip | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (seats: number) => void;
}

export function BookingModal({
  trip,
  user,
  isOpen,
  onClose,
  onConfirm,
}: BookingModalProps) {
  const [seats, setSeats] = useState(1);

  if (!trip || !user) return null;

  const totalFare = trip.fare_aed * seats;
  const canBook = user.wallet_balance_aed >= totalFare && seats <= trip.available_seats;
  const rewardPoints = trip.current_passengers + seats >= 3 ? 80 : 40;

  const handleConfirm = () => {
    onConfirm(seats);
    setSeats(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            Review and confirm your trip booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Trip Details */}
          <div className="space-y-3 rounded-lg bg-muted p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">Route</p>
                <p className="text-sm text-muted-foreground">
                  {trip.origin} → {trip.destination}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">Departure</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(trip.departure_time).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">Available Seats</p>
                <p className="text-sm text-muted-foreground">
                  {trip.available_seats} seats available
                </p>
              </div>
            </div>
          </div>

          {/* Seats Selection */}
          <div className="space-y-2">
            <Label htmlFor="seats" className="font-medium">
              Number of Seats
            </Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSeats(Math.max(1, seats - 1))}
              >
                −
              </Button>
              <Input
                id="seats"
                type="number"
                value={seats}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setSeats(Math.min(trip.available_seats, Math.max(1, val)));
                }}
                className="flex-1 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSeats(Math.min(trip.available_seats, seats + 1))}
              >
                +
              </Button>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2 rounded-lg border border-border p-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Fare per seat</span>
              <span className="text-sm font-medium text-foreground">
                {trip.fare_aed} AED
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Seats</span>
              <span className="text-sm font-medium text-foreground">× {seats}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold text-foreground">Total Fare</span>
              <span className="font-bold text-primary text-lg">{totalFare} AED</span>
            </div>
          </div>

          {/* Rewards */}
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950 p-3">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
              🎁 Earn {rewardPoints} Reward Points
            </p>
            {trip.current_passengers + seats >= 3 && (
              <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                Carpool bonus: 80 points for trips with 3+ passengers
              </p>
            )}
          </div>

          {/* Warnings */}
          {user.wallet_balance_aed < totalFare && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Insufficient balance. You need {totalFare - user.wallet_balance_aed} AED more.
              </p>
            </div>
          )}

          {seats > trip.available_seats && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Not enough seats available. Maximum: {trip.available_seats}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!canBook}>
            {canBook ? "Confirm Booking" : "Cannot Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
