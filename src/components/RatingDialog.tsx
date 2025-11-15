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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationName: string;
}

const RatingDialog = ({ open, onOpenChange, locationName }: RatingDialogProps) => {
  const [seatsLeft, setSeatsLeft] = useState<string>("");
  const [noiseLevel, setNoiseLevel] = useState<string>("");

  const handleSubmit = () => {
    if (!seatsLeft || !noiseLevel) {
      toast.error("Please select both ratings");
      return;
    }

    toast.success("Rating submitted!", {
      description: "Thanks for helping the community!",
    });

    // Reset and close
    setSeatsLeft("");
    setNoiseLevel("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate This Spot</DialogTitle>
          <DialogDescription>
            Help others by rating <strong>{locationName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Seats Available */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Seats Available?</Label>
            <RadioGroup value={seatsLeft} onValueChange={setSeatsLeft}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="seats-none" />
                <Label htmlFor="seats-none" className="cursor-pointer font-normal">
                  None - Completely full
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="few" id="seats-few" />
                <Label htmlFor="seats-few" className="cursor-pointer font-normal">
                  Few - Just a handful left
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="many" id="seats-many" />
                <Label htmlFor="seats-many" className="cursor-pointer font-normal">
                  Many - Plenty of space
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Noise Level */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Noise Level?</Label>
            <RadioGroup value={noiseLevel} onValueChange={setNoiseLevel}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="silent" id="noise-silent" />
                <Label htmlFor="noise-silent" className="cursor-pointer font-normal">
                  Silent - Library quiet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quiet" id="noise-quiet" />
                <Label htmlFor="noise-quiet" className="cursor-pointer font-normal">
                  Quiet - Light conversation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="noise-moderate" />
                <Label htmlFor="noise-moderate" className="cursor-pointer font-normal">
                  Moderate - Active workspace
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="loud" id="noise-loud" />
                <Label htmlFor="noise-loud" className="cursor-pointer font-normal">
                  Loud - Very noisy
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
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
