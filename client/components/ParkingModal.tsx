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
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/types";
import { MapPin, Zap, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Hub as HubType, calculateParkingCost } from "@/lib/hubs";
import {
  createParkingBooking,
  processParkingDeduction,
} from "@/lib/parkingBooking";

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
  onConfirm: (hubConfig?: HubType, pointsCost?: number, bonusPoints?: number) => void;
  hubConfig?: HubType;
}

export function ParkingModal({
  hub,
  user,
  isOpen,
  onClose,
  onConfirm,
  hubConfig,
}: ParkingModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [usedPublicTransport, setUsedPublicTransport] = useState(false);

  if (!hub || !user || !hubConfig) return null;

  const currentHour = new Date().getHours();
  const baseCost = calculateParkingCost(hubConfig, currentHour);
  const isPeakHour =
    currentHour >= hubConfig.peak_hours.start &&
    currentHour < hubConfig.peak_hours.end;

  const { booking, pointsCost, discountApplied, finalCost } =
    createParkingBooking(user.id, hubConfig, 0);

  const validation = processParkingDeduction(user.reward_points, booking);
  const canBook = validation.success;

  const handleConfirm = () => {
    if (!validation.success) return;

    const bonusPoints = usedPublicTransport ? hubConfig.bonus_points_on_metro_usage : 0;
    const finalBalance = (validation.newBalance || 0) + bonusPoints;

    setShowConfirmation(true);
    setTimeout(() => {
      onConfirm(hubConfig);
    }, 3000);
  };

  if (showConfirmation) {
    const bonusPoints = usedPublicTransport ? hubConfig.bonus_points_on_metro_usage : 0;
    const finalBalance = (validation.newBalance || 0) + bonusPoints;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                Parking Confirmed!
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your parking at {hub.name} is confirmed
              </p>
            </div>
            <Card className="mt-4 p-4 text-left space-y-3 bg-muted/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hub:</span>
                <span className="font-medium">{hub.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">
                  {hubConfig.parking_duration_hours} hours
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Points Deducted:</span>
                <span className="font-medium text-red-600">-{finalCost}</span>
              </div>
              {discountApplied > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount Applied:</span>
                  <span className="font-medium">-{discountApplied} pts</span>
                </div>
              )}
              {usedPublicTransport && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Park & Ride Bonus:</span>
                  <span className="font-medium">
                    +{hubConfig.bonus_points_on_metro_usage} pts
                  </span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span className="text-foreground">Remaining Balance:</span>
                <span className="text-yellow-600">{finalBalance} points</span>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Parking Space</DialogTitle>
          <DialogDescription>
            Reserve a spot at {hub.name} using your reward points
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hub Details */}
          <div className="space-y-3 rounded-lg bg-muted p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Location</p>
                <p className="text-sm text-muted-foreground">{hub.location}</p>
              </div>
              {isPeakHour && (
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200">
                  Peak Hours
                </Badge>
              )}
            </div>

            <div className="text-sm">
              <p className="font-medium text-foreground">Available Spaces</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${((hub.capacity - hub.current_vehicles) / hub.capacity) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium">
                  {hub.capacity - hub.current_vehicles}/{hub.capacity}
                </span>
              </div>
            </div>
          </div>

          {/* Parking Details */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold text-foreground">
                  {hubConfig.parking_duration_hours} hours
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Base Cost</p>
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  {baseCost} points
                </p>
              </div>
            </div>

            {isPeakHour && (
              <div className="border-t border-border pt-3">
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  ⚠️ Peak hour surcharge:{" "}
                  {Math.round(hubConfig.peak_hours.multiplier * 100 - 100)}%
                  applied
                </p>
              </div>
            )}
          </Card>

          {/* Cost Breakdown */}
          <Card className="p-4 space-y-2 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Cost:</span>
              <span className="font-medium">{pointsCost} points</span>
            </div>
            {discountApplied > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Loyalty Discount:</span>
                <span className="font-medium">-{discountApplied} points</span>
              </div>
            )}
            <div className="border-t border-blue-200 dark:border-blue-800 pt-2 flex justify-between font-bold">
              <span className="text-foreground">Total Cost:</span>
              <span className="text-yellow-600">{finalCost} points</span>
            </div>
          </Card>

          {/* User Points Balance */}
          <Card className="p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Your Reward Points:
              </span>
              <span className="font-bold text-yellow-600">
                {user.reward_points} points
              </span>
            </div>
            {canBook && (
              <div className="flex justify-between text-sm text-green-600">
                <span>After Booking:</span>
                <span className="font-semibold">{validation.newBalance}</span>
              </div>
            )}
          </Card>

          {/* Public Transport Bonus */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <input
                type="checkbox"
                checked={usedPublicTransport}
                onChange={(e) => setUsedPublicTransport(e.target.checked)}
                className="rounded"
              />
              I will use public transport from this hub
            </label>
            {usedPublicTransport && (
              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-3 flex gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-200">
                    🎁 Earn +{hubConfig.bonus_points_on_metro_usage} Bonus Points
                  </p>
                  <p className="text-xs text-green-800 dark:text-green-300 mt-1">
                    Park & Ride incentive for using public transport
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {!canBook && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-200">
                  {validation.message}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!canBook}>
            {canBook ? `Confirm Booking (${finalCost} points)` : "Cannot Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
