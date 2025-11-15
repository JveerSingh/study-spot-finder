-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location_id TEXT NOT NULL,
  location_name TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event ratings table
CREATE TABLE public.event_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create event crowdedness ratings table
CREATE TABLE public.event_crowdedness_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_crowdedness_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can view events"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON public.events
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events"
  ON public.events
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events"
  ON public.events
  FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for event_ratings
CREATE POLICY "Anyone can view event ratings"
  ON public.event_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate events"
  ON public.event_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON public.event_ratings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON public.event_ratings
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for event_crowdedness_ratings
CREATE POLICY "Anyone can view crowdedness ratings"
  ON public.event_crowdedness_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate crowdedness"
  ON public.event_crowdedness_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crowdedness ratings"
  ON public.event_crowdedness_ratings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crowdedness ratings"
  ON public.event_crowdedness_ratings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for events updated_at
CREATE TRIGGER on_event_updated
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for events
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_ratings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_crowdedness_ratings;