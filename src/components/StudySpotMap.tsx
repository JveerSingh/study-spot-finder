import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from './LocationCard';

interface StudySpotMapProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGh3YW5pdDEwIiwiYSI6ImNtaTBoY2h3cjA3YjcyaXExd2hvcXpsenYifQ.gtR2uQQrt2va150pCARd9Q';

const StudySpotMap = ({ locations, onLocationClick }: StudySpotMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
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

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [locations, onLocationClick]);

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default StudySpotMap;
