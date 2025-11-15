-- Add noise_level column to location_crowdedness_ratings table
ALTER TABLE public.location_crowdedness_ratings
ADD COLUMN noise_level integer;

-- Add check constraint to ensure noise_level is between 1 and 10
ALTER TABLE public.location_crowdedness_ratings
ADD CONSTRAINT noise_level_range CHECK (noise_level >= 1 AND noise_level <= 10);