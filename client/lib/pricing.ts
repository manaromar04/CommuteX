export type CarType = "SEDAN" | "SUV" | "MINIVAN";

export interface CarTypeConfig {
  name: string;
  baseFare: number;
  farePerKm: number;
}

export const CAR_TYPES: Record<CarType, CarTypeConfig> = {
  SEDAN: {
    name: "Sedan",
    baseFare: 10,
    farePerKm: 1.5,
  },
  SUV: {
    name: "SUV",
    baseFare: 15,
    farePerKm: 2,
  },
  MINIVAN: {
    name: "Minivan",
    baseFare: 20,
    farePerKm: 2.5,
  },
};

export const CARPOOL_DISCOUNT = 0.1; // 10% discount

/**
 * Calculate total trip fare based on car type and distance
 */
export function calculateTotalFare(
  carType: CarType,
  distanceKm: number
): number {
  const config = CAR_TYPES[carType];
  return config.baseFare + config.farePerKm * distanceKm;
}

/**
 * Calculate fare per passenger (before discount)
 */
export function calculateFarePerPassenger(
  totalFare: number,
  passengerCount: number
): number {
  return totalFare / passengerCount;
}

/**
 * Apply carpool discount to fare
 */
export function applyDiscountToFare(
  fare: number,
  discountPercentage: number = CARPOOL_DISCOUNT
): number {
  return fare * (1 - discountPercentage);
}

/**
 * Complete fare calculation with all steps
 */
export function calculateCompleteFare(
  carType: CarType,
  distanceKm: number,
  passengerCount: number,
  applyDiscount: boolean = true
) {
  const totalFare = calculateTotalFare(carType, distanceKm);
  const farePerPassenger = calculateFarePerPassenger(totalFare, passengerCount);
  const discountedFare = applyDiscount
    ? applyDiscountToFare(farePerPassenger)
    : farePerPassenger;

  return {
    totalFare: Math.round(totalFare * 100) / 100,
    farePerPassenger: Math.round(farePerPassenger * 100) / 100,
    discount: applyDiscount ? CARPOOL_DISCOUNT * 100 : 0,
    discountedFare: Math.round(discountedFare * 100) / 100,
  };
}
