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
import { CheckCircle, X, Clock, Users } from "lucide-react";

export interface BookingRequest {
  id: string;
  passengerName: string;
  passengerId: string;
  tripId: string;
  tripOrigin: string;
  tripDestination: string;
  seats: number;
  farePerPassenger: number;
  totalCost: number;
  status: "pending" | "confirmed" | "rejected";
  requestedAt: string;
}

interface BookingRequestsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmBooking?: (bookingId: string) => void;
  onDeclineBooking?: (bookingId: string) => void;
  bookingRequests?: BookingRequest[];
}

export function BookingRequestsModal({
  open,
  onOpenChange,
  onConfirmBooking,
  onDeclineBooking,
  bookingRequests: providedRequests,
}: BookingRequestsModalProps) {
  const defaultRequests: BookingRequest[] = [
    {
      id: "req_001",
      passengerName: "Huda Ahmed",
      passengerId: "passenger_001",
      tripId: "trip_001",
      tripOrigin: "Sharjah",
      tripDestination: "Dubai",
      seats: 2,
      farePerPassenger: 15.75,
      totalCost: 31.5,
      status: "pending",
      requestedAt: "2024-01-15 08:30",
    },
    {
      id: "req_002",
      passengerName: "Fatima Mohammed",
      passengerId: "passenger_002",
      tripId: "trip_001",
      tripOrigin: "Sharjah",
      tripDestination: "Dubai",
      seats: 1,
      farePerPassenger: 15.75,
      totalCost: 15.75,
      status: "pending",
      requestedAt: "2024-01-15 07:45",
    },
    {
      id: "req_003",
      passengerName: "Layla Hassan",
      passengerId: "passenger_003",
      tripId: "trip_001",
      tripOrigin: "Sharjah",
      tripDestination: "Dubai",
      seats: 1,
      farePerPassenger: 15.75,
      totalCost: 15.75,
      status: "confirmed",
      requestedAt: "2024-01-14 18:20",
    },
  ];

  const bookingRequests = providedRequests || defaultRequests;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200";
      case "confirmed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-900/30";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Booking Requests</DialogTitle>
          <DialogDescription>
            Review and manage passenger booking requests for your trips
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {bookingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No booking requests at the moment</p>
            </div>
          ) : (
            bookingRequests.map((request) => (
              <Card key={request.id} className="border">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {request.passengerName}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {request.tripOrigin} → {request.tripDestination}
                        </p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {request.seats} seat{request.seats > 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {request.requestedAt}
                      </span>
                    </div>

                    {/* Booking Summary */}
                    <div className="grid grid-cols-3 gap-2 text-xs bg-muted p-2 rounded">
                      <div>
                        <p className="text-muted-foreground">Fare/Seat</p>
                        <p className="font-semibold">{request.farePerPassenger} AED</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Seats</p>
                        <p className="font-semibold">{request.seats}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-semibold text-green-600">
                          {request.totalCost.toFixed(2)} AED
                        </p>
                      </div>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-2 text-red-600 dark:text-red-400 hover:text-red-700"
                          onClick={() => {
                            if (onDeclineBooking) {
                              onDeclineBooking(request.id);
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => {
                            if (onConfirmBooking) {
                              onConfirmBooking(request.id);
                            }
                          }}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Confirm
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
