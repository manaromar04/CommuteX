import { User, Trip, Booking, Reward } from "./types";

// Seed Users
export const seedUsers: User[] = [
  {
    id: "user_2",
    name: "Huda",
    role: "PASSENGER",
    email: "huda@email.com",
    phone: "+971502345678",
    wallet_balance_aed: 180, // 250 - 50 (booking_1) - 20 (booking_2) = 180
    tier: "SILVER",
    reward_points: 240, // 120 + 80 (booking_1) + 40 (booking_2) = 240
    created_at: new Date("2024-01-05"),
  },
  {
    id: "user_3",
    name: "Manar",
    role: "DRIVER",
    email: "manar@email.com",
    phone: "+971504567890",
    wallet_balance_aed: 856, // 800 + 40 (50*0.8 from booking_1) + 16 (20*0.8 from booking_2) = 856
    tier: "GOLD",
    reward_points: 320,
    created_at: new Date("2023-12-15"),
  },
];

// Seed Trips
export const seedTrips: Trip[] = [
  {
    id: "trip_1",
    driver_id: "user_3",
    origin: "Sharjah Central Bus Station",
    destination: "Dubai Mall",
    departure_time: new Date("2024-01-20T07:00:00"),
    fare_aed: 15.75,
    car_type: "SEDAN",
    distance_km: 40,
    available_seats: 4,
    current_passengers: 2,
    status: "SCHEDULED",
    created_at: new Date("2024-01-15"),
  },
  {
    id: "trip_2",
    driver_id: "user_3",
    origin: "Sharjah University",
    destination: "Dubai Downtown",
    departure_time: new Date("2024-01-20T08:30:00"),
    fare_aed: 13.5,
    car_type: "SEDAN",
    distance_km: 30,
    available_seats: 3,
    current_passengers: 1,
    status: "SCHEDULED",
    created_at: new Date("2024-01-15"),
  },
  {
    id: "trip_3",
    driver_id: "user_3",
    origin: "Al Wahda Mall, Sharjah",
    destination: "BurJuman, Dubai",
    departure_time: new Date("2024-01-20T17:00:00"),
    fare_aed: 18,
    car_type: "SEDAN",
    distance_km: 50,
    available_seats: 5,
    current_passengers: 0,
    status: "SCHEDULED",
    created_at: new Date("2024-01-15"),
  },
];

// Seed Bookings
export const seedBookings: Booking[] = [
  {
    id: "booking_1",
    trip_id: "trip_1",
    passenger_id: "user_2",
    seats_booked: 2,
    total_fare_aed: 31.5,
    status: "CONFIRMED",
    reward_points_earned: 80,
    created_at: new Date("2024-01-15"),
  },
  {
    id: "booking_2",
    trip_id: "trip_2",
    passenger_id: "user_2",
    seats_booked: 1,
    total_fare_aed: 13.5,
    status: "CONFIRMED",
    reward_points_earned: 40,
    created_at: new Date("2024-01-16"),
  },
];

// Seed Rewards
export const seedRewards: Reward[] = [
  {
    id: "reward_1",
    user_id: "user_2",
    type: "PARK_AND_RIDE",
    points: 40,
    description: "Park & Ride booking - Dubai Mall",
    created_at: new Date("2024-01-10"),
  },
  {
    id: "reward_2",
    user_id: "user_3",
    type: "CARPOOL",
    points: 80,
    description: "Carpool trip with 3+ passengers",
    created_at: new Date("2024-01-14"),
  },
];

// Seed Booking Requests for demo
export const seedBookingRequests = [
  {
    id: "req_1704067200000",
    passengerName: "Huda",
    passengerId: "user_2",
    tripId: "trip_1",
    tripOrigin: "Sharjah Central Bus Station",
    tripDestination: "Dubai Mall",
    seats: 2,
    farePerPassenger: 25,
    totalCost: 50,
    status: "pending" as const,
    requestedAt: new Date().toLocaleString(),
  },
  {
    id: "req_1704067500000",
    passengerName: "Huda",
    passengerId: "user_2",
    tripId: "trip_2",
    tripOrigin: "Sharjah University",
    tripDestination: "Dubai Downtown",
    seats: 1,
    farePerPassenger: 20,
    totalCost: 20,
    status: "pending" as const,
    requestedAt: new Date().toLocaleString(),
  },
];
