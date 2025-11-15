import { Calendar, MapPin, Star, Users, Volume2, PartyPopper, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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

  return (
    <Card className="group">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1.5">
            <h3 className="text-lg font-bold text-foreground leading-tight tracking-tight">
              {event.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{event.locationName}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{event.timestamp}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            {event.checkInCount} here
          </Badge>
          {event.crowdednessRatings.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {avgCrowdedness}
            </Badge>
          )}
          {event.noiseLevelRatings.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              {avgNoiseLevel}
            </Badge>
          )}
          {event.funLevelRatings.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <PartyPopper className="h-3 w-3" />
              {avgFunLevel}
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
