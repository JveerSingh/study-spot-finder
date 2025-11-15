import { MapPin, Volume2, Users, Clock, Calendar, BookOpen, UtensilsCrossed } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

export type NoiseLevel = "silent" | "quiet" | "moderate" | "loud";
export type OccupancyLevel = "low" | "medium" | "high";

export interface Location {
  id: string;
  name: string;
  building: string;
  floor: string;
  occupancy: number;
  noiseLevel: NoiseLevel;
  lastUpdated: string;
  availableSeats?: number;
  coordinates?: [number, number]; // [lng, lat]
  type?: "study" | "dining";
  latitude?: number;
  longitude?: number;
  crowdednessRating?: number; // Average crowdedness rating 1-10
  ratingCount?: number; // Number of ratings
  noiseLevelRating?: number; // Average noise level rating 1-10
  distance?: number; // Distance in meters
}

interface LocationCardProps {
  location: Location;
  eventCount?: number;
  onRate: (locationId: string) => void;
  onClick?: (locationId: string) => void;
}

const getCrowdednessColor = (rating: number) => {
  if (rating <= 3) return "success";
  if (rating <= 6) return "warning";
  return "destructive";
};

const getNoiseColor = (level: NoiseLevel) => {
  const colors = {
    silent: "success",
    quiet: "success",
    moderate: "warning",
    loud: "destructive",
  };
  return colors[level];
};

const getNoiseLabel = (level: NoiseLevel) => {
  const labels = {
    silent: "Silent",
    quiet: "Quiet",
    moderate: "Moderate",
    loud: "Loud",
  };
  return labels[level];
};

const LocationCard = ({ location, eventCount = 0, onRate, onClick }: LocationCardProps) => {
  const crowdednessRating = location.crowdednessRating || 0;
  const crowdednessColor = getCrowdednessColor(crowdednessRating);
  const noiseColor = getNoiseColor(location.noiseLevel);
  const noiseLevelRating = location.noiseLevelRating || 0;
  const LocationTypeIcon = location.type === "dining" ? UtensilsCrossed : BookOpen;
  const iconColor = location.type === "dining" ? "text-warning" : "text-primary";
  const totalRating = 10.0 - (crowdednessRating + noiseLevelRating) / 2.0;

  // Format distance
  const formatDistance = (meters?: number) => {
    if (!meters) return null;
    const miles = meters / 1609.34;
    if (miles < 0.1) {
      return `${Math.round(meters * 3.28084)} ft`;
    }
    return `${miles.toFixed(1)} mi`;
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer border-primary/20 hover:border-primary/40"
      onClick={() => onClick?.(location.id)}
    >
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <LocationTypeIcon className={`h-4 w-4 flex-shrink-0 ${iconColor}`} />
              <h3 className="text-lg font-bold text-foreground truncate">
                {location.name}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{location.building} - {location.floor}</span>
              {location.distance && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="text-xs font-medium">{formatDistance(location.distance)}</span>
                </>
              )}
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "flex-shrink-0 font-semibold",
              totalRating <= 3 && "border-destructive text-destructive bg-destructive/10",
              totalRating > 3 && totalRating <= 6 && "border-warning text-warning bg-warning/10",
              totalRating > 6 && "border-success text-success bg-success/10"
            )}
          >
            {totalRating > 0 ? `${totalRating.toFixed(1)}/10` : "No ratings"}
          </Badge>
        </div>

        <div className="mb-4 space-y-3">
          {/* Crowdedness Meter */}
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Users className="h-4 w-4" />
                <span>Crowdedness</span>
              </div>
              {location.ratingCount && location.ratingCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {location.ratingCount} rating{location.ratingCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <Progress
              value={crowdednessRating * 10}
              className="h-2"
              indicatorClassName={cn(
                crowdednessRating <= 3 && "bg-success",
                crowdednessRating > 3 && crowdednessRating <= 6 && "bg-warning",
                crowdednessRating > 6 && "bg-destructive"
              )}
            />
          </div>

          {/* Noise Level */}
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Volume2 className="h-4 w-4" />
                <span>Noise Level</span>
              </div>
              {noiseLevelRating > 0 && (
                <span className="text-xs font-medium text-foreground">
                  {noiseLevelRating.toFixed(1)}/10
                </span>
              )}
            </div>
            {noiseLevelRating > 0 ? (
              <Progress
                value={noiseLevelRating * 10}
                className="h-2"
                indicatorClassName={cn(
                  noiseLevelRating <= 3 && "bg-success",
                  noiseLevelRating > 3 && noiseLevelRating <= 6 && "bg-warning",
                  noiseLevelRating > 6 && "bg-destructive"
                )}
              />
            ) : (
              <Badge
                variant="outline"
                className={cn(
                  "w-fit text-xs",
                  noiseColor === "success" && "border-success text-success bg-success/10",
                  noiseColor === "warning" && "border-warning text-warning bg-warning/10",
                  noiseColor === "destructive" && "border-destructive text-destructive bg-destructive/10"
                )}
              >
                {getNoiseLabel(location.noiseLevel)}
              </Badge>
            )}
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {location.lastUpdated}</span>
          </div>
        </div>

        {eventCount > 0 && (
          <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-primary">
            <Calendar className="h-4 w-4" />
            <span>{eventCount} event{eventCount === 1 ? '' : 's'} happening here</span>
          </div>
        )}

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onRate(location.id);
          }}
          variant="outline"
          className="w-full"
          size="sm"
        >
          Rate This Spot
        </Button>
      </div>
    </Card>
  );
};

export default LocationCard;
