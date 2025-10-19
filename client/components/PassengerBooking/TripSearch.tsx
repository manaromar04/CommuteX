import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, X } from "lucide-react";

interface TripSearchProps {
  onSearch: (origin: string, destination: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function TripSearch({ onSearch, onClear, hasActiveFilters }: TripSearchProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    if (origin.trim() || destination.trim()) {
      onSearch(origin.trim(), destination.trim());
    }
  };

  const handleClear = () => {
    setOrigin("");
    setDestination("");
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Find Your Ride</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Origin Input */}
            <div className="space-y-2">
              <Label htmlFor="origin" className="text-sm font-medium">
                Leaving From
              </Label>
              <Input
                id="origin"
                placeholder="e.g., Downtown Dubai"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white dark:bg-slate-900"
              />
            </div>

            {/* Destination Input */}
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium">
                Going To
              </Label>
              <Input
                id="destination"
                placeholder="e.g., Marina Mall"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white dark:bg-slate-900"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Label className="text-sm font-medium block opacity-0 pointer-events-none">
                Actions
              </Label>
              <div className="flex gap-2 h-10">
                <Button
                  onClick={handleSearch}
                  className="flex-1"
                  disabled={!origin.trim() && !destination.trim()}
                >
                  Search
                </Button>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    size="icon"
                    title="Clear filters"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Search Tips */}
          <p className="text-xs text-muted-foreground">
            💡 Tip: Leave either field empty to search by one criteria, or fill both for exact matches.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
