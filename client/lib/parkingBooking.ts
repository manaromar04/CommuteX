import { Hub, calculateParkingCost, applyFrequencyDiscount } from "./hubs";

export interface ParkingBooking {
  id: string;
  userId: string;
  hubId: string;
  startTime: Date;
  endTime: Date;
  pointsCost: number;
  discountApplied: number;
  finalPointsCost: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
}

export interface ParkingTransaction {
  id: string;
  userId: string;
  bookingId: string;
  pointsDeducted: number;
  previousBalance: number;
  newBalance: number;
  type: "PARKING_DEDUCTION" | "PARK_AND_RIDE_BONUS" | "FREQUENCY_DISCOUNT";
  description: string;
  timestamp: Date;
}

/**
 * Validate if user has enough points for parking
 */
export function validateParkingPoints(
  userPoints: number,
  pointsCost: number
): {
  isValid: boolean;
  message: string;
} {
  if (userPoints >= pointsCost) {
    return {
      isValid: true,
      message: `You have enough points (${userPoints} points available)`,
    };
  }

  const shortfall = pointsCost - userPoints;
  return {
    isValid: false,
    message: `You do not have enough points for parking. You need ${shortfall} more points. (Required: ${pointsCost}, Available: ${userPoints})`,
  };
}

/**
 * Create a parking booking
 */
export function createParkingBooking(
  userId: string,
  hub: Hub,
  parkingCount: number = 0
): {
  booking: ParkingBooking;
  pointsCost: number;
  discountApplied: number;
  finalCost: number;
} {
  const currentHour = new Date().getHours();
  const baseCost = calculateParkingCost(hub, currentHour);
  const discountedCost = applyFrequencyDiscount(baseCost, parkingCount);
  const discountAmount = baseCost - discountedCost;

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + hub.parking_duration_hours * 60 * 60 * 1000);

  const booking: ParkingBooking = {
    id: `parking_${Date.now()}`,
    userId,
    hubId: hub.id,
    startTime,
    endTime,
    pointsCost: baseCost,
    discountApplied: discountAmount,
    finalPointsCost: discountedCost,
    status: "ACTIVE",
    createdAt: new Date(),
  };

  return {
    booking,
    pointsCost: baseCost,
    discountApplied: discountAmount,
    finalCost: discountedCost,
  };
}

/**
 * Process parking points deduction
 */
export function processParkingDeduction(
  userPoints: number,
  booking: ParkingBooking
): {
  success: boolean;
  transaction?: ParkingTransaction;
  message: string;
  newBalance?: number;
} {
  const validation = validateParkingPoints(userPoints, booking.finalPointsCost);

  if (!validation.isValid) {
    return {
      success: false,
      message: validation.message,
    };
  }

  const newBalance = userPoints - booking.finalPointsCost;
  const transaction: ParkingTransaction = {
    id: `txn_${Date.now()}`,
    userId: booking.userId,
    bookingId: booking.id,
    pointsDeducted: booking.finalPointsCost,
    previousBalance: userPoints,
    newBalance,
    type: "PARKING_DEDUCTION",
    description: `Parking reservation at hub ${booking.hubId}`,
    timestamp: new Date(),
  };

  return {
    success: true,
    transaction,
    message: `${booking.finalPointsCost} points have been deducted from your account.`,
    newBalance,
  };
}

/**
 * Apply Park & Ride bonus points when user uses public transport
 */
export function applyParkAndRideBonus(
  userPoints: number,
  hub: Hub,
  usedPublicTransport: boolean = true
): {
  bonusPoints: number;
  newBalance: number;
  transaction?: ParkingTransaction;
  message: string;
} {
  if (!usedPublicTransport) {
    return {
      bonusPoints: 0,
      newBalance: userPoints,
      message: "No bonus points for this parking session",
    };
  }

  const bonusPoints = hub.bonus_points_on_metro_usage;
  const newBalance = userPoints + bonusPoints;

  const transaction: ParkingTransaction = {
    id: `txn_${Date.now()}`,
    userId: "",
    bookingId: "",
    pointsDeducted: -bonusPoints, // Negative means points added
    previousBalance: userPoints,
    newBalance,
    type: "PARK_AND_RIDE_BONUS",
    description: `Bonus points for using public transport from ${hub.name}`,
    timestamp: new Date(),
  };

  return {
    bonusPoints,
    newBalance,
    transaction,
    message: `🎉 Congratulations! You earned ${bonusPoints} bonus points for using public transport!`,
  };
}

/**
 * Calculate and apply frequency discount
 */
export function applyFrequencyBonusPoints(
  userPoints: number,
  parkingCount: number
): {
  discountPoints: number;
  newBalance: number;
  message: string;
} {
  const discountTier = Math.floor(parkingCount / 5);

  if (discountTier === 0) {
    return {
      discountPoints: 0,
      newBalance: userPoints,
      message: `You have completed ${parkingCount} parkings. Book ${5 - parkingCount} more to get a discount!`,
    };
  }

  const discountPoints = discountTier * 50; // 50 bonus points per tier
  const newBalance = userPoints + discountPoints;

  return {
    discountPoints,
    newBalance,
    message: `🎁 Loyalty Reward! You earned ${discountPoints} bonus points for being a frequent Park & Ride user!`,
  };
}

/**
 * Get parking confirmation details
 */
export function getParkingConfirmation(
  hubName: string,
  booking: ParkingBooking,
  finalBalance: number
): string {
  const startTimeStr = booking.startTime.toLocaleString();
  const endTimeStr = booking.endTime.toLocaleString();

  return `You have successfully reserved parking at ${hubName} for ${booking.startTime.toLocaleDateString()}.

Parking Details:
• Start Time: ${startTimeStr}
• End Time: ${endTimeStr}
• Duration: ${booking.id}
• Points Deducted: ${booking.finalPointsCost}
${booking.discountApplied > 0 ? `• Discount Applied: -${booking.discountApplied} points\n` : ""}
• Remaining Balance: ${finalBalance} points

Please make sure to pick up your car before the parking end time.`;
}
