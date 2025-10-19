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
import { PostTripModal } from "@/components/DriverModals/PostTripModal";
import { BookingRequestsModal } from "@/components/DriverModals/BookingRequestsModal";
import { EarningsModal } from "@/components/DriverModals/EarningsModal";
import { MyTripsModal } from "@/components/DriverModals/MyTripsModal";
import { seedTrips, seedBookings } from "@shared/seeds";
import { User, Trip, Booking, UserRole } from "@shared/types";
import { MapPin, Clock, Users, TrendingUp, Star, Zap, CheckCircle, AlertCircle, Car, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser, logout, userRole } = useAuth();
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
  const [forecastHour, setForecastHour] = useState(7);
  const [selectedCorridor, setSelectedCorridor] = useState<string | null>(null);
  const [isPostTripModalOpen, setIsPostTripModalOpen] = useState(false);
  const [isBookingRequestsModalOpen, setIsBookingRequestsModalOpen] = useState(false);
  const [isEarningsModalOpen, setIsEarningsModalOpen] = useState(false);
  const [isMyTripsModalOpen, setIsMyTripsModalOpen] = useState(false);

  useEffect(() => {
    // Initialize with authenticated user
    if (authUser) {
      setCurrentUser(authUser);
    }
    setTrips(seedTrips);
    setBookings(seedBookings);
  }, [authUser]);

  // Set default active tab based on role
  useEffect(() => {
    if (userRole === "PASSENGER") {
      setActiveTab("passenger");
    } else if (userRole === "DRIVER") {
      setActiveTab("driver");
    } else if (userRole === "ADMIN") {
      setActiveTab("admin");
    }
  }, [userRole]);

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
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">0</div>
            <p className="text-xs text-muted-foreground mt-1">Ongoing</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Post a Trip
            </CardTitle>
            <CardDescription>
              Create a new carpool trip and earn money
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setIsPostTripModalOpen(true)}>
              Create New Trip
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Booking Requests
            </CardTitle>
            <CardDescription>
              Review and manage passenger booking requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setIsBookingRequestsModalOpen(true)}>
              View Requests (0)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Earnings
            </CardTitle>
            <CardDescription>
              Track your income and trip statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setIsEarningsModalOpen(true)}>
              View Earnings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              My Trips
            </CardTitle>
            <CardDescription>
              View all your posted and completed trips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setIsMyTripsModalOpen(true)}>
              View All Trips
            </Button>
          </CardContent>
        </Card>
      </div>
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

  // Mock corridor data
  const corridors = [
    {
      id: "E11_SZR",
      name: "E11 - Sheikh Zayed Road",
      hours: {
        7: { speed: 45, jamFactor: 8, volume: 85 },
        8: { speed: 35, jamFactor: 9, volume: 95 },
        9: { speed: 40, jamFactor: 8, volume: 90 },
        10: { speed: 60, jamFactor: 4, volume: 50 },
        11: { speed: 70, jamFactor: 2, volume: 30 },
        12: { speed: 65, jamFactor: 3, volume: 40 },
        17: { speed: 50, jamFactor: 7, volume: 75 },
        18: { speed: 35, jamFactor: 9, volume: 92 },
      },
    },
    {
      id: "E311",
      name: "E311 - Emirates Highway",
      hours: {
        7: { speed: 55, jamFactor: 6, volume: 70 },
        8: { speed: 40, jamFactor: 8, volume: 85 },
        9: { speed: 50, jamFactor: 7, volume: 80 },
        10: { speed: 75, jamFactor: 2, volume: 25 },
        11: { speed: 80, jamFactor: 1, volume: 15 },
        12: { speed: 75, jamFactor: 2, volume: 20 },
        17: { speed: 60, jamFactor: 5, volume: 65 },
        18: { speed: 45, jamFactor: 7, volume: 78 },
      },
    },
    {
      id: "AlIttihad",
      name: "Al Ittihad Road",
      hours: {
        7: { speed: 50, jamFactor: 7, volume: 78 },
        8: { speed: 38, jamFactor: 8, volume: 88 },
        9: { speed: 45, jamFactor: 7, volume: 85 },
        10: { speed: 68, jamFactor: 3, volume: 35 },
        11: { speed: 72, jamFactor: 2, volume: 28 },
        12: { speed: 70, jamFactor: 2, volume: 32 },
        17: { speed: 55, jamFactor: 6, volume: 72 },
        18: { speed: 40, jamFactor: 8, volume: 85 },
      },
    },
  ];

  const currentHourData = corridors.map((corridor) => ({
    ...corridor,
    current: corridor.hours[forecastHour as keyof typeof corridor.hours] || {
      speed: 60,
      jamFactor: 3,
      volume: 50,
    },
  }));

  const getJamColor = (jamFactor: number) => {
    if (jamFactor >= 8) return "bg-red-600";
    if (jamFactor >= 6) return "bg-orange-500";
    if (jamFactor >= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getRecommendation = () => {
    const avgJam = currentHourData.reduce((sum, c) => sum + c.current.jamFactor, 0) / currentHourData.length;

    if (avgJam >= 7) {
      return {
        type: "peak",
        title: "Peak Hours Alert",
        message: `Activate carpool bonuses + 20% toll discount on ${currentHourData.find(c => c.current.jamFactor === Math.max(...currentHourData.map(x => x.current.jamFactor)))?.name}`,
        bgColor: "bg-red-50 dark:bg-red-950",
        textColor: "text-red-900 dark:text-red-200",
        borderColor: "border-red-200 dark:border-red-800",
        iconColor: "text-red-600 dark:text-red-400",
      };
    }

    if (avgJam >= 4 && avgJam < 7) {
      return {
        type: "mid",
        title: "Mid-Jam Hours",
        message: "Double Green Points for Park & Ride to avoid congestion",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
        textColor: "text-yellow-900 dark:text-yellow-200",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        iconColor: "text-yellow-600 dark:text-yellow-400",
      };
    }

    return {
      type: "normal",
      title: "Normal Operations",
      message: "Good time to travel with optimal traffic conditions across corridors",
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-900 dark:text-green-200",
      borderColor: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
    };
  };

  const recommendation = getRecommendation();

  const worstCorridor = currentHourData.reduce((prev, current) =>
    current.current.jamFactor > prev.current.jamFactor ? current : prev
  );

  const cellsWithHighJam = currentHourData.filter(c => c.current.jamFactor >= 7).length;
  const avgSpeed = Math.round(
    currentHourData.reduce((sum, c) => sum + c.current.speed, 0) / currentHourData.length
  );

  const forecastContent = (
    <div className="space-y-6">
      {/* Time Slider */}
      <Card>
        <CardHeader>
          <CardTitle>Time Slider</CardTitle>
          <CardDescription>View traffic predictions for different hours of the day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground min-w-fit">7 AM</span>
            <input
              type="range"
              min="7"
              max="18"
              value={forecastHour}
              onChange={(e) => setForecastHour(parseInt(e.target.value))}
              className="flex-1 cursor-pointer h-2 bg-border rounded-lg appearance-none accent-primary"
            />
            <span className="text-sm font-medium text-muted-foreground min-w-fit">6 PM</span>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-primary">
              {String(forecastHour).padStart(2, "0")}:00
            </span>
          </div>
        </CardContent>
      </Card>

      {/* KPI Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Worst Corridor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-red-600">
              {worstCorridor.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Jam Factor: {worstCorridor.current.jamFactor}/10
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-primary">
              {avgSpeed} kph
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Across all corridors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High Congestion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-orange-600">
              {cellsWithHighJam} corridor{cellsWithHighJam !== 1 ? "s" : ""}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Jam Factor ≥ 7/10
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Recommendations */}
      <Card className={`border ${recommendation.borderColor}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className={`h-5 w-5 ${recommendation.iconColor}`} />
            {recommendation.title}
          </CardTitle>
        </CardHeader>
        <CardContent className={`p-3 rounded text-sm ${recommendation.bgColor} ${recommendation.textColor}`}>
          {recommendation.message}
        </CardContent>
      </Card>

      {/* Heatmap & Traffic Data */}
      <Card>
        <CardHeader>
          <CardTitle>Corridor Heat Map & Traffic Data</CardTitle>
          <CardDescription>Real-time congestion levels and metrics for key corridors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentHourData.map((corridor) => (
            <div
              key={corridor.id}
              onClick={() => setSelectedCorridor(selectedCorridor === corridor.id ? null : corridor.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedCorridor === corridor.id
                  ? "bg-muted border-primary ring-2 ring-primary/20"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="space-y-3">
                {/* Corridor Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{corridor.name}</h4>
                  <div className="flex items-center gap-2">
                    <div
                      className={`${getJamColor(corridor.current.jamFactor)} w-6 h-6 rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white text-xs font-bold">
                        {corridor.current.jamFactor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Heatmap Bar */}
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Congestion Level</div>
                  <div className="w-full bg-border rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all ${getJamColor(corridor.current.jamFactor)}`}
                      style={{ width: `${(corridor.current.jamFactor / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Traffic Metrics */}
                {selectedCorridor === corridor.id && (
                  <div className="mt-3 pt-3 border-t border-border space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-muted-foreground text-xs">Speed</p>
                        <p className="text-lg font-bold text-blue-600">{corridor.current.speed} kph</p>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                        <p className="text-muted-foreground text-xs">Jam Factor</p>
                        <p className="text-lg font-bold text-orange-600">{corridor.current.jamFactor}/10</p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                        <p className="text-muted-foreground text-xs">Volume</p>
                        <p className="text-lg font-bold text-purple-600">{corridor.current.volume}%</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      Click to hide detailed metrics
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Forecast Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Peak Hours:</strong> High demand expected between 7-9 AM and 5-7 PM. Book early for better availability.
            </p>
          </div>
          <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900 dark:text-green-200">
              <strong>Best Time:</strong> Mid-day (10 AM - 3 PM) offers the most flexible booking options and lower fares.
            </p>
          </div>
          <div className="flex gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-purple-900 dark:text-purple-200">
              <strong>Smart Route:</strong> Al Ittihad Road shows better conditions at this time. Consider alternative routes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const adminContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">4</div>
            <p className="text-xs text-muted-foreground mt-1">Registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{trips.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Platform-wide</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {bookings.reduce((sum, b) => sum + b.total_fare_aed, 0)} AED
            </div>
            <p className="text-xs text-muted-foreground mt-1">Collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">2</div>
            <p className="text-xs text-muted-foreground mt-1">Online now</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Management
            </CardTitle>
            <CardDescription>
              View, manage, and monitor user accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Policy Control
            </CardTitle>
            <CardDescription>
              Configure rewards, fares, and platform rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Edit Policies
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Analytics
            </CardTitle>
            <CardDescription>
              View platform metrics and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Moderation
            </CardTitle>
            <CardDescription>
              Handle reports and platform issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Reports
            </Button>
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
          userRole={userRole || "PASSENGER"}
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

      {/* Driver Modals */}
      <PostTripModal
        open={isPostTripModalOpen}
        onOpenChange={setIsPostTripModalOpen}
        onTripCreated={(trip) => {
          setTrips([...trips, trip]);
        }}
      />

      <BookingRequestsModal
        open={isBookingRequestsModalOpen}
        onOpenChange={setIsBookingRequestsModalOpen}
      />

      <EarningsModal
        open={isEarningsModalOpen}
        onOpenChange={setIsEarningsModalOpen}
      />

      <MyTripsModal
        open={isMyTripsModalOpen}
        onOpenChange={setIsMyTripsModalOpen}
        onTripDeleted={(tripId) => {
          setTrips(trips.filter((t) => t.id !== tripId));
        }}
      />
    </div>
  );
}
