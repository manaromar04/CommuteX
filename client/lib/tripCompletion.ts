import { calculateCompleteFare, type CarType } from "./pricing";
import { calculateCarpoolRewards, type RewardAward } from "./rewards";

export interface TripCompletion {
  tripId: string;
  driverId: string;
  passengers: Array<{
    passengerId: string;
    seatsBooked: number;
    farePerPassenger: number;
    totalFare: number;
  }>;
  carType: CarType;
  distanceKm: number;
  completedAt: string;
}

export interface WalletSettlement {
  tripId: string;
  driverId: string;
  totalEarnings: number;
  passengersCount: number;
  breakdown: Array<{
    passengerId: string;
    deduction: number;
    timestamp: string;
  }>;
}

/**
 * Commission split constants
 * Driver receives 65%, RTA receives 35% of each fare
 */
const DRIVER_COMMISSION_RATE = 0.65;
const RTA_COMMISSION_RATE = 0.35;

/**
 * Calculate total fare collected from passengers
 */
export function calculateTotalFare(tripCompletion: TripCompletion): number {
  return tripCompletion.passengers.reduce(
    (sum, passenger) => sum + passenger.totalFare,
    0
  );
}

/**
 * Calculate total earnings for a driver after a trip completion (65% of total fare)
 */
export function calculateDriverEarnings(tripCompletion: TripCompletion): number {
  const totalFare = calculateTotalFare(tripCompletion);
  return totalFare * DRIVER_COMMISSION_RATE;
}

/**
 * Calculate earnings for RTA after a trip completion (35% of total fare)
 */
export function calculateRTAEarnings(tripCompletion: TripCompletion): number {
  const totalFare = calculateTotalFare(tripCompletion);
  return totalFare * RTA_COMMISSION_RATE;
}

/**
 * Settle payments for a completed trip
 * Deducts fare from passengers, splits earnings: 65% to driver, 35% to RTA
 */
export function settleTripPayments(tripCompletion: TripCompletion) {
  const walletUpdates: Array<{
    userId: string;
    amountChange: number;
    type: "deduction" | "credit";
    reason: string;
  }> = [];

  // Calculate split earnings
  const totalFare = calculateTotalFare(tripCompletion);
  const driverEarnings = calculateDriverEarnings(tripCompletion);
  const rtaEarnings = calculateRTAEarnings(tripCompletion);

  // Add driver earnings (65% of total fare)
  walletUpdates.push({
    userId: tripCompletion.driverId,
    amountChange: driverEarnings,
    type: "credit",
    reason: `Trip earnings from ${tripCompletion.passengers.length} passengers (65% of ${totalFare.toFixed(2)} AED)`,
  });

  // Deduct from passengers
  tripCompletion.passengers.forEach((passenger) => {
    walletUpdates.push({
      userId: passenger.passengerId,
      amountChange: passenger.totalFare,
      type: "deduction",
      reason: "Trip fare payment",
    });
  });

  return walletUpdates;
}

/**
 * Calculate rewards for a completed trip
 */
export function calculateTripRewards(
  tripCompletion: TripCompletion
): Map<string, RewardAward[]> {
  const rewards = new Map<string, RewardAward[]>();

  // Driver rewards for carpool
  const driverReward = calculateCarpoolRewards(tripCompletion.passengers.length);
  if (driverReward) {
    rewards.set(tripCompletion.driverId, [driverReward]);
  }

  // Passenger rewards for participating in carpool
  if (tripCompletion.passengers.length >= 3) {
    tripCompletion.passengers.forEach((passenger) => {
      const passengerRewards = rewards.get(passenger.passengerId) || [];
      passengerRewards.push({
        type: "CARPOOL",
        points: 80,
        description: "Carpool bonus",
      });
      rewards.set(passenger.passengerId, passengerRewards);
    });
  }

  return rewards;
}

/**
 * Get settlement summary for a trip
 */
export function getTripSettlementSummary(tripCompletion: TripCompletion) {
  const driverEarnings = calculateDriverEarnings(tripCompletion);
  const totalPassengers = tripCompletion.passengers.length;
  const rewards = calculateTripRewards(tripCompletion);

  return {
    tripId: tripCompletion.tripId,
    driverEarnings,
    totalPassengers,
    passengerDeductions: tripCompletion.passengers.map((p) => ({
      passengerId: p.passengerId,
      amount: p.totalFare,
    })),
    rewards: Array.from(rewards.entries()).map(([userId, awards]) => ({
      userId,
      points: awards.reduce((sum, a) => sum + a.points, 0),
      awards,
    })),
    completedAt: tripCompletion.completedAt,
  };
}
