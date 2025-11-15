-- Create location crowdedness ratings table
CREATE TABLE public.location_crowdedness_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(location_id, user_id)
);

-- Enable RLS
ALTER TABLE public.location_crowdedness_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view location ratings"
  ON public.location_crowdedness_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate locations"
  ON public.location_crowdedness_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own location ratings"
  ON public.location_crowdedness_ratings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own location ratings"
  ON public.location_crowdedness_ratings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER on_location_rating_updated
  BEFORE UPDATE ON public.location_crowdedness_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.location_crowdedness_ratings;