import { User, Trip, Booking, Reward } from "./types";

// Seed Users
export const seedUsers: User[] = [
  {
    id: "user_2",
    name: "Huda",
    role: "PASSENGER",
    email: "huda@email.com",
    phone: "+971502345678",
    wallet_balance_aed: 250,
    tier: "SILVER",
    reward_points: 120,
    created_at: new Date("2024-01-05"),
  },
  {
    id: "user_3",
    name: "Manar",
    role: "DRIVER",
    email: "manar@email.com",
    phone: "+971504567890",
    wallet_balance_aed: 800,
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
    fare_aed: 25,
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
    fare_aed: 20,
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
    fare_aed: 30,
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
    seats_booked: 1,
    total_fare_aed: 25,
    status: "CONFIRMED",
    reward_points_earned: 40,
    created_at: new Date("2024-01-15"),
  },
  {
    id: "booking_2",
    trip_id: "trip_2",
    passenger_id: "user_2",
    seats_booked: 1,
    total_fare_aed: 20,
    status: "PENDING",
    reward_points_earned: 0,
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
