import { MapPin, Search } from "lucide-react";
import { Button } from "./ui/button";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center text-white">
          <div className="mb-6 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium">Real-Time Study Spot Finder</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Stop Wandering.
            <br />
            <span className="text-white/90">Start Studying.</span>
          </h1>
          
          <p className="mb-8 max-w-2xl text-lg text-white/90 md:text-xl">
            Find the perfect study spot at OSU in seconds. Real-time availability, 
            noise levels, and crowdsourced ratings—all in one place.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Search className="mr-2 h-5 w-5" />
              Find a Spot Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              How It Works
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">20+</div>
              <div className="text-sm text-white/80">Study Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Live</div>
              <div className="text-sm text-white/80">Real-Time Data</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5 min</div>
              <div className="text-sm text-white/80">Avg. Time Saved</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
    </section>
  );
};

export default Hero;
