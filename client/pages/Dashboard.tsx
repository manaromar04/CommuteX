import { useState, useEffect } from "react";
import { TopNav } from "@/components/TopNav";
import { TabLayout } from "@/components/TabLayout";
import { SalmaCopilot } from "@/components/SalmaCopilot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { BookingSuccess } from "@/components/BookingSuccess";
import { seedUsers, seedTrips, seedBookings } from "@shared/seeds";
import { User, Trip, Booking } from "@shared/types";
import { MapPin, Clock, Users, TrendingUp, Star, Zap, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("passenger");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  useEffect(() => {
    // Initialize with seed data
    const user = seedUsers[1]; // Huda - passenger by default
    setCurrentUser(user);
    setTrips(seedTrips);
    setBookings(seedBookings);
  }, []);

  const handleBookTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (seats: number) => {
    if (!selectedTrip || !currentUser) return;

    const totalFare = selectedTrip.fare_aed * seats;
    const rewardPoints = selectedTrip.current_passengers + seats >= 3 ? 80 : 40;

    // Create new booking
    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      trip_id: selectedTrip.id,
      passenger_id: currentUser.id,
      seats_booked: seats,
      total_fare_aed: totalFare,
      status: "CONFIRMED",
      reward_points_earned: rewardPoints,
      created_at: new Date(),
    };

    // Update user wallet and points
    const updatedUser = {
      ...currentUser,
      wallet_balance_aed: currentUser.wallet_balance_aed - totalFare,
      reward_points: currentUser.reward_points + rewardPoints,
    };

    // Update trip available seats
    const updatedTrip = {
      ...selectedTrip,
      available_seats: selectedTrip.available_seats - seats,
      current_passengers: selectedTrip.current_passengers + seats,
    };

    // Update state
    setCurrentUser(updatedUser);
    setTrips(trips.map((t) => (t.id === selectedTrip.id ? updatedTrip : t)));
    setBookings([...bookings, newBooking]);
    setLastBooking(newBooking);

    // Show success modal
    setIsBookingModalOpen(false);
    setShowBookingSuccess(true);
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      BRONZE: "bg-amber-600",
      SILVER: "bg-slate-400",
      GOLD: "bg-yellow-500",
      PLATINUM: "bg-indigo-600",
    };
    return colors[tier] || "bg-slate-500";
  };

  const passengerContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {currentUser?.wallet_balance_aed} AED
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {currentUser?.reward_points}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tier Level</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${getTierColor(currentUser?.tier || "")} text-white`}>
              {currentUser?.tier}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Member status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {bookings.filter((b) => b.passenger_id === currentUser?.id).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completed journeys</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      {bookings.filter((b) => b.passenger_id === currentUser?.id).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Recent Bookings</CardTitle>
            <CardDescription>Trips you've booked</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings
              .filter((b) => b.passenger_id === currentUser?.id)
              .slice(-3)
              .map((booking) => {
                const trip = trips.find((t) => t.id === booking.trip_id);
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm truncate">
                          {trip?.origin} → {trip?.destination}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.seats_booked} seat{booking.seats_booked > 1 ? "s" : ""} • {booking.total_fare_aed} AED
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{booking.status}</Badge>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Trips</CardTitle>
          <CardDescription>Book your next carpool journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {trips.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No trips available at the moment.</p>
            </div>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {trip.origin} → {trip.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(trip.departure_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {trip.available_seats} seats available
                    </div>
                    <span className="font-semibold text-primary">
                      {trip.fare_aed} AED
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => handleBookTrip(trip)}
                  disabled={trip.available_seats === 0}
                  className="ml-4"
                >
                  {trip.available_seats > 0 ? "Book" : "Full"}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );

  const driverContent = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Driver Dashboard</CardTitle>
          <CardDescription>Manage your trips and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Switch to Driver role to view driver features
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const hubsContent = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Hubs</CardTitle>
          <CardDescription>Park & Ride locations across GCC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Sharjah Central Hub",
                location: "Sharjah City Centre",
                capacity: 500,
                available: 120,
              },
              {
                name: "Dubai Downtown Hub",
                location: "BurJuman Complex",
                capacity: 800,
                available: 340,
              },
              {
                name: "Dubai Airport Hub",
                location: "Terminal 3 Parking",
                capacity: 1000,
                available: 450,
              },
              {
                name: "Abu Dhabi Main Hub",
                location: "Zayed City Centre",
                capacity: 600,
                available: 200,
              },
            ].map((hub) => (
              <Card key={hub.name} className="bg-muted/50">
                <CardContent className="pt-6 space-y-3">
                  <h4 className="font-semibold text-foreground">{hub.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {hub.location}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Availability</span>
                      <span className="font-semibold">
                        {hub.available}/{hub.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(hub.available / hub.capacity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Book Parking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const forecastContent = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Forecast Map</CardTitle>
          <CardDescription>AI-powered trip demand forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: "Now - 2 Hours",
                demand: "HIGH",
                color: "bg-red-500",
                trips: 42,
              },
              {
                time: "2 - 4 Hours",
                demand: "MEDIUM",
                color: "bg-yellow-500",
                trips: 28,
              },
              {
                time: "4 - 6 Hours",
                demand: "LOW",
                color: "bg-green-500",
                trips: 12,
              },
            ].map((period) => (
              <div key={period.time} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{period.time}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {period.trips} trips expected
                    </span>
                    <Badge className={`${period.color} text-white`}>
                      {period.demand}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-border rounded-full h-3">
                  <div
                    className={`${period.color} h-3 rounded-full transition-all`}
                    style={{ width: `${(period.trips / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const adminContent = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Policy control and system management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Admin features available only to administrators
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const copilotContent = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SalmaCopilot isFloating={false} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-sm text-foreground">
                Earn 80 Points
              </p>
              <p className="text-xs text-muted-foreground">
                Carpool with 3+ passengers
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm text-foreground">
                Earn 40 Points
              </p>
              <p className="text-xs text-muted-foreground">
                Use Park & Ride services
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Zap className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm text-foreground">
                Tier Benefits
              </p>
              <p className="text-xs text-muted-foreground">
                Unlock exclusive rewards at each tier
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopNav
        userName={currentUser?.name}
        walletBalance={currentUser?.wallet_balance_aed}
      />

      <main className="container py-8">
        <TabLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={currentUser?.role}
          passengerContent={passengerContent}
          driverContent={driverContent}
          hubsContent={hubsContent}
          forecastContent={forecastContent}
          adminContent={adminContent}
          copilotContent={copilotContent}
        />
      </main>
    </div>
  );
}
