import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Clock, Users, DollarSign, Search, X } from "lucide-react";
import { TRIP_ROUTES, getUniqueOrigins, getUniqueDestinations } from "@/lib/tripRoutes";

export interface TripFilter {
  origin?: string;
  destination?: string;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
  minSeats?: number;
  sortBy?: "price" | "time" | "rating" | "availability";
}

interface TripSearchFilterProps {
  onFilterChange?: (filters: TripFilter) => void;
  onSearch?: (query: string) => void;
}

export function TripSearchFilter({ onFilterChange, onSearch }: TripSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TripFilter>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const origins = getUniqueOrigins();
  const destinations = getUniqueDestinations();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFilterChange = (newFilters: TripFilter) => {
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleOriginChange = (origin: string) => {
    handleFilterChange({ ...filters, origin: origin || undefined });
  };

  const handleDestinationChange = (destination: string) => {
    handleFilterChange({ ...filters, destination: destination || undefined });
  };

  const handleDateChange = (date: string) => {
    handleFilterChange({ ...filters, date: date || undefined });
  };

  const handleSortChange = (sortBy: string) => {
    handleFilterChange({
      ...filters,
      sortBy: sortBy as "price" | "time" | "rating" | "availability",
    });
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const hasActiveFilters =
    Object.values(filters).some((v) => v !== undefined && v !== null) ||
    searchQuery !== "";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search routes, cities, or trip details..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Origin */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">From</Label>
              <Select value={filters.origin || ""} onValueChange={handleOriginChange}>
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue placeholder="Select origin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Origins</SelectItem>
                  {origins.map((origin) => (
                    <SelectItem key={origin} value={origin}>
                      {origin}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">To</Label>
              <Select
                value={filters.destination || ""}
                onValueChange={handleDestinationChange}
              >
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Destinations</SelectItem>
                  {destinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Date</Label>
              <Input
                type="date"
                value={filters.date || ""}
                onChange={(e) => handleDateChange(e.target.value)}
                className="h-9 mt-1"
              />
            </div>

            {/* Sort */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Sort By</Label>
              <Select value={filters.sortBy || "price"} onValueChange={handleSortChange}>
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="time">Duration: Short to Long</SelectItem>
                  <SelectItem value="rating">Rating: High to Low</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card className="p-4 border-primary/50 bg-primary/5">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Advanced Filters</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Price Range */}
              <div>
                <Label className="text-xs font-medium">Price Range (AED)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        ...filters,
                        minPrice: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="h-9 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        ...filters,
                        maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Minimum Seats */}
              <div>
                <Label className="text-xs font-medium">Minimum Seats Available</Label>
                <Select
                  value={filters.minSeats?.toString() || ""}
                  onValueChange={(val) =>
                    handleFilterChange({
                      ...filters,
                      minSeats: val ? parseInt(val) : undefined,
                    })
                  }
                >
                  <SelectTrigger className="h-9 mt-2">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filter Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs"
        >
          {showAdvanced ? "Hide Advanced" : "Show Advanced"} Filters
        </Button>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs gap-1"
          >
            <X className="h-3 w-3" />
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex gap-2 flex-wrap">
          {searchQuery && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs">
              <Search className="h-3 w-3" />
              {searchQuery}
              <button
                onClick={() => handleSearch("")}
                className="ml-1 hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.origin && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-full text-xs">
              <MapPin className="h-3 w-3" />
              From: {filters.origin}
              <button
                onClick={() => handleOriginChange("")}
                className="ml-1 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.destination && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-full text-xs">
              <MapPin className="h-3 w-3" />
              To: {filters.destination}
              <button
                onClick={() => handleDestinationChange("")}
                className="ml-1 hover:text-green-700 dark:hover:text-green-300"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.date && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100/50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 rounded-full text-xs">
              <Clock className="h-3 w-3" />
              {filters.date}
              <button
                onClick={() => handleDateChange("")}
                className="ml-1 hover:text-purple-700 dark:hover:text-purple-300"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
