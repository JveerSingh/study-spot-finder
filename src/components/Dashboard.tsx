import { useState, useEffect } from "react";
import { Search, Plus, Building2, BookOpen, UtensilsCrossed, Map, Calendar, ArrowUpDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import LocationCard, { Location } from "./LocationCard";
import RatingDialog from "./RatingDialog";
import StudySpotMap from "./StudySpotMap";
import EventCard, { Event } from "./EventCard";
import AddEventDialog from "./AddEventDialog";
import ComprehensiveEventRating from "./ComprehensiveEventRating";
import LocationEventsDialog from "./LocationEventsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { getLocations, spotLocations } from "@/data/locations";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Get locations from centralized data source
const mockLocations: Location[] = getLocations();

// Helper function to calculate distance between two coordinates in meters
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedLocationForEvents, setSelectedLocationForEvents] = useState<string | null>(null);
  const [locations, setLocations] = useState(mockLocations);
  const [events, setEvents] = useState<Event[]>([]);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | "study" | "dining">("all");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [sortBy, setSortBy] = useState<"distance" | "crowdedness" | "noise" | "default">("default");

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location access denied or unavailable:", error);
        }
      );
    }

    // Fetch crowdedness ratings for locations
    fetchLocationRatings();
  }, []);

  const fetchLocationRatings = async () => {
    try {
      const { data: ratings } = await supabase
        .from('location_crowdedness_ratings')
        .select('location_id, rating, noise_level');

      if (ratings) {
        // Calculate average ratings for each location
        const locationRatings = ratings.reduce((acc: any, rating: any) => {
          if (!acc[rating.location_id]) {
            acc[rating.location_id] = { crowdednessSum: 0, noiseSum: 0, count: 0, noiseCount: 0 };
          }
          acc[rating.location_id].crowdednessSum += rating.rating;
          acc[rating.location_id].count += 1;
          if (rating.noise_level) {
            acc[rating.location_id].noiseSum += rating.noise_level;
            acc[rating.location_id].noiseCount += 1;
          }
          return acc;
        }, {});

        // Update locations with crowdedness, noise ratings, and distance
        setLocations(mockLocations.map(location => {
          const distance = userLocation && location.latitude && location.longitude
            ? calculateDistance(userLocation.latitude, userLocation.longitude, location.latitude, location.longitude)
            : undefined;

          return {
            ...location,
            crowdednessRating: locationRatings[location.id]
              ? locationRatings[location.id].crowdednessSum / locationRatings[location.id].count
              : 0,
            noiseLevelRating: locationRatings[location.id]?.noiseCount > 0
              ? locationRatings[location.id].noiseSum / locationRatings[location.id].noiseCount
              : undefined,
            ratingCount: locationRatings[location.id]?.count || 0,
            distance,
          };
        }));
      }
    } catch (error) {
      console.error('Error fetching location ratings:', error);
    }
  };

  // Set up realtime subscription for location ratings
  useEffect(() => {
    const channel = supabase
      .channel('location-ratings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'location_crowdedness_ratings'
        },
        () => {
          fetchLocationRatings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userLocation]);

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
          table: 'event_check_ins'
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
          table: 'event_comprehensive_ratings'
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, userLocation]);

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      if (eventsData) {
        const eventsWithData = await Promise.all(
          eventsData.map(async (event) => {
            // Fetch check-ins
            const { data: checkIns, count: checkInCount } = await supabase
              .from('event_check_ins')
              .select('*', { count: 'exact' })
              .eq('event_id', event.id);

            const isCheckedIn = checkIns?.some(ci => ci.user_id === currentUserId) || false;

            // Fetch ratings
            const { data: ratings } = await supabase
              .from('event_comprehensive_ratings')
              .select('*')
              .eq('event_id', event.id);

            const timestamp = new Date(event.created_at).toLocaleString();

            // Calculate distance if user location is available
            const distance = userLocation && event.latitude && event.longitude
              ? calculateDistance(userLocation.latitude, userLocation.longitude, event.latitude, event.longitude)
              : undefined;

            return {
              id: event.id,
              name: event.name,
              description: event.description,
              locationId: event.location_id,
              locationName: event.location_name,
              timestamp,
              checkInCount: checkInCount || 0,
              isCheckedIn,
              crowdednessRatings: ratings?.map(r => r.crowdedness_rating).filter(r => r !== null) as number[] || [],
              noiseLevelRatings: ratings?.map(r => r.noise_level_rating).filter(r => r !== null) as number[] || [],
              funLevelRatings: ratings?.map(r => r.fun_level_rating).filter(r => r !== null) as number[] || [],
              latitude: event.latitude,
              longitude: event.longitude,
              distance,
            };
          })
        );

        // Sort events by check-in count (most verified first)
        eventsWithData.sort((a, b) => b.checkInCount - a.checkInCount);

        setEvents(eventsWithData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.building.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || location.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Sort locations based on selected sort option
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        if (!a.distance && !b.distance) return 0;
        if (!a.distance) return 1;
        if (!b.distance) return -1;
        return a.distance - b.distance;
      case "crowdedness":
        return (b.crowdednessRating || 0) - (a.crowdednessRating || 0);
      case "noise":
        return (a.noiseLevelRating || 0) - (b.noiseLevelRating || 0);
      default:
        return 0;
    }
  });

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort events based on selected sort option
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        if (!a.distance && !b.distance) return 0;
        if (!a.distance) return 1;
        if (!b.distance) return -1;
        return a.distance - b.distance;
      case "crowdedness":
        const avgCrowdednessA = a.crowdednessRatings.length > 0
          ? a.crowdednessRatings.reduce((sum, r) => sum + r, 0) / a.crowdednessRatings.length
          : 0;
        const avgCrowdednessB = b.crowdednessRatings.length > 0
          ? b.crowdednessRatings.reduce((sum, r) => sum + r, 0) / b.crowdednessRatings.length
          : 0;
        return avgCrowdednessB - avgCrowdednessA;
      case "noise":
        const avgNoiseA = a.noiseLevelRatings.length > 0
          ? a.noiseLevelRatings.reduce((sum, r) => sum + r, 0) / a.noiseLevelRatings.length
          : 0;
        const avgNoiseB = b.noiseLevelRatings.length > 0
          ? b.noiseLevelRatings.reduce((sum, r) => sum + r, 0) / b.noiseLevelRatings.length
          : 0;
        return avgNoiseA - avgNoiseB;
      default:
        return b.checkInCount - a.checkInCount; // Default sort by check-ins
    }
  });

  const getEventsForLocation = (locationId: string) => {
    return events.filter((event) => event.locationId === locationId);
  };

  const selectedLocation = locations.find((l) => l.id === selectedLocationForEvents);
  const locationEvents = selectedLocationForEvents
    ? getEventsForLocation(selectedLocationForEvents)
    : [];

  const handleAddEvent = async (eventData: {
    name: string;
    description: string;
    locationId: string;
    latitude?: number;
    longitude?: number;
  }) => {
    const location = locations.find((l) => l.id === eventData.locationId);
    if (!location) return;

    // Get location coordinates from spotLocations
    const spotLocation = spotLocations.find(sl => sl.id === eventData.locationId);
    const latitude = spotLocation?.location.latitude;
    const longitude = spotLocation?.location.longitude;

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
          latitude,
          longitude,
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

  const handleCheckIn = async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to check in");
        return;
      }

      // Get user's current location
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser");
        return;
      }

      const { error } = await supabase
        .from('event_check_ins')
        .insert({
          event_id: eventId,
          user_id: user.id,
          latitude: 0.0,
          longitude: 0.0,
        });

      if (error) throw error;

      toast.success("Checked in successfully!");

      // Open rating dialog
      setSelectedEventId(eventId);
      setRatingDialogOpen(true);
    } catch (error: any) {
      console.error('Error checking in:', error);
      if (error.code === '23505') {
        toast.error("You've already checked in to this event");
      } else {
        toast.error("Failed to check in");
      }
    }
  };

  const handleSubmitRating = async (ratings: {
    crowdedness?: number;
    noiseLevel?: number;
    funLevel?: number;
  }) => {
    if (!selectedEventId || !currentUserId) return;

    try {
      const { error } = await supabase
        .from('event_comprehensive_ratings')
        .upsert({
          event_id: selectedEventId,
          user_id: currentUserId,
          crowdedness_rating: ratings.crowdedness || null,
          noise_level_rating: ratings.noiseLevel || null,
          fun_level_rating: ratings.funLevel || null,
        });

      if (error) throw error;

      toast.success("Ratings submitted!");
    } catch (error) {
      console.error('Error submitting ratings:', error);
      toast.error("Failed to submit ratings");
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

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-1 text-2xl font-bold text-foreground">Find your place on campus</h2>
          <p className="text-sm text-muted-foreground">
            Real-time availability across OSU
          </p>
        </div>

        {/* Tabs for List/Map/Events View */}
        <Tabs defaultValue="list" className="w-full">
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="list" className="gap-2">
                <Building2 className="h-4 w-4" />
                Spots
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <Map className="h-4 w-4" />
                Map
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search spot names or buildings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter for Spots */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={typeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter("all")}
                  className="gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  All Spots
                </Button>
                <Button
                  variant={typeFilter === "study" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter("study")}
                  className="gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Study Spots
                </Button>
                <Button
                  variant={typeFilter === "dining" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter("dining")}
                  className="gap-2"
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  Dining Halls
                </Button>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="crowdedness">Crowdedness</SelectItem>
                    <SelectItem value="noise">Noise Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {sortedLocations.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sortedLocations.map((location) => (
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

          <TabsContent value="map" className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search spot names or buildings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter for Map */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("all")}
                className="gap-2"
              >
                <Building2 className="h-4 w-4" />
                All Spots
              </Button>
              <Button
                variant={typeFilter === "study" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("study")}
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Study Spots
              </Button>
              <Button
                variant={typeFilter === "dining" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("dining")}
                className="gap-2"
              >
                <UtensilsCrossed className="h-4 w-4" />
                Dining Halls
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-card overflow-hidden">
              <StudySpotMap
                locations={sortedLocations}
                events={sortedEvents}
                onLocationClick={(location) => {
                  const element = document.getElementById(`location-${location.id}`);
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="space-y-6">
              {/* Search Bar for Events */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search event names or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h3 className="text-lg font-bold">Upcoming Events</h3>
                  <p className="text-sm text-muted-foreground">Study groups and activities</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:w-auto w-full">
                  {/* Sort Filter */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Most Popular</SelectItem>
                        <SelectItem value="distance">Distance</SelectItem>
                        <SelectItem value="crowdedness">Crowdedness</SelectItem>
                        <SelectItem value="noise">Noise Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setAddEventOpen(true)} className="gap-2 sm:w-auto w-full">
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              ) : sortedEvents.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onCheckIn={handleCheckIn}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No events found. Create one to get started!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <RatingDialog
          open={selectedLocationId !== null}
          onOpenChange={(open) => !open && setSelectedLocationId(null)}
          locationName={locations.find(l => l.id === selectedLocationId)?.name || ""}
          locationId={selectedLocationId || ""}
        />

        <AddEventDialog
          open={addEventOpen}
          onOpenChange={setAddEventOpen}
          locations={locations}
          onAddEvent={handleAddEvent}
        />

        <ComprehensiveEventRating
          open={ratingDialogOpen}
          onOpenChange={setRatingDialogOpen}
          onSubmit={handleSubmitRating}
          eventName={selectedEvent?.name || ""}
        />

        <LocationEventsDialog
          open={selectedLocationForEvents !== null}
          onOpenChange={(open) => !open && setSelectedLocationForEvents(null)}
          location={selectedLocation}
          events={locationEvents}
          onCheckIn={handleCheckIn}
        />
      </div>
    </section>
  );
};

export default Dashboard;
