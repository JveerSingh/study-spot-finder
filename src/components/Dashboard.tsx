import { useState } from "react";
import { Search, SlidersHorizontal, Sparkles, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import LocationCard, { Location } from "./LocationCard";
import RatingDialog from "./RatingDialog";
import StudySpotMap from "./StudySpotMap";
import EventCard, { Event } from "./EventCard";
import AddEventDialog from "./AddEventDialog";
import EventRatingDialog from "./EventRatingDialog";
import LocationEventsDialog from "./LocationEventsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

const mockLocations: Location[] = [
  // Study Spots
  {
    id: "1",
    name: "Thompson Library: 11th Floor",
    building: "Thompson Library",
    floor: "11th Floor",
    occupancy: 25,
    noiseLevel: "silent",
    lastUpdated: "2 min ago",
    availableSeats: 45,
    coordinates: [-83.0298, 40.0067],
    type: "study",
  },
  {
    id: "2",
    name: "Thompson Library: 2nd Floor Grand Reading Room",
    building: "Thompson Library",
    floor: "2nd Floor",
    occupancy: 62,
    noiseLevel: "quiet",
    lastUpdated: "4 min ago",
    availableSeats: 75,
    coordinates: [-83.0298, 40.0067],
    type: "study",
  },
  {
    id: "3",
    name: "18th Avenue Library",
    building: "18th Avenue Library",
    floor: "Main Floor",
    occupancy: 38,
    noiseLevel: "silent",
    lastUpdated: "3 min ago",
    availableSeats: 85,
    coordinates: [-83.0270, 40.0080],
    type: "study",
  },
  {
    id: "4",
    name: "Smith Lab",
    building: "Smith Laboratory",
    floor: "Multiple Floors",
    occupancy: 55,
    noiseLevel: "quiet",
    lastUpdated: "5 min ago",
    availableSeats: 40,
    coordinates: [-83.0305, 40.0074],
    type: "study",
  },
  {
    id: "5",
    name: "Fontana Lab",
    building: "Mars G. Fontana Laboratory",
    floor: "Main Floor",
    occupancy: 48,
    noiseLevel: "moderate",
    lastUpdated: "7 min ago",
    availableSeats: 30,
    coordinates: [-83.0310, 40.0082],
    type: "study",
  },
  {
    id: "6",
    name: "Morrill Tower Study Rooms",
    building: "Morrill Tower",
    floor: "Multiple Floors",
    occupancy: 72,
    noiseLevel: "quiet",
    lastUpdated: "6 min ago",
    availableSeats: 15,
    coordinates: [-83.0295, 40.0055],
    type: "study",
  },
  {
    id: "7",
    name: "Knowlton Hall: Architecture Library",
    building: "Knowlton Hall",
    floor: "Ground Floor",
    occupancy: 42,
    noiseLevel: "quiet",
    lastUpdated: "8 min ago",
    availableSeats: 50,
    coordinates: [-83.0318, 40.0014],
    type: "study",
  },
  {
    id: "8",
    name: "Music Hall: Timashev Family Music Building",
    building: "Timashev Family Music Building",
    floor: "Main Floor",
    occupancy: 35,
    noiseLevel: "moderate",
    lastUpdated: "10 min ago",
    availableSeats: 25,
    coordinates: [-83.0275, 40.0015],
    type: "study",
  },
  {
    id: "9",
    name: "Orton Hall: Geology Library",
    building: "Orton Hall",
    floor: "1st Floor",
    occupancy: 45,
    noiseLevel: "silent",
    lastUpdated: "4 min ago",
    availableSeats: 35,
    coordinates: [-83.0310, 40.0065],
    type: "study",
  },
  // Dining Spots
  {
    id: "10",
    name: "Traditions at Scott",
    building: "Scott Traditions",
    floor: "Dining Hall",
    occupancy: 68,
    noiseLevel: "loud",
    lastUpdated: "2 min ago",
    availableSeats: 120,
    coordinates: [-83.0285, 40.0045],
    type: "dining",
  },
  {
    id: "11",
    name: "Traditions at Kennedy Commons",
    building: "Kennedy Commons",
    floor: "Dining Hall",
    occupancy: 75,
    noiseLevel: "loud",
    lastUpdated: "3 min ago",
    availableSeats: 95,
    coordinates: [-83.0275, 40.0072],
    type: "dining",
  },
  {
    id: "12",
    name: "Traditions at Morrill",
    building: "Morrill Tower",
    floor: "Dining Hall",
    occupancy: 52,
    noiseLevel: "moderate",
    lastUpdated: "5 min ago",
    availableSeats: 140,
    coordinates: [-83.0295, 40.0055],
    type: "dining",
  },
  {
    id: "13",
    name: "Juice at RPAC",
    building: "RPAC",
    floor: "Main Floor",
    occupancy: 45,
    noiseLevel: "moderate",
    lastUpdated: "6 min ago",
    availableSeats: 25,
    coordinates: [-83.0265, 39.9990],
    type: "dining",
  },
  {
    id: "14",
    name: "Berry Cafe",
    building: "Berry Hall",
    floor: "Main Floor",
    occupancy: 60,
    noiseLevel: "moderate",
    lastUpdated: "8 min ago",
    availableSeats: 30,
    coordinates: [-83.0320, 40.0050],
    type: "dining",
  },
  {
    id: "15",
    name: "Curl Market",
    building: "Curl Hall",
    floor: "Main Floor",
    occupancy: 38,
    noiseLevel: "quiet",
    lastUpdated: "4 min ago",
    availableSeats: 40,
    coordinates: [-83.0320, 40.0050],
    type: "dining",
  },
  {
    id: "16",
    name: "Connecting Grounds",
    building: "Ohio Union",
    floor: "Ground Floor",
    occupancy: 82,
    noiseLevel: "loud",
    lastUpdated: "1 min ago",
    availableSeats: 15,
    coordinates: [-83.0290, 40.0020],
    type: "dining",
  },
  {
    id: "17",
    name: "Woody's Tavern",
    building: "Ohio Union",
    floor: "Ground Floor",
    occupancy: 88,
    noiseLevel: "loud",
    lastUpdated: "2 min ago",
    availableSeats: 8,
    coordinates: [-83.0290, 40.0020],
    type: "dining",
  },
  {
    id: "18",
    name: "Sloopy's Diner",
    building: "Ohio Union",
    floor: "Ground Floor",
    occupancy: 65,
    noiseLevel: "loud",
    lastUpdated: "3 min ago",
    availableSeats: 22,
    coordinates: [-83.0290, 40.0020],
    type: "dining",
  },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedLocationForEvents, setSelectedLocationForEvents] = useState<string | null>(null);
  const [locations] = useState(mockLocations);
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Calculus Study Group",
      description: "Working through homework problems for Math 1151. All welcome!",
      locationId: "1",
      locationName: "Thompson Library - 3rd Floor",
      timestamp: "Today at 3:00 PM",
      ratings: [5, 4, 5],
      crowdednessRatings: [3, 2, 3],
    },
    {
      id: "2",
      name: "CS Midterm Review",
      description: "Reviewing for CSE 2221 midterm exam. Bring your notes!",
      locationId: "2",
      locationName: "Science & Engineering Library - 2nd Floor",
      timestamp: "Today at 5:30 PM",
      ratings: [4, 5, 4, 5],
      crowdednessRatings: [4, 4, 5],
    },
  ]);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [eventRatingDialogOpen, setEventRatingDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [ratingType, setRatingType] = useState<'event' | 'crowdedness'>('event');

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventsForLocation = (locationId: string) => {
    return events.filter((event) => event.locationId === locationId);
  };

  const selectedLocation = locations.find((l) => l.id === selectedLocationForEvents);
  const locationEvents = selectedLocationForEvents 
    ? getEventsForLocation(selectedLocationForEvents) 
    : [];

  const handleAddEvent = (eventData: { name: string; description: string; locationId: string }) => {
    const location = locations.find((l) => l.id === eventData.locationId);
    if (!location) return;

    const newEvent: Event = {
      id: String(events.length + 1),
      name: eventData.name,
      description: eventData.description,
      locationId: eventData.locationId,
      locationName: location.name,
      timestamp: "Just now",
      ratings: [],
      crowdednessRatings: [],
    };

    setEvents([...events, newEvent]);
    toast.success("Event created!", {
      description: `${eventData.name} at ${location.name}`,
    });
  };

  const handleRateEvent = (eventId: string, type: 'event' | 'crowdedness') => {
    setSelectedEventId(eventId);
    setRatingType(type);
    setEventRatingDialogOpen(true);
  };

  const handleSubmitEventRating = (rating: number) => {
    if (!selectedEventId) return;

    setEvents(events.map((event) => {
      if (event.id === selectedEventId) {
        if (ratingType === 'event') {
          return { ...event, ratings: [...event.ratings, rating] };
        } else {
          return { ...event, crowdednessRatings: [...event.crowdednessRatings, rating] };
        }
      }
      return event;
    }));

    const event = events.find((e) => e.id === selectedEventId);
    toast.success(
      `${ratingType === 'event' ? 'Event' : 'Crowdedness'} rating submitted!`,
      {
        description: event?.name,
      }
    );
  };

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

        {/* Tabs for List/Map/Events View */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            {filteredLocations.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLocations.map((location) => (
                  <div key={location.id} id={`location-${location.id}`}>
                    <LocationCard
                      location={location}
                      eventCount={getEventsForLocation(location.id).length}
                      onRate={(id) => setSelectedLocationId(id)}
                      onClick={(id) => setSelectedLocationForEvents(id)}
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
              events={filteredEvents}
              onLocationClick={(location) => {
                toast.info(`Selected: ${location.name}`, {
                  description: `${location.occupancy}% full, ${location.availableSeats} seats available`,
                });
              }}
              onEventClick={(event) => {
                toast.info(`Event: ${event.name}`, {
                  description: `At ${event.locationName}`,
                });
              }}
            />
          </TabsContent>

          <TabsContent value="events">
            <div className="mb-4 flex justify-end">
              <Button
                onClick={() => setAddEventOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRate={handleRateEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? `No events found matching "${searchQuery}"` : "No events yet. Be the first to add one!"}
                </p>
              </div>
            )}
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

      {/* Location Events Dialog */}
      <LocationEventsDialog
        open={selectedLocationForEvents !== null}
        onOpenChange={(open) => !open && setSelectedLocationForEvents(null)}
        locationName={selectedLocation?.name || ""}
        events={locationEvents}
        onRateEvent={handleRateEvent}
      />

      {/* Add Event Dialog */}
      <AddEventDialog
        open={addEventOpen}
        onOpenChange={setAddEventOpen}
        locations={locations}
        onAddEvent={handleAddEvent}
      />

      {/* Event Rating Dialog */}
      <EventRatingDialog
        open={eventRatingDialogOpen}
        onOpenChange={setEventRatingDialogOpen}
        eventName={events.find((e) => e.id === selectedEventId)?.name || ""}
        ratingType={ratingType}
        onSubmit={handleSubmitEventRating}
      />
    </section>
  );
};

export default Dashboard;
