import { MapPin, Volume2, Users, Clock, Calendar, BookOpen, UtensilsCrossed } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

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
}

interface LocationCardProps {
  location: Location;
  eventCount?: number;
  onRate: (locationId: string) => void;
  onClick?: (locationId: string) => void;
}

const getOccupancyColor = (occupancy: number) => {
  if (occupancy < 40) return "success";
  if (occupancy < 70) return "warning";
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
  const occupancyColor = getOccupancyColor(location.occupancy);
  const noiseColor = getNoiseColor(location.noiseLevel);
  const LocationTypeIcon = location.type === "dining" ? UtensilsCrossed : BookOpen;
  const iconColor = location.type === "dining" ? "text-warning" : "text-primary";

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={() => onClick?.(location.id)}
    >
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <LocationTypeIcon className={`h-4 w-4 ${iconColor}`} />
              <h3 className="text-lg font-semibold text-foreground">
                {location.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location.building} - {location.floor}</span>
            </div>
          </div>
          <Badge 
            variant={occupancyColor === "success" ? "default" : "secondary"}
            className={
              occupancyColor === "success" 
                ? "bg-success text-success-foreground"
                : occupancyColor === "warning"
                ? "bg-warning text-warning-foreground"
                : "bg-destructive text-destructive-foreground"
            }
          >
            {location.occupancy}% Full
          </Badge>
        </div>

        <div className="mb-4 space-y-3">
          {/* Occupancy Progress */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Occupancy</span>
              </div>
              {location.availableSeats && (
                <span className="text-xs text-muted-foreground">
                  ~{location.availableSeats} seats left
                </span>
              )}
            </div>
            <Progress 
              value={location.occupancy} 
              className="h-2"
            />
          </div>

          {/* Noise Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Volume2 className="h-4 w-4" />
              <span>Noise Level</span>
            </div>
            <Badge 
              variant="outline"
              className={
                noiseColor === "success"
                  ? "border-success text-success"
                  : noiseColor === "warning"
                  ? "border-warning text-warning"
                  : "border-destructive text-destructive"
              }
            >
              {getNoiseLabel(location.noiseLevel)}
            </Badge>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
