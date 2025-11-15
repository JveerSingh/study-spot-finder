import { useState } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import LocationCard, { Location } from "./LocationCard";
import RatingDialog from "./RatingDialog";
import StudySpotMap from "./StudySpotMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

const mockLocations: Location[] = [
  {
    id: "1",
    name: "Thompson Library - 3rd Floor",
    building: "Thompson",
    floor: "3rd Floor",
    occupancy: 35,
    noiseLevel: "quiet",
    lastUpdated: "2 min ago",
    availableSeats: 15,
    coordinates: [-83.0298, 40.0065],
  },
  {
    id: "2",
    name: "Science & Engineering Library - 2nd Floor",
    building: "SEL",
    floor: "2nd Floor",
    occupancy: 58,
    noiseLevel: "moderate",
    lastUpdated: "5 min ago",
    availableSeats: 8,
    coordinates: [-83.0315, 40.0078],
  },
  {
    id: "3",
    name: "Ohio Union - 2nd Floor Study Area",
    building: "Ohio Union",
    floor: "2nd Floor",
    occupancy: 92,
    noiseLevel: "loud",
    lastUpdated: "1 min ago",
    availableSeats: 2,
    coordinates: [-83.0290, 40.0020],
  },
  {
    id: "4",
    name: "Knowlton Hall - Architecture Library",
    building: "Knowlton",
    floor: "Ground Floor",
    occupancy: 45,
    noiseLevel: "quiet",
    lastUpdated: "8 min ago",
    availableSeats: 12,
    coordinates: [-83.0318, 40.0014],
  },
  {
    id: "5",
    name: "18th Avenue Library",
    building: "18th Ave Library",
    floor: "Main Floor",
    occupancy: 28,
    noiseLevel: "silent",
    lastUpdated: "3 min ago",
    availableSeats: 20,
    coordinates: [-83.0270, 40.0080],
  },
  {
    id: "6",
    name: "Drake Union - Study Lounge",
    building: "Drake Union",
    floor: "3rd Floor",
    occupancy: 75,
    noiseLevel: "moderate",
    lastUpdated: "6 min ago",
    availableSeats: 5,
    coordinates: [-83.0305, 40.0058],
  },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [locations] = useState(mockLocations);

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFindBestSpot = () => {
    const bestSpot = [...locations].sort((a, b) => {
      // Prioritize low occupancy and quiet spaces
      const scoreA = (100 - a.occupancy) + (a.noiseLevel === "silent" ? 20 : a.noiseLevel === "quiet" ? 15 : 0);
      const scoreB = (100 - b.occupancy) + (b.noiseLevel === "silent" ? 20 : b.noiseLevel === "quiet" ? 15 : 0);
      return scoreB - scoreA;
    })[0];

    toast.success(
      `Best spot found: ${bestSpot.name}`,
      {
        description: `${bestSpot.occupancy}% full, ${bestSpot.noiseLevel} noise level`,
      }
    );

    // Scroll to the card
    const element = document.getElementById(`location-${bestSpot.id}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-foreground">Live Study Spots</h2>
          <p className="text-muted-foreground">
            Real-time availability across campus
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search buildings or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Button 
              onClick={handleFindBestSpot}
              className="gap-2 bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              Find Best Spot
            </Button>
          </div>
        </div>

        {/* Tabs for List/Map View */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            {filteredLocations.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLocations.map((location) => (
                  <div key={location.id} id={`location-${location.id}`}>
                    <LocationCard
                      location={location}
                      onRate={(id) => setSelectedLocationId(id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No locations found matching "{searchQuery}"
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="map">
            <StudySpotMap 
              locations={filteredLocations}
              onLocationClick={(location) => {
                toast.info(`Selected: ${location.name}`, {
                  description: `${location.occupancy}% full, ${location.availableSeats} seats available`,
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Rating Dialog */}
      <RatingDialog
        open={selectedLocationId !== null}
        onOpenChange={(open) => !open && setSelectedLocationId(null)}
        locationName={
          locations.find((l) => l.id === selectedLocationId)?.name || ""
        }
      />
    </section>
  );
};

export default Dashboard;
