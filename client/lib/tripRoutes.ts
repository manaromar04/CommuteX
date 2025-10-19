/**
 * Predefined trip routes between major UAE cities
 * Used for easy trip creation and filtering
 */

export interface TripRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance_km: number;
  estimated_time_minutes: number;
  popular: boolean;
}

export const TRIP_ROUTES: TripRoute[] = [
  // Sharjah to Dubai
  {
    id: "route_001",
    name: "Sharjah to Dubai",
    origin: "Sharjah City Centre",
    destination: "Dubai Downtown",
    distance_km: 25,
    estimated_time_minutes: 35,
    popular: true,
  },
  {
    id: "route_002",
    name: "Sharjah to Dubai Mall",
    origin: "Sharjah City Centre",
    destination: "Dubai Mall",
    distance_km: 30,
    estimated_time_minutes: 40,
    popular: true,
  },
  {
    id: "route_003",
    name: "Sharjah to Dubai Airport",
    origin: "Sharjah City Centre",
    destination: "Dubai International Airport",
    distance_km: 45,
    estimated_time_minutes: 60,
    popular: true,
  },

  // Ajman to Dubai
  {
    id: "route_004",
    name: "Ajman to Dubai",
    origin: "Ajman City Centre",
    destination: "Dubai Downtown",
    distance_km: 35,
    estimated_time_minutes: 50,
    popular: true,
  },
  {
    id: "route_005",
    name: "Ajman to Dubai Airport",
    origin: "Ajman City Centre",
    destination: "Dubai International Airport",
    distance_km: 55,
    estimated_time_minutes: 70,
    popular: false,
  },

  // Dubai to Abu Dhabi
  {
    id: "route_006",
    name: "Dubai to Abu Dhabi",
    origin: "Dubai Downtown",
    destination: "Abu Dhabi City Centre",
    distance_km: 150,
    estimated_time_minutes: 120,
    popular: true,
  },
  {
    id: "route_007",
    name: "Dubai to Abu Dhabi Airport",
    origin: "Dubai Downtown",
    destination: "Abu Dhabi International Airport",
    distance_km: 140,
    estimated_time_minutes: 110,
    popular: false,
  },

  // Sharjah to Abu Dhabi
  {
    id: "route_008",
    name: "Sharjah to Abu Dhabi",
    origin: "Sharjah City Centre",
    destination: "Abu Dhabi City Centre",
    distance_km: 170,
    estimated_time_minutes: 140,
    popular: false,
  },

  // Within Dubai
  {
    id: "route_009",
    name: "Dubai Downtown to Marina",
    origin: "Dubai Downtown",
    destination: "Dubai Marina",
    distance_km: 15,
    estimated_time_minutes: 25,
    popular: true,
  },
  {
    id: "route_010",
    name: "Dubai Downtown to JBR",
    origin: "Dubai Downtown",
    destination: "Jumeirah Beach Residence",
    distance_km: 20,
    estimated_time_minutes: 30,
    popular: true,
  },
  {
    id: "route_011",
    name: "Dubai Downtown to Business Bay",
    origin: "Dubai Downtown",
    destination: "Business Bay",
    distance_km: 8,
    estimated_time_minutes: 15,
    popular: true,
  },

  // Within Abu Dhabi
  {
    id: "route_012",
    name: "Abu Dhabi City Centre to Marina",
    origin: "Abu Dhabi City Centre",
    destination: "Yas Island Marina",
    distance_km: 20,
    estimated_time_minutes: 30,
    popular: false,
  },

  // Miscellaneous
  {
    id: "route_013",
    name: "Ras Al Khaimah to Dubai",
    origin: "Ras Al Khaimah City",
    destination: "Dubai Downtown",
    distance_km: 90,
    estimated_time_minutes: 90,
    popular: false,
  },
  {
    id: "route_014",
    name: "Fujairah to Dubai",
    origin: "Fujairah City",
    destination: "Dubai Downtown",
    distance_km: 130,
    estimated_time_minutes: 120,
    popular: false,
  },
  {
    id: "route_015",
    name: "Umm Al Quwain to Dubai",
    origin: "Umm Al Quwain City",
    destination: "Dubai Downtown",
    distance_km: 60,
    estimated_time_minutes: 75,
    popular: false,
  },
];

/**
 * Get popular routes
 */
export function getPopularRoutes(): TripRoute[] {
  return TRIP_ROUTES.filter((route) => route.popular);
}

/**
 * Get routes by origin
 */
export function getRoutesByOrigin(origin: string): TripRoute[] {
  return TRIP_ROUTES.filter((route) =>
    route.origin.toLowerCase().includes(origin.toLowerCase())
  );
}

/**
 * Get routes by destination
 */
export function getRoutesByDestination(destination: string): TripRoute[] {
  return TRIP_ROUTES.filter((route) =>
    route.destination.toLowerCase().includes(destination.toLowerCase())
  );
}

/**
 * Search routes by origin or destination
 */
export function searchRoutes(query: string): TripRoute[] {
  const lowerQuery = query.toLowerCase();
  return TRIP_ROUTES.filter(
    (route) =>
      route.origin.toLowerCase().includes(lowerQuery) ||
      route.destination.toLowerCase().includes(lowerQuery) ||
      route.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get route by ID
 */
export function getRouteById(routeId: string): TripRoute | undefined {
  return TRIP_ROUTES.find((route) => route.id === routeId);
}

/**
 * Get unique origins
 */
export function getUniqueOrigins(): string[] {
  return Array.from(new Set(TRIP_ROUTES.map((route) => route.origin)));
}

/**
 * Get unique destinations
 */
export function getUniqueDestinations(): string[] {
  return Array.from(new Set(TRIP_ROUTES.map((route) => route.destination)));
}
