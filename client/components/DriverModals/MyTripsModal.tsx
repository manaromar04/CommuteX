import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Trash2, Eye } from "lucide-react";

interface Trip {
  id: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  fare: number;
  availableSeats: number;
  bookedSeats: number;
  status: "active" | "completed" | "cancelled";
  passengers: number;
  earnings: number;
}

interface MyTripsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTripDeleted?: (tripId: string) => void;
}

export function MyTripsModal({ open, onOpenChange, onTripDeleted }: MyTripsModalProps) {
  const trips: Trip[] = [
    {
      id: "trip_001",
      origin: "Sharjah",
      destination: "Dubai",
      date: "2024-01-15",
      departureTime: "07:30",
      fare: 50,
      availableSeats: 4,
      bookedSeats: 3,
      status: "active",
      passengers: 3,
      earnings: 150,
    },
    {
      id: "trip_002",
      origin: "Ajman",
      destination: "Dubai",
      date: "2024-01-15",
      departureTime: "09:00",
      fare: 40,
      availableSeats: 4,
      bookedSeats: 2,
      status: "active",
      passengers: 2,
      earnings: 80,
    },
    {
      id: "trip_003",
      origin: "Sharjah",
      destination: "Dubai",
      date: "2024-01-14",
      departureTime: "07:30",
      fare: 50,
      availableSeats: 4,
      bookedSeats: 4,
      status: "completed",
      passengers: 4,
      earnings: 200,
    },
    {
      id: "trip_004",
      origin: "Sharjah",
      destination: "Abu Dhabi",
      date: "2024-01-13",
      departureTime: "06:00",
      fare: 60,
      availableSeats: 4,
      bookedSeats: 3,
      status: "completed",
      passengers: 3,
      earnings: 180,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const activeTrips = trips.filter((t) => t.status === "active");
  const completedTrips = trips.filter((t) => t.status === "completed");
  const totalEarnings = trips.reduce((sum, t) => sum + t.earnings, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>My Trips</DialogTitle>
          <DialogDescription>
            View all your posted and completed trips
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{trips.length}</p>
              <p className="text-xs text-muted-foreground">Total Trips</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{activeTrips.length}</p>
              <p className="text-xs text-muted-foreground">Active Now</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">{totalEarnings} AED</p>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
            </div>
          </div>

          {/* Active Trips Section */}
          {activeTrips.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm">Active Trips</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {activeTrips.map((trip) => (
                  <Card key={trip.id} className="border">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {/* Trip Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <p className="font-semibold text-foreground">
                                {trip.origin} → {trip.destination}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {trip.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {trip.departureTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {trip.bookedSeats}/{trip.availableSeats} seats
                              </span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(trip.status)}>
                            Active
                          </Badge>
                        </div>

                        {/* Trip Details */}
                        <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-border">
                          <div>
                            <p className="text-muted-foreground">Fare per seat</p>
                            <p className="font-semibold text-foreground">{trip.fare} AED</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Potential earnings</p>
                            <p className="font-semibold text-green-600">
                              {trip.fare * trip.bookedSeats} AED
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={() => {}}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-2 text-red-600 dark:text-red-400 hover:text-red-700"
                            onClick={() => {
                              if (onTripDeleted) {
                                onTripDeleted(trip.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Trips Section */}
          {completedTrips.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm">Completed Trips</h3>
              <div className="space-y-2">
                {completedTrips.map((trip) => (
                  <Card key={trip.id} className="border opacity-75">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {trip.origin} → {trip.destination}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {trip.date} • {trip.passengers} passengers
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+{trip.earnings} AED</p>
                          <Badge variant="outline" className="mt-1">
                            Completed
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Calendar icon import fix
import { Calendar } from "lucide-react";
