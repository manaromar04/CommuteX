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
import { BookingRequestsModal, type BookingRequest } from "@/components/DriverModals/BookingRequestsModal";
import { EarningsModal } from "@/components/DriverModals/EarningsModal";
import { MyTripsModal } from "@/components/DriverModals/MyTripsModal";
import { TripCompletionModal, type TripPassenger } from "@/components/DriverModals/TripCompletionModal";
import { AvailableTrips } from "@/components/PassengerBooking/AvailableTrips";
import { TripSearch } from "@/components/PassengerBooking/TripSearch";
import { seedTrips, seedBookings, seedUsers } from "@shared/seeds";
import { User, Trip, Booking, UserRole } from "@shared/types";
import { MapPin, Clock, Users, TrendingUp, Star, Zap, CheckCircle, AlertCircle, Car, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { calculateCarpoolRewards } from "@/lib/rewards";
import { settleTripPayments, getTripSettlementSummary } from "@/lib/tripCompletion";
import { useToast } from "@/hooks/use-toast";
import { HUBS, getHubById } from "@/lib/hubs";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser, logout, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("passenger");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
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
  const [isTripCompletionModalOpen, setIsTripCompletionModalOpen] = useState(false);
  const [selectedTripForCompletion, setSelectedTripForCompletion] = useState<Trip | null>(null);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [selectedHubConfig, setSelectedHubConfig] = useState<typeof HUBS[0] | null>(null);
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with authenticated user
    if (authUser) {
      setCurrentUser(authUser);
    }
    setTrips(seedTrips);
    setBookings(seedBookings);
    setUsers(seedUsers);
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

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      BRONZE: "bg-amber-600",
      SILVER: "bg-slate-400",
      GOLD: "bg-yellow-500",
      PLATINUM: "bg-indigo-600",
    };
    return colors[tier] || "bg-slate-500";
  };

  // Handle confirm booking from BookingModal or booking requests
  const handleConfirmBooking = (
    bookingIdOrSeats: string | number,
    tripId?: string,
    seats?: number,
    totalFare?: number
  ) => {
    if (!currentUser) return;

    // Case 1: Called from BookingModal with just seats number
    if (typeof bookingIdOrSeats === "number" && selectedTrip) {
      const seatsCount = bookingIdOrSeats;
      const fare = selectedTrip.fare_aed * seatsCount;
      const rewardPoints = selectedTrip.current_passengers + seatsCount >= 3 ? 80 : 40;
      const driverCommission = fare * 0.8; // Driver gets 80% of fare

      const newBooking: Booking = {
        id: `booking_${Date.now()}`,
        trip_id: selectedTrip.id,
        passenger_id: currentUser.id,
        seats_booked: seatsCount,
        total_fare_aed: fare,
        status: "CONFIRMED",
        reward_points_earned: rewardPoints,
        created_at: new Date(),
      };

      const updatedUser = {
        ...currentUser,
        wallet_balance_aed: currentUser.wallet_balance_aed - fare,
        reward_points: currentUser.reward_points + rewardPoints,
      };

      const updatedTrip = {
        ...selectedTrip,
        available_seats: selectedTrip.available_seats - seatsCount,
        current_passengers: selectedTrip.current_passengers + seatsCount,
      };

      // Credit driver's wallet
      const updatedUsers = users.map((u) => {
        if (u.id === selectedTrip.driver_id) {
          return {
            ...u,
            wallet_balance_aed: u.wallet_balance_aed + driverCommission,
          };
        }
        return u;
      });

      // If current user is the driver, update their balance too
      if (currentUser.id === selectedTrip.driver_id) {
        const updatedDriver = {
          ...currentUser,
          wallet_balance_aed: currentUser.wallet_balance_aed + driverCommission,
        };
        setCurrentUser(updatedDriver);
      } else {
        setCurrentUser(updatedUser);
      }
      setUsers(updatedUsers);
      setTrips(trips.map((t) => (t.id === selectedTrip.id ? updatedTrip : t)));
      setBookings([...bookings, newBooking]);
      setLastBooking(newBooking);
      setIsBookingModalOpen(false);
      setShowBookingSuccess(true);
      return;
    }

    // Case 2: Called from booking requests with full parameters
    if (typeof bookingIdOrSeats === "string" && tripId && seats && totalFare) {
      const bookingId = bookingIdOrSeats;
      const driverCommission = totalFare * 0.8; // Driver gets 80% of fare

      const updatedUser = {
        ...currentUser,
        wallet_balance_aed: currentUser.wallet_balance_aed - totalFare,
        reward_points: currentUser.reward_points + (seats >= 3 ? 80 : 0),
      };

      const newBooking: Booking = {
        id: bookingId,
        trip_id: tripId,
        passenger_id: currentUser.id,
        seats_booked: seats,
        total_fare_aed: totalFare,
        status: "CONFIRMED",
        reward_points_earned: seats >= 3 ? 80 : 0,
        created_at: new Date(),
      };

      const trip = trips.find((t) => t.id === tripId);
      if (trip) {
        const updatedTrip = {
          ...trip,
          available_seats: trip.available_seats - seats,
        };
        setTrips(trips.map((t) => (t.id === tripId ? updatedTrip : t)));

        // Credit driver's wallet
        const updatedUsers = users.map((u) => {
          if (u.id === trip.driver_id) {
            return {
              ...u,
              wallet_balance_aed: u.wallet_balance_aed + driverCommission,
            };
          }
          return u;
        });

        // If current user is the driver, update their balance too
        if (currentUser.id === trip.driver_id) {
          const updatedDriver = {
            ...currentUser,
            wallet_balance_aed: currentUser.wallet_balance_aed + driverCommission,
          };
          setCurrentUser(updatedDriver);
        } else {
          setCurrentUser(updatedUser);
        }

        setUsers(updatedUsers);
      } else {
        setCurrentUser(updatedUser);
      }

      setBookings([...bookings, newBooking]);
      setBookingRequests(
        bookingRequests.map((br) =>
          br.id === bookingId ? { ...br, status: "confirmed" as const } : br
        )
      );

      toast({
        title: "Booking Confirmed",
        description: `Successfully booked ${seats} seat${seats > 1 ? "s" : ""}`,
      });
    }
  };

  // Handle passenger booking from AvailableTrips component
  const handlePassengerBookTrip = (tripId: string, seats: number) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || !currentUser) return;

    // Check wallet balance
    const totalFare = (trip.fare_aed || 0) * seats;
    if (currentUser.wallet_balance_aed < totalFare) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${totalFare} AED but only have ${currentUser.wallet_balance_aed} AED`,
        variant: "destructive",
      });
      return;
    }

    // Create booking request
    const bookingRequest: BookingRequest = {
      id: `req_${Date.now()}`,
      passengerName: currentUser.name,
      passengerId: currentUser.id,
      tripId: trip.id,
      tripOrigin: trip.origin,
      tripDestination: trip.destination,
      seats,
      farePerPassenger: trip.fare_aed || 0,
      totalCost: totalFare,
      status: "pending",
      requestedAt: new Date().toLocaleString(),
    };

    setBookingRequests((prev) => [...prev, bookingRequest]);
  };

  // Handle decline booking request
  const handleDeclineBooking = (bookingId: string) => {
    setBookingRequests(
      bookingRequests.map((br) =>
        br.id === bookingId ? { ...br, status: "rejected" as const } : br
      )
    );

    toast({
      title: "Booking Declined",
      description: "The booking request has been declined",
    });
  };

  // Handle trip completion
  const handleCompleteTrip = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || !currentUser) return;

    // Get passengers on this trip
    const tripBookings = bookings.filter((b) => b.trip_id === tripId);

    // Calculate settlements
    const updates = settleTripPayments({
      tripId,
      driverId: currentUser.id,
      passengers: tripBookings.map((b) => ({
        passengerId: b.passenger_id,
        seatsBooked: b.seats_booked,
        farePerPassenger: b.total_fare_aed / b.seats_booked,
        totalFare: b.total_fare_aed,
      })),
      carType: "SEDAN",
      distanceKm: 40,
      completedAt: new Date().toISOString(),
    });

    // Apply wallet updates
    let updatedUser = { ...currentUser };
    updates.forEach((update) => {
      if (update.userId === currentUser.id && update.type === "credit") {
        updatedUser.wallet_balance_aed += update.amountChange;
      }
    });

    // Apply carpool reward
    const carpoolReward = calculateCarpoolRewards(tripBookings.length);
    if (carpoolReward) {
      updatedUser.reward_points += carpoolReward.points;
    }

    // Update trip status
    const updatedTrip = {
      ...trip,
      status: "completed" as const,
    };

    setCurrentUser(updatedUser);
    setTrips(trips.map((t) => (t.id === tripId ? updatedTrip : t)));

    toast({
      title: "Trip Completed",
      description: `Earned ${updatedUser.wallet_balance_aed - currentUser.wallet_balance_aed} AED from ${tripBookings.length} passengers`,
    });
  };

  // Handle trip search
  const handleSearchTrips = (origin: string, destination: string) => {
    setSearchOrigin(origin);
    setSearchDestination(destination);
  };

  const handleClearSearch = () => {
    setSearchOrigin("");
    setSearchDestination("");
  };

  // Filter trips based on search criteria
  const filteredTrips = trips.filter((trip) => {
    const matchOrigin = searchOrigin
      ? trip.origin.toLowerCase().includes(searchOrigin.toLowerCase())
      : true;
    const matchDestination = searchDestination
      ? trip.destination.toLowerCase().includes(searchDestination.toLowerCase())
      : true;
    return matchOrigin && matchDestination;
  });

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

      {/* Trip Search */}
      <TripSearch
        onSearch={handleSearchTrips}
        onClear={handleClearSearch}
        hasActiveFilters={!!searchOrigin || !!searchDestination}
      />

      {/* Available Trips */}
      <Card>
        <CardHeader>
          <CardTitle>
            Available Trips
            {(searchOrigin || searchDestination) && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredTrips.length} found)
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {searchOrigin || searchDestination ? (
              <>
                Showing results for {searchOrigin && `from ${searchOrigin}`}
                {searchOrigin && searchDestination && " to "}
                {searchDestination && `to ${searchDestination}`}
              </>
            ) : (
              "Book your next carpool journey"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailableTrips
            trips={filteredTrips.map((trip) => ({
              id: trip.id,
              driver_name: "Driver",
              driver_rating: 4.8,
              origin: trip.origin,
              destination: trip.destination,
              date: new Date(trip.departure_time).toLocaleDateString(),
              departure_time: new Date(trip.departure_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              distance_km: 40,
              available_seats: trip.available_seats,
              booked_seats: 0,
              car_type: "SEDAN" as const,
              status: trip.available_seats > 0 ? ("active" as const) : ("full" as const),
            }))}
            userBalance={currentUser?.wallet_balance_aed || 0}
            onBookTrip={handlePassengerBookTrip}
          />
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
            <div className="text-2xl font-bold text-blue-500">
              {trips.filter((t) => t.status !== "completed").length}
            </div>
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
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsBookingRequestsModalOpen(true)}
            >
              View Requests ({bookingRequests.filter((b) => b.status === "pending").length})
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
          <CardDescription>Park & Ride locations - Pay with Reward Points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HUBS.map((hub) => (
              <Card key={hub.id} className="bg-muted/50 border">
                <CardContent className="pt-6 space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">{hub.name}</h4>
                    <p className="text-xs text-muted-foreground">{hub.location}</p>
                  </div>

                  {/* Parking Cost */}
                  <div className="bg-yellow-50 dark:bg-yellow-950/30 p-2 rounded flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <div className="text-xs">
                      <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                        {hub.parking_points_cost} points / {hub.parking_duration_hours}h
                      </p>
                      {hub.peak_hours && (
                        <p className="text-yellow-800 dark:text-yellow-200">
                          Peak: +{Math.round((hub.peak_hours.multiplier - 1) * 100)}%
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bonus Points */}
                  <div className="bg-green-50 dark:bg-green-950/30 p-2 rounded text-xs">
                    <p className="text-green-900 dark:text-green-100 font-medium">
                      🎁 +{hub.bonus_points_on_metro_usage} pts for metro/bus
                    </p>
                  </div>

                  {/* Availability */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Availability</span>
                      <span className="font-semibold text-foreground">
                        {hub.available}/{hub.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (hub.available / hub.capacity) * 100 > 50
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
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
                        name: hub.name,
                        location: hub.location,
                        capacity: hub.capacity,
                        current_vehicles: hub.capacity - hub.available,
                      });
                      setSelectedHubConfig(hub);
                      setIsParkingModalOpen(true);
                    }}
                    disabled={hub.available === 0 || !currentUser || currentUser.reward_points < hub.parking_points_cost}
                  >
                    {hub.available === 0
                      ? "Full"
                      : currentUser && currentUser.reward_points < hub.parking_points_cost
                      ? "Not Enough Points"
                      : "Book Parking"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const handleParkingBooking = (hubConfig?: typeof HUBS[0]) => {
    if (!selectedHub || !currentUser || !hubConfig) return;

    // Points are deducted during modal confirmation
    // Update user's reward points with bonus if using public transport
    const bonusPoints = 50; // This would come from the modal state
    const updatedUser = {
      ...currentUser,
      reward_points: Math.max(0, currentUser.reward_points - hubConfig.parking_points_cost + bonusPoints),
    };

    setCurrentUser(updatedUser);
    setIsParkingModalOpen(false);
    setSelectedHubConfig(null);

    toast({
      title: "Parking Booked Successfully!",
      description: `${hubConfig.parking_points_cost} reward points deducted. New balance: ${updatedUser.reward_points} points.`,
    });
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
          setSelectedHubConfig(null);
        }}
        hubConfig={selectedHubConfig || undefined}
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
        bookingRequests={bookingRequests.filter((br) => {
          const trip = trips.find((t) => t.id === br.tripId);
          return trip && trip.driver_id === currentUser?.id;
        })}
        onConfirmBooking={(bookingId) => {
          const req = bookingRequests.find((r) => r.id === bookingId);
          if (req) {
            handleConfirmBooking(
              bookingId,
              req.tripId,
              req.seats,
              req.totalCost
            );
          }
        }}
        onDeclineBooking={handleDeclineBooking}
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

      <TripCompletionModal
        open={isTripCompletionModalOpen}
        onOpenChange={setIsTripCompletionModalOpen}
        trip={
          selectedTripForCompletion
            ? {
                id: selectedTripForCompletion.id,
                origin: selectedTripForCompletion.origin,
                destination: selectedTripForCompletion.destination,
                carType: "SEDAN",
                passengers: bookings
                  .filter((b) => b.trip_id === selectedTripForCompletion.id)
                  .map((b) => ({
                    passengerId: b.passenger_id,
                    passengerName: "Passenger",
                    seatsBooked: b.seats_booked,
                    farePerPassenger: b.total_fare_aed / b.seats_booked,
                    totalFare: b.total_fare_aed,
                  })),
                driverEarnings: bookings
                  .filter((b) => b.trip_id === selectedTripForCompletion.id)
                  .reduce((sum, b) => sum + b.total_fare_aed, 0),
                rewardPoints: bookings.filter((b) => b.trip_id === selectedTripForCompletion.id)
                  .length >= 3
                  ? 80
                  : 0,
              }
            : undefined
        }
        onCompleteTrip={handleCompleteTrip}
      />
    </div>
  );
}
