import { Calendar, MapPin, Star, Users, Volume2, PartyPopper, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export interface Event {
  id: string;
  name: string;
  description: string;
  locationId: string;
  locationName: string;
  timestamp: string;
  checkInCount: number;
  isCheckedIn: boolean;
  crowdednessRatings: number[];
  noiseLevelRatings: number[];
  funLevelRatings: number[];
  latitude?: number;
  longitude?: number;
  distance?: number; // Distance in meters
}

interface EventCardProps {
  event: Event;
  onCheckIn: (id: string) => void;
}

const EventCard = ({ event, onCheckIn }: EventCardProps) => {
  const avgCrowdedness = event.crowdednessRatings.length > 0
    ? (event.crowdednessRatings.reduce((a, b) => a + b, 0) / event.crowdednessRatings.length).toFixed(1)
    : "N/A";

  const avgNoiseLevel = event.noiseLevelRatings.length > 0
    ? (event.noiseLevelRatings.reduce((a, b) => a + b, 0) / event.noiseLevelRatings.length).toFixed(1)
    : "N/A";

  const avgFunLevel = event.funLevelRatings.length > 0
    ? (event.funLevelRatings.reduce((a, b) => a + b, 0) / event.funLevelRatings.length).toFixed(1)
    : "N/A";

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
    <Card className="border-primary/20 hover:border-primary/40">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1.5">
            <h3 className="text-lg font-bold text-foreground leading-tight truncate">
              {event.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{event.locationName}</span>
              {event.distance && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="text-xs font-medium">{formatDistance(event.distance)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{event.timestamp}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1 bg-accent">
            <Check className="h-3 w-3" />
            <span className="font-medium">{event.checkInCount} here</span>
          </Badge>
          {event.crowdednessRatings.length > 0 && (
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1",
                parseFloat(avgCrowdedness) <= 3 && "border-success text-success bg-success/10",
                parseFloat(avgCrowdedness) > 3 && parseFloat(avgCrowdedness) <= 6 && "border-warning text-warning bg-warning/10",
                parseFloat(avgCrowdedness) > 6 && "border-destructive text-destructive bg-destructive/10"
              )}
            >
              <Users className="h-3 w-3" />
              Crowd
              <span className="font-medium">{avgCrowdedness}</span>
            </Badge>
          )}
          {event.noiseLevelRatings.length > 0 && (
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1",
                parseFloat(avgNoiseLevel) <= 3 && "border-success text-success bg-success/10",
                parseFloat(avgNoiseLevel) > 3 && parseFloat(avgNoiseLevel) <= 6 && "border-warning text-warning bg-warning/10",
                parseFloat(avgNoiseLevel) > 6 && "border-destructive text-destructive bg-destructive/10"
              )}
            >
              <Volume2 className="h-3 w-3" />
              Noise
              <span className="font-medium">{avgNoiseLevel}</span>
            </Badge>
          )}
          {event.funLevelRatings.length > 0 && (
            <Badge variant="outline" className={cn(
              "flex items-center gap-1",
              parseFloat(avgNoiseLevel) <= 3 && "border-destructive text-destructive bg-destructive/10",
              parseFloat(avgNoiseLevel) > 3 && parseFloat(avgNoiseLevel) <= 6 && "border-warning text-warning bg-warning/10",
              parseFloat(avgNoiseLevel) > 6 && "border-success text-success bg-success/10" 
            )}>
              <PartyPopper className="h-3 w-3" />
              Fun
              <span className="font-medium">{avgFunLevel}</span>
            </Badge>
          )}
        </div>

        <Button
          variant={event.isCheckedIn ? "secondary" : "default"}
          size="sm"
          className="w-full"
          onClick={() => onCheckIn(event.id)}
          disabled={event.isCheckedIn}
        >
          {event.isCheckedIn ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Checked In
            </>
          ) : (
            "I'm Here - Check In"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
