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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationName: string;
  locationId: string;
}

const RatingDialog = ({ open, onOpenChange, locationName, locationId }: RatingDialogProps) => {
  const [crowdedness, setCrowdedness] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!crowdedness) {
      toast.error("Please select a crowdedness rating");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to rate");
        return;
      }

      const { error } = await supabase
        .from('location_crowdedness_ratings')
        .upsert({
          location_id: locationId,
          user_id: user.id,
          rating: crowdedness,
        });

      if (error) throw error;

      toast.success("Rating submitted!", {
        description: "Thanks for helping the community!",
      });

      // Reset and close
      setCrowdedness(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error("Failed to submit rating");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Crowdedness</DialogTitle>
          <DialogDescription>
            How crowded is <strong>{locationName}</strong> right now?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Label className="text-base font-medium">Crowdedness Level (1-10)</Label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setCrowdedness(rating)}
                className={`
                  h-12 rounded-md border-2 font-semibold transition-all
                  ${crowdedness === rating
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                {rating}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Empty</span>
            <span>Very Crowded</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              setCrowdedness(null);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1"
            disabled={!crowdedness}
          >
            Submit Rating
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
