import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "@shared/types";
import { MapPin, Clock } from "lucide-react";
import { useState } from "react";

interface Hub {
  name: string;
  location: string;
  capacity: number;
  current_vehicles: number;
}

interface ParkingModalProps {
  hub: Hub | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ParkingModal({
  hub,
  user,
  isOpen,
  onClose,
  onConfirm,
}: ParkingModalProps) {
  const [duration, setDuration] = useState(4);
  const pricePerHour = 5;
  const totalPrice = duration * pricePerHour;

  if (!hub || !user) return null;

  const canBook = user.wallet_balance_aed >= totalPrice;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Parking Space</DialogTitle>
          <DialogDescription>
            Reserve a spot at {hub.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hub Details */}
          <div className="space-y-3 rounded-lg bg-muted p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">Location</p>
                <p className="text-sm text-muted-foreground">{hub.location}</p>
              </div>
            </div>

            <div className="text-sm">
              <p className="font-medium text-foreground">Available Spaces</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${
                        ((hub.capacity - hub.current_vehicles) / hub.capacity) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium">
                  {hub.capacity - hub.current_vehicles}/{hub.capacity}
                </span>
              </div>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Duration (hours)
            </label>
            <div className="flex gap-2">
              {[2, 4, 6, 8].map((hrs) => (
                <Button
                  key={hrs}
                  variant={duration === hrs ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuration(hrs)}
                >
                  {hrs}h
                </Button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <Card className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium text-foreground">{pricePerHour} AED/hour</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium text-foreground">{duration} hours</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold text-foreground">Total Cost</span>
              <span className="font-bold text-primary text-lg">{totalPrice} AED</span>
            </div>
          </Card>

          {/* Rewards Info */}
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950 p-3">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
              🎁 Earn 40 Reward Points
            </p>
            <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
              Park & Ride bonus rewards
            </p>
          </div>

          {!canBook && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Insufficient balance. You need {totalPrice - user.wallet_balance_aed} AED more.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!canBook}>
            {canBook ? "Book Space" : "Cannot Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
