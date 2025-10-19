import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@shared/types";
import {
  Star,
  MapPin,
  Calendar,
  MessageCircle,
  Shield,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

export interface UserReview {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  date: string;
  trip_info?: string;
}

interface UserProfileProps {
  user: User;
  isDriver?: boolean;
  reviews?: UserReview[];
  tripHistory?: Array<{
    id: string;
    date: string;
    route: string;
    rating: number;
  }>;
  onEdit?: () => void;
}

export function UserProfile({
  user,
  isDriver = false,
  reviews = [],
  tripHistory = [],
  onEdit,
}: UserProfileProps) {
  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      BRONZE: "bg-amber-600",
      SILVER: "bg-slate-400",
      GOLD: "bg-yellow-500",
      PLATINUM: "bg-indigo-600",
    };
    return colors[tier] || "bg-slate-500";
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      PASSENGER: "bg-blue-600",
      DRIVER: "bg-green-600",
    };
    return colors[role] || "bg-slate-600";
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "N/A";

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
            </div>
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                Edit Profile
              </Button>
            )}
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-4">
            <Badge className={`${getRoleColor(user.role)} text-white`}>
              {user.role}
            </Badge>
            <Badge className={`${getTierColor(user.tier)} text-white`}>
              {user.tier} TIER
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Wallet Balance</p>
              <p className="text-lg font-bold text-primary mt-1">
                {user.wallet_balance_aed} AED
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Reward Points</p>
              <p className="text-lg font-bold text-yellow-600 mt-1">
                {user.reward_points}
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                {isDriver ? "Trips Completed" : "Trips Booked"}
              </p>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {tripHistory.length}
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Average Rating</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <p className="text-lg font-bold">{averageRating}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip History */}
      {tripHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {isDriver ? "Trip History" : "Booking History"}
            </CardTitle>
            <CardDescription>
              Your recent {isDriver ? "trips" : "bookings"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tripHistory.slice(0, 5).map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {trip.route}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{trip.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: trip.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reviews/Ratings */}
      {isDriver && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Passenger Reviews
            </CardTitle>
            <CardDescription>
              Average Rating: {averageRating} ⭐ ({reviews.length} reviews)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No reviews yet. Complete your first trip to get reviews!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border border-border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {review.reviewer_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-500 fill-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{review.comment}</p>
                    {review.trip_info && (
                      <p className="text-xs text-muted-foreground">
                        Trip: {review.trip_info}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {isDriver ? "Driver Stats" : "Passenger Stats"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 border border-border rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-lg font-bold text-foreground mt-1">
                {new Date(user.created_at || Date.now()).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="p-3 border border-border rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Referrals</p>
              <p className="text-lg font-bold text-primary mt-1">5</p>
            </div>
            <div className="p-3 border border-border rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-lg font-bold text-green-600 mt-1">
                {(user.reward_points * 0.5).toFixed(0)} AED
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
