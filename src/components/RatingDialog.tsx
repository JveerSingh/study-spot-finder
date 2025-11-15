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
import { Slider } from "./ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationName: string;
  locationId: string;
}

const RatingDialog = ({ open, onOpenChange, locationName, locationId }: RatingDialogProps) => {
  const [crowdedness, setCrowdedness] = useState<number>(5);

  const handleSubmit = async () => {
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
      setCrowdedness(5);
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
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Crowdedness Level</Label>
            <span className="text-2xl font-bold text-primary">{crowdedness}</span>
          </div>
          <Slider
            value={[crowdedness]}
            onValueChange={(value) => setCrowdedness(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
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
              setCrowdedness(5);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1"
          >
            Submit Rating
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
