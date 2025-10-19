import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { TabLayout } from "@/components/TabLayout";
import { SalmaCopilot } from "@/components/SalmaCopilot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { BookingSuccess } from "@/components/BookingSuccess";
import { ParkingModal } from "@/components/ParkingModal";
import { seedTrips, seedBookings } from "@shared/seeds";
import { User, Trip, Booking } from "@shared/types";
import { MapPin, Clock, Users, TrendingUp, Star, Zap, CheckCircle, AlertCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("passenger");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [selectedHub, setSelectedHub] = useState<any>(null);
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false);

  useEffect(() => {
    // Initialize with authenticated user
    if (authUser) {
      setCurrentUser(authUser);
    }
    setTrips(seedTrips);
    setBookings(seedBookings);
  }, [authUser]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
          <CardDescription>Park & Ride locations across UAE</CardDescription>
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
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedHub({
                        ...hub,
                        current_vehicles: hub.capacity - hub.available,
                      });
                      setIsParkingModalOpen(true);
                    }}
                    disabled={hub.available === 0}
                  >
                    {hub.available > 0 ? "Book Parking" : "Full"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const handleParkingBooking = () => {
    if (!selectedHub || !currentUser) return;

    const parkingCost = 20; // 5 AED/hour * 4 hours default
    const rewardPoints = 40; // Park & Ride bonus

    // Update user wallet and points
    const updatedUser = {
      ...currentUser,
      wallet_balance_aed: currentUser.wallet_balance_aed - parkingCost,
      reward_points: currentUser.reward_points + rewardPoints,
    };

    setCurrentUser(updatedUser);
    setIsParkingModalOpen(false);

    // Show success notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-4";
    notification.innerHTML = `
      <p class="font-semibold">Parking Space Booked!</p>
      <p class="text-sm">20 AED charged • +40 Reward Points earned</p>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  };

  const forecastContent = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Forecast Map</CardTitle>
          <CardDescription>AI-powered trip demand forecast</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {/* Forecast Insights */}
          <div className="border-t border-border pt-6 space-y-3">
            <h3 className="font-semibold text-foreground">Forecast Insights</h3>
            <div className="space-y-2">
              <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Peak Hours:</strong> High demand expected between 7-9 AM and 5-7 PM. Book early for better availability.
                </p>
              </div>
              <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-900 dark:text-green-200">
                  <strong>Best Time:</strong> Mid-day (10 AM - 3 PM) offers the most flexible booking options.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const adminContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{trips.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{bookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {bookings.reduce((sum, b) => sum + b.total_fare_aed, 0)} AED
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total collected</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Policy Management</CardTitle>
          <CardDescription>Configure rewards and trip settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Carpool Reward Points</p>
                <p className="text-sm text-muted-foreground">For trips with 3+ passengers</p>
              </div>
              <Badge className="bg-yellow-500 text-white">80 pts</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Park & Ride Reward Points</p>
                <p className="text-sm text-muted-foreground">For parking hub bookings</p>
              </div>
              <Badge className="bg-yellow-500 text-white">40 pts</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Minimum Trip Fare</p>
                <p className="text-sm text-muted-foreground">Lowest allowed fare per trip</p>
              </div>
              <Badge className="bg-blue-500 text-white">20 AED</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookings.slice(-5).map((booking) => {
              const trip = trips.find((t) => t.id === booking.trip_id);
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {trip?.origin} → {trip?.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      +{booking.total_fare_aed} AED
                    </p>
                  </div>
                </div>
              );
            })}
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
        onLogout={handleLogout}
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

      {/* Booking Modal */}
      <BookingModal
        trip={selectedTrip}
        user={currentUser}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedTrip(null);
        }}
        onConfirm={handleConfirmBooking}
      />

      {/* Booking Success Modal */}
      {showBookingSuccess && lastBooking && selectedTrip && (
        <BookingSuccess
          booking={lastBooking}
          trip={selectedTrip}
          onClose={() => {
            setShowBookingSuccess(false);
            setLastBooking(null);
            setSelectedTrip(null);
          }}
        />
      )}

      {/* Parking Modal */}
      <ParkingModal
        hub={selectedHub}
        user={currentUser}
        isOpen={isParkingModalOpen}
        onClose={() => {
          setIsParkingModalOpen(false);
          setSelectedHub(null);
        }}
        onConfirm={handleParkingBooking}
      />
    </div>
  );
}
