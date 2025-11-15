import { useState, useEffect } from "react";
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
import { getLocations } from "@/data/locations";
import { supabase } from "@/integrations/supabase/client";

// Get locations from centralized data source
const mockLocations: Location[] = getLocations();

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedLocationForEvents, setSelectedLocationForEvents] = useState<string | null>(null);
  const [locations] = useState(mockLocations);
  const [events, setEvents] = useState<Event[]>([]);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [eventRatingDialogOpen, setEventRatingDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [ratingType, setRatingType] = useState<'event' | 'crowdedness'>('event');
  const [loading, setLoading] = useState(true);

  // Fetch events from database
  useEffect(() => {
    fetchEvents();

    // Set up realtime subscription
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          fetchEvents();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_ratings'
        },
        () => {
          fetchEvents();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_crowdedness_ratings'
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      if (eventsData) {
        const eventsWithRatings = await Promise.all(
          eventsData.map(async (event) => {
            const { data: ratings } = await supabase
              .from('event_ratings')
              .select('rating')
              .eq('event_id', event.id);

            const { data: crowdednessRatings } = await supabase
              .from('event_crowdedness_ratings')
              .select('rating')
              .eq('event_id', event.id);

            const timestamp = new Date(event.created_at).toLocaleString();

            return {
              id: event.id,
              name: event.name,
              description: event.description,
              locationId: event.location_id,
              locationName: event.location_name,
              timestamp,
              ratings: ratings?.map(r => r.rating) || [],
              crowdednessRatings: crowdednessRatings?.map(r => r.rating) || [],
            };
          })
        );

        setEvents(eventsWithRatings);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddEvent = async (eventData: { name: string; description: string; locationId: string }) => {
    const location = locations.find((l) => l.id === eventData.locationId);
    if (!location) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create events");
        return;
      }

      const { error } = await supabase
        .from('events')
        .insert({
          name: eventData.name,
          description: eventData.description,
          location_id: eventData.locationId,
          location_name: location.name,
          created_by: user.id,
        });

      if (error) throw error;

      toast.success("Event created!", {
        description: `${eventData.name} at ${location.name}`,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("Failed to create event");
    }
  };

  const handleRateEvent = (eventId: string, type: 'event' | 'crowdedness') => {
    setSelectedEventId(eventId);
    setRatingType(type);
    setEventRatingDialogOpen(true);
  };

  const handleSubmitEventRating = async (rating: number) => {
    if (!selectedEventId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to rate");
        return;
      }

      const table = ratingType === 'event' ? 'event_ratings' : 'event_crowdedness_ratings';
      
      const { error } = await supabase
        .from(table)
        .upsert({
          event_id: selectedEventId,
          user_id: user.id,
          rating,
        });

      if (error) throw error;

      const event = events.find((e) => e.id === selectedEventId);
      toast.success(
        `${ratingType === 'event' ? 'Event' : 'Crowdedness'} rating submitted!`,
        {
          description: event ? `for ${event.name}` : undefined,
        }
      );
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error("Failed to submit rating");
    }
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
            <TabsTrigger value="list">Spots</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
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
