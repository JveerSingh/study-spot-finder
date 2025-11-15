import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Event } from "./EventCard";
import EventCard from "./EventCard";
import { MapPin } from "lucide-react";

interface LocationEventsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationName: string;
  events: Event[];
  onRateEvent: (eventId: string, type: 'event' | 'crowdedness') => void;
}

const LocationEventsDialog = ({ 
  open, 
  onOpenChange, 
  locationName,
  events,
  onRateEvent
}: LocationEventsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Events at {locationName}
          </DialogTitle>
          <DialogDescription>
            {events.length === 0 
              ? "No events happening at this location right now" 
              : `${events.length} event${events.length === 1 ? '' : 's'} happening here`
            }
          </DialogDescription>
        </DialogHeader>
        
        {events.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRate={onRateEvent}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No events at this location yet.</p>
            <p className="mt-2 text-sm">Check the Events tab to create one!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LocationEventsDialog;
