-- Add location coordinates to events table
ALTER TABLE public.events
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION;

-- Drop old rating tables
DROP TABLE IF EXISTS public.event_ratings CASCADE;
DROP TABLE IF EXISTS public.event_crowdedness_ratings CASCADE;

-- Create event check-ins table (for +1s)
CREATE TABLE public.event_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create comprehensive event ratings table
CREATE TABLE public.event_comprehensive_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  crowdedness_rating INTEGER CHECK (crowdedness_rating >= 1 AND crowdedness_rating <= 5),
  noise_level_rating INTEGER CHECK (noise_level_rating >= 1 AND noise_level_rating <= 5),
  fun_level_rating INTEGER CHECK (fun_level_rating >= 1 AND fun_level_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.event_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_comprehensive_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for check-ins
CREATE POLICY "Anyone can view check-ins"
  ON public.event_check_ins
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can check in"
  ON public.event_check_ins
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins"
  ON public.event_check_ins
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for comprehensive ratings
CREATE POLICY "Anyone can view ratings"
  ON public.event_comprehensive_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate"
  ON public.event_comprehensive_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON public.event_comprehensive_ratings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON public.event_comprehensive_ratings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for ratings updated_at
CREATE TRIGGER on_comprehensive_rating_updated
  BEFORE UPDATE ON public.event_comprehensive_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_check_ins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_comprehensive_ratings;