import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from './LocationCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';

interface StudySpotMapProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}

const StudySpotMap = ({ locations, onLocationClick }: StudySpotMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    // Center on OSU campus
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-83.0302, 40.0067], // OSU coordinates
      zoom: 15,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add markers for each location
    locations.forEach((location) => {
      if (!location.coordinates) return;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontWeight = 'bold';
      el.style.fontSize = '12px';
      el.style.color = 'white';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      
      // Color based on occupancy
      if (location.occupancy < 50) {
        el.style.backgroundColor = 'hsl(var(--success))';
      } else if (location.occupancy < 75) {
        el.style.backgroundColor = 'hsl(var(--warning))';
      } else {
        el.style.backgroundColor = 'hsl(var(--destructive))';
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${location.name}</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 4px;">${location.occupancy}% full</p>
                <p style="font-size: 14px; color: #666;">${location.noiseLevel} • ${location.availableSeats} seats</p>
              </div>
            `)
        )
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onLocationClick?.(location);
      });

      markers.current.push(marker);
    });

    setTokenSubmitted(true);
  };

  useEffect(() => {
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  if (!tokenSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
        <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-xl font-semibold text-foreground">Enter Mapbox Token</h3>
        <p className="mb-6 text-sm text-muted-foreground max-w-md">
          To display the map, please enter your Mapbox public token. 
          Get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
        </p>
        <div className="flex w-full max-w-md gap-2">
          <Input
            type="text"
            placeholder="pk.eyJ1..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={initializeMap} disabled={!mapboxToken}>
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default StudySpotMap;
