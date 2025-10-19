/**
 * Rewards system for CommuteX
 * - Carpool bonus: 80 points for trips with 3+ passengers
 * - Park & Ride bonus: 40 points per booking
 */

export interface RewardAward {
  type: "CARPOOL" | "PARK_AND_RIDE" | "BASE";
  points: number;
  description: string;
}

const CARPOOL_MIN_PASSENGERS = 3;
const CARPOOL_BONUS_POINTS = 80;
const PARK_AND_RIDE_BONUS_POINTS = 40;

/**
 * Calculate rewards for a completed carpool trip
 */
export function calculateCarpoolRewards(
  passengerCount: number
): RewardAward | null {
  if (passengerCount >= CARPOOL_MIN_PASSENGERS) {
    return {
      type: "CARPOOL",
      points: CARPOOL_BONUS_POINTS,
      description: `Carpool bonus for ${passengerCount} passengers`,
    };
  }
  return null;
}

/**
 * Calculate rewards for Park & Ride booking
 */
export function calculateParkAndRideRewards(): RewardAward {
  return {
    type: "PARK_AND_RIDE",
    points: PARK_AND_RIDE_BONUS_POINTS,
    description: "Park & Ride parking bonus",
  };
}

/**
 * Calculate total reward points from multiple awards
 */
export function getTotalRewardPoints(awards: (RewardAward | null)[]): number {
  return awards
    .filter((award) => award !== null)
    .reduce((sum, award) => sum + award!.points, 0);
}

/**
 * Get user tier based on reward points
 */
export function getUserTier(
  rewardPoints: number
): "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" {
  if (rewardPoints >= 1000) return "PLATINUM";
  if (rewardPoints >= 500) return "GOLD";
  if (rewardPoints >= 200) return "SILVER";
  return "BRONZE";
}

/**
 * Get tier color for UI
 */
export function getTierColor(
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
): string {
  const colors: Record<string, string> = {
    BRONZE: "bg-amber-600",
    SILVER: "bg-slate-400",
    GOLD: "bg-yellow-500",
    PLATINUM: "bg-indigo-600",
  };
  return colors[tier] || "bg-slate-500";
}
