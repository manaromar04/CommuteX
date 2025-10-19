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
 * Calculate total earnings for a driver after a trip completion
 */
export function calculateDriverEarnings(tripCompletion: TripCompletion): number {
  return tripCompletion.passengers.reduce(
    (sum, passenger) => sum + passenger.totalFare,
    0
  );
}

/**
 * Settle payments for a completed trip
 * Deducts fare from passengers and adds to driver earnings
 */
export function settleTripPayments(tripCompletion: TripCompletion) {
  const walletUpdates: Array<{
    userId: string;
    amountChange: number;
    type: "deduction" | "credit";
    reason: string;
  }> = [];

  // Add driver earnings
  const driverEarnings = calculateDriverEarnings(tripCompletion);
  walletUpdates.push({
    userId: tripCompletion.driverId,
    amountChange: driverEarnings,
    type: "credit",
    reason: `Trip earnings from ${tripCompletion.passengers.length} passengers`,
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
