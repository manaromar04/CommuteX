import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Clock, Users, DollarSign, Star } from "lucide-react";
import { calculateCompleteFare, type CarType } from "@/lib/pricing";

interface AvailableTrip {
  id: string;
  driver_name: string;
  driver_rating: number;
  origin: string;
  destination: string;
  date: string;
  departure_time: string;
  distance_km: number;
  available_seats: number;
  booked_seats: number;
  car_type: CarType;
  status: "active" | "full";
}

interface AvailableTripsProps {
  trips: AvailableTrip[];
  userBalance: number;
  onBookTrip?: (tripId: string, seats: number) => void;
}

export function AvailableTrips({ trips, userBalance, onBookTrip }: AvailableTripsProps) {
  const [selectedTrip, setSelectedTrip] = useState<AvailableTrip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const activateTrips = trips.filter((t) => t.status === "active" && t.available_seats > 0);

  const handleBookClick = (trip: AvailableTrip) => {
    setSelectedTrip(trip);
    setSelectedSeats(1);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (selectedTrip && onBookTrip) {
      onBookTrip(selectedTrip.id, selectedSeats);
      setBookingModalOpen(false);
      setSelectedTrip(null);
    }
  };

  return (
    <div className="space-y-4">
      {activateTrips.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-muted-foreground">No available trips at the moment</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later or create a custom trip request
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        activateTrips.map((trip) => {
          const fareCalc = calculateCompleteFare(
            trip.car_type,
            trip.distance_km,
            trip.available_seats,
            true
          );

          return (
            <Card key={trip.id} className="border">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Trip Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-lg">
                          {trip.origin} → {trip.destination}
                        </h3>
                        {trip.booked_seats > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {trip.booked_seats} booked
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-muted-foreground">
                            {trip.driver_rating.toFixed(1)} • {trip.driver_name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        trip.available_seats <= 1
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                      }
                    >
                      {trip.available_seats} seat{trip.available_seats !== 1 ? "s" : ""} left
                    </Badge>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{trip.departure_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.distance_km} km</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{trip.car_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>{fareCalc.discountedFare} AED</span>
                    </div>
                  </div>

                  {/* Fare Breakdown */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-xs">
                    <p className="text-muted-foreground mb-2">
                      <strong>Fare Breakdown (per passenger):</strong>
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Base + Distance:</span>
                        <span>{fareCalc.totalFare} AED</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Per Passenger:</span>
                        <span>{fareCalc.farePerPassenger} AED</span>
                      </div>
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Carpool Discount (10%):</span>
                        <span>
                          -{(fareCalc.farePerPassenger - fareCalc.discountedFare).toFixed(2)} AED
                        </span>
                      </div>
                      <div className="border-t border-blue-200 dark:border-blue-800 pt-1 mt-1 flex justify-between font-bold text-foreground">
                        <span>You Pay:</span>
                        <span className="text-green-600 dark:text-green-400">
                          {fareCalc.discountedFare} AED
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button
                    onClick={() => handleBookClick(trip)}
                    disabled={trip.available_seats === 0}
                    className="w-full"
                  >
                    {trip.available_seats === 0 ? "Trip Full" : "Book Seat(s)"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Booking Modal */}
      {selectedTrip && (
        <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Book a Seat</DialogTitle>
              <DialogDescription>
                {selectedTrip.origin} → {selectedTrip.destination}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Trip Summary */}
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver:</span>
                  <span className="font-medium">{selectedTrip.driver_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">
                    {selectedTrip.date} at {selectedTrip.departure_time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle:</span>
                  <span className="font-medium">{selectedTrip.car_type}</span>
                </div>
              </div>

              {/* Seat Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Seats</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((num) => (
                    <Button
                      key={num}
                      variant={selectedSeats === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSeats(num)}
                      disabled={num > selectedTrip.available_seats}
                      className="flex-1"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedTrip.available_seats} seats available
                </p>
              </div>

              {/* Fare Calculation */}
              {(() => {
                const totalFareForSeats = calculateCompleteFare(
                  selectedTrip.car_type,
                  selectedTrip.distance_km,
                  selectedTrip.available_seats,
                  true
                );
                const totalCost = totalFareForSeats.discountedFare * selectedSeats;

                return (
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg space-y-2">
                    <div className="text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Price per seat:</span>
                        <span>{totalFareForSeats.discountedFare} AED</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Number of seats:</span>
                        <span>{selectedSeats}</span>
                      </div>
                      <div className="border-t border-green-200 dark:border-green-800 pt-2 mt-2 flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-green-600 dark:text-green-400">
                          {totalCost.toFixed(2)} AED
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-3">
                      <p>
                        <strong>Wallet Balance:</strong> {userBalance.toFixed(2)} AED
                      </p>
                      {totalCost > userBalance && (
                        <p className="text-red-600 dark:text-red-400 mt-1">
                          ⚠️ Insufficient balance. Add {(totalCost - userBalance).toFixed(2)} AED to your wallet.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setBookingModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  disabled={
                    (() => {
                      const totalFareForSeats = calculateCompleteFare(
                        selectedTrip.car_type,
                        selectedTrip.distance_km,
                        selectedTrip.available_seats,
                        true
                      );
                      return (
                        totalFareForSeats.discountedFare * selectedSeats > userBalance
                      );
                    })()
                  }
                  className="flex-1"
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
