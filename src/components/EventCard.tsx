import { Calendar, MapPin, Star, Users } from "lucide-react";
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
  ratings: number[];
  crowdednessRatings: number[];
}

interface EventCardProps {
  event: Event;
  onRate: (id: string, type: 'event' | 'crowdedness') => void;
}

const EventCard = ({ event, onRate }: EventCardProps) => {
  const avgRating = event.ratings.length > 0
    ? (event.ratings.reduce((a, b) => a + b, 0) / event.ratings.length).toFixed(1)
    : "N/A";
  
  const avgCrowdedness = event.crowdednessRatings.length > 0
    ? (event.crowdednessRatings.reduce((a, b) => a + b, 0) / event.crowdednessRatings.length).toFixed(1)
    : "N/A";

  return (
    <Card className="group transition-all hover:shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-foreground leading-tight">
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
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {avgRating} ({event.ratings.length})
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {avgCrowdedness} ({event.crowdednessRatings.length})
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onRate(event.id, 'event')}
          >
            Rate Event
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onRate(event.id, 'crowdedness')}
          >
            Rate Crowdedness
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
