import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  calculateCompleteFare,
  CAR_TYPES,
  type CarType,
} from "@/lib/pricing";

interface PostTripModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTripCreated?: (trip: any) => void;
}

export function PostTripModal({ open, onOpenChange, onTripCreated }: PostTripModalProps) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureTime: "",
    distance: "",
    seats: "",
    date: "",
    carType: "SEDAN" as CarType,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate fare when distance, seats, or carType changes
  const calculatedFare =
    formData.distance && formData.seats
      ? calculateCompleteFare(
          formData.carType,
          parseFloat(formData.distance) || 0,
          parseInt(formData.seats) || 1
        )
      : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCarTypeChange = (value: CarType) => {
    setFormData((prev) => ({
      ...prev,
      carType: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTrip = {
      id: `trip_${Date.now()}`,
      origin: formData.origin,
      destination: formData.destination,
      departure_time: formData.departureTime,
      distance_km: parseFloat(formData.distance) || 0,
      fare_per_passenger: calculatedFare?.discountedFare || 0,
      fare_base_per_passenger: calculatedFare?.farePerPassenger || 0,
      total_fare: calculatedFare?.totalFare || 0,
      available_seats: parseInt(formData.seats) || 0,
      car_type: formData.carType,
      date: formData.date,
      driver_id: "driver_001",
      status: "active",
      created_at: new Date().toISOString(),
    };

    if (onTripCreated) {
      onTripCreated(newTrip);
    }

    setShowSuccess(true);
    setTimeout(() => {
      setFormData({
        origin: "",
        destination: "",
        departureTime: "",
        distance: "",
        seats: "",
        date: "",
        carType: "SEDAN",
      });
      setShowSuccess(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Post a New Trip</DialogTitle>
          <DialogDescription>
            Create a new carpool trip and start earning money
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
              <h3 className="font-semibold text-foreground text-lg">Trip Posted!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your trip is now live and passengers can book seats.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="date">Trip Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="origin">From (Origin)</Label>
                  <Input
                    id="origin"
                    name="origin"
                    placeholder="e.g., Sharjah"
                    value={formData.origin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">To (Destination)</Label>
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="e.g., Dubai"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                  id="departureTime"
                  name="departureTime"
                  type="time"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="carType">Vehicle Type</Label>
                  <Select value={formData.carType} onValueChange={handleCarTypeChange}>
                    <SelectTrigger id="carType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEDAN">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="MINIVAN">Minivan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    name="distance"
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.1"
                    value={formData.distance}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="seats">Available Seats</Label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  placeholder="0"
                  min="1"
                  max="6"
                  value={formData.seats}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Fare Breakdown */}
            {calculatedFare && (
              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">RTA Fare Calculation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Fare + Distance:</span>
                    <span className="font-medium">{calculatedFare.totalFare} AED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Per Passenger ({formData.seats} seats):
                    </span>
                    <span className="font-medium">{calculatedFare.farePerPassenger} AED</span>
                  </div>
                  {calculatedFare.discount > 0 && (
                    <>
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Carpool Discount ({calculatedFare.discount}%):</span>
                        <span>
                          -{" "}
                          {(
                            calculatedFare.farePerPassenger -
                            calculatedFare.discountedFare
                          ).toFixed(2)}{" "}
                          AED
                        </span>
                      </div>
                      <div className="border-t border-blue-300 dark:border-blue-700 pt-2 flex justify-between font-bold text-foreground">
                        <span>Final Price per Passenger:</span>
                        <span className="text-green-600 dark:text-green-400">
                          {calculatedFare.discountedFare} AED
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-200">
                Fares are calculated by RTA guidelines based on vehicle type and distance.
                Passengers receive a 10% carpool discount.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Post Trip
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
