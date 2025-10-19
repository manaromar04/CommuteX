export interface Hub {
  id: string;
  name: string;
  location: string;
  capacity: number;
  available: number;
  parking_points_cost: number;
  parking_duration_hours: number;
  bonus_points_on_metro_usage: number;
  peak_hours: {
    start: number;
    end: number;
    multiplier: number; // Points multiplier during peak hours
  };
  tags: string[];
}

export const HUBS: Hub[] = [
  {
    id: "hub_001",
    name: "Etisalat Metro Hub",
    location: "Al Rigga, Dubai",
    capacity: 300,
    available: 120,
    parking_points_cost: 200,
    parking_duration_hours: 2,
    bonus_points_on_metro_usage: 50,
    peak_hours: {
      start: 7,
      end: 10,
      multiplier: 1.2,
    },
    tags: ["metro", "popular", "central"],
  },
  {
    id: "hub_002",
    name: "Centrepoint Metro Hub",
    location: "Deira, Dubai",
    capacity: 250,
    available: 340,
    parking_points_cost: 150,
    parking_duration_hours: 2,
    bonus_points_on_metro_usage: 40,
    peak_hours: {
      start: 8,
      end: 11,
      multiplier: 1.15,
    },
    tags: ["metro", "affordable"],
  },
  {
    id: "hub_003",
    name: "Jebel Ali Metro Hub",
    location: "Jebel Ali, Dubai",
    capacity: 400,
    available: 450,
    parking_points_cost: 250,
    parking_duration_hours: 2,
    bonus_points_on_metro_usage: 60,
    peak_hours: {
      start: 6,
      end: 9,
      multiplier: 1.25,
    },
    tags: ["metro", "spacious", "premium"],
  },
  {
    id: "hub_004",
    name: "Life Pharmacy Park & Ride",
    location: "Sharjah City Centre",
    capacity: 200,
    available: 200,
    parking_points_cost: 100,
    parking_duration_hours: 2,
    bonus_points_on_metro_usage: 30,
    peak_hours: {
      start: 7,
      end: 10,
      multiplier: 1.1,
    },
    tags: ["park&ride", "budget", "sharjah"],
  },
  {
    id: "hub_005",
    name: "Sharjah Central Hub",
    location: "Sharjah City Centre",
    capacity: 500,
    available: 120,
    parking_points_cost: 120,
    parking_duration_hours: 2,
    bonus_points_on_metro_usage: 45,
    peak_hours: {
      start: 7,
      end: 9,
      multiplier: 1.2,
    },
    tags: ["metro", "large", "sharjah"],
  },
  {
    id: "hub_006",
    name: "Dubai Downtown Hub",
    location: "BurJuman Complex",
    capacity: 800,
    available: 340,
    parking_points_cost: 180,
    parking_duration_hours: 2,
    bonus_points_on_metro_usage: 55,
    peak_hours: {
      start: 8,
      end: 11,
      multiplier: 1.3,
    },
    tags: ["metro", "central", "premium"],
  },
  {
    id: "hub_007",
    name: "Dubai Airport Hub",
    location: "Terminal 3 Parking",
    capacity: 1000,
    available: 450,
    parking_points_cost: 300,
    parking_duration_hours: 4,
    bonus_points_on_metro_usage: 75,
    peak_hours: {
      start: 6,
      end: 9,
      multiplier: 1.4,
    },
    tags: ["airport", "premium", "spacious"],
  },
  {
    id: "hub_008",
    name: "Abu Dhabi Main Hub",
    location: "Zayed City Centre",
    capacity: 600,
    available: 200,
    parking_points_cost: 220,
    parking_duration_hours: 2,
    bonus_points_on_metro_usage: 50,
    peak_hours: {
      start: 7,
      end: 10,
      multiplier: 1.15,
    },
    tags: ["metro", "abudhabi", "large"],
  },
];

/**
 * Get hub by ID
 */
export function getHubById(hubId: string): Hub | undefined {
  return HUBS.find((h) => h.id === hubId);
}

/**
 * Calculate parking cost based on time of day (peak hour multiplier)
 */
export function calculateParkingCost(hub: Hub, currentHour: number): number {
  const baseCost = hub.parking_points_cost;
  const isPeakHour = currentHour >= hub.peak_hours.start && currentHour < hub.peak_hours.end;
  
  if (isPeakHour) {
    return Math.ceil(baseCost * hub.peak_hours.multiplier);
  }
  
  return baseCost;
}

/**
 * Apply frequency discount (every 5 parkings gets 10% discount)
 */
export function applyFrequencyDiscount(
  parkingCost: number,
  parkingCount: number
): number {
  const discountTier = Math.floor(parkingCount / 5);
  if (discountTier === 0) return parkingCost;
  
  const discountPercentage = Math.min(discountTier * 0.1, 0.3); // Max 30% discount
  return Math.ceil(parkingCost * (1 - discountPercentage));
}

/**
 * Get all hubs sorted by availability
 */
export function getAvailableHubs(): Hub[] {
  return HUBS.filter((h) => h.available > 0).sort((a, b) => b.available - a.available);
}

/**
 * Filter hubs by tags
 */
export function filterHubsByTags(tags: string[]): Hub[] {
  return HUBS.filter((hub) => tags.some((tag) => hub.tags.includes(tag)));
}
