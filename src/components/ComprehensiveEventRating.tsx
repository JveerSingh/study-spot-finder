import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Star, Users, Volume2, PartyPopper } from "lucide-react";

interface ComprehensiveEventRatingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (ratings: {
    crowdedness?: number;
    noiseLevel?: number;
    funLevel?: number;
  }) => void;
  eventName: string;
}

const ComprehensiveEventRating = ({
  open,
  onOpenChange,
  onSubmit,
  eventName,
}: ComprehensiveEventRatingProps) => {
  const [crowdedness, setCrowdedness] = useState<number | null>(null);
  const [noiseLevel, setNoiseLevel] = useState<number | null>(null);
  const [funLevel, setFunLevel] = useState<number | null>(null);

  const handleSubmit = () => {
    const ratings: { crowdedness?: number; noiseLevel?: number; funLevel?: number } = {};
    if (crowdedness) ratings.crowdedness = crowdedness;
    if (noiseLevel) ratings.noiseLevel = noiseLevel;
    if (funLevel) ratings.funLevel = funLevel;
    
    onSubmit(ratings);
    setCrowdedness(null);
    setNoiseLevel(null);
    setFunLevel(null);
    onOpenChange(false);
  };

  const RatingStars = ({ value, onChange, icon: Icon }: { value: number | null; onChange: (v: number) => void; icon: any }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-all hover:scale-110"
        >
          <Icon
            className={`h-6 w-6 ${
              value && star <= value
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Event</DialogTitle>
          <DialogDescription>
            You're checked in to {eventName}. Rate your experience (optional):
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Crowdedness
            </Label>
            <RatingStars value={crowdedness} onChange={setCrowdedness} icon={Star} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Noise Level
            </Label>
            <RatingStars value={noiseLevel} onChange={setNoiseLevel} icon={Star} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <PartyPopper className="h-4 w-4" />
              Fun Level
            </Label>
            <RatingStars value={funLevel} onChange={setFunLevel} icon={Star} />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCrowdedness(null);
              setNoiseLevel(null);
              setFunLevel(null);
              onOpenChange(false);
            }}
          >
            Skip
          </Button>
          <Button onClick={handleSubmit}>
            Submit Ratings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComprehensiveEventRating;
