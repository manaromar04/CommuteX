// User roles
export type UserRole = "PASSENGER" | "DRIVER" | "ADMIN";

// Reward tiers
export type RewardTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

// User type
export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  wallet_balance_aed: number;
  tier: RewardTier;
  reward_points: number;
  created_at: Date;
}

// Trip type
export interface Trip {
  id: string;
  driver_id: string;
  origin: string;
  destination: string;
  departure_time: Date;
  fare_aed: number;
  car_type?: "SEDAN" | "SUV" | "MINIVAN";
  distance_km?: number;
  available_seats: number;
  current_passengers: number;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  created_at: Date;
}

// Booking type
export interface Booking {
  id: string;
  trip_id: string;
  passenger_id: string;
  seats_booked: number;
  total_fare_aed: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  reward_points_earned: number;
  created_at: Date;
}

// Reward type
export interface Reward {
  id: string;
  user_id: string;
  type: "CARPOOL" | "PARK_AND_RIDE" | "BONUS" | "REFERRAL";
  points: number;
  description: string;
  created_at: Date;
}

// Reward catalog item
export interface RewardCatalogItem {
  id: string;
  title: string;
  description: string;
  points_required: number;
  category: string;
  image_url?: string;
}

// Smart Hub
export interface SmartHub {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  current_vehicles: number;
  amenities: string[];
  created_at: Date;
}
