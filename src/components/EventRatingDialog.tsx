import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Star, Users } from "lucide-react";

interface EventRatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
  ratingType: 'event' | 'crowdedness';
  onSubmit: (rating: number) => void;
}

const EventRatingDialog = ({ 
  open, 
  onOpenChange, 
  eventName, 
  ratingType,
  onSubmit 
}: EventRatingDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      setRating(0);
      setHoveredRating(0);
      onOpenChange(false);
    }
  };

  const Icon = ratingType === 'event' ? Star : Users;
  const title = ratingType === 'event' ? 'Rate Event' : 'Rate Crowdedness';
  const description = ratingType === 'event' 
    ? 'How would you rate this event?' 
    : 'How crowded is this event?';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {eventName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground">{description}</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-all hover:scale-110"
                >
                  <Icon
                    className={`h-8 w-8 ${
                      value <= (hoveredRating || rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0}>
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRatingDialog;
