import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from './LocationCard';
import { Event } from './EventCard';

interface StudySpotMapProps {
  locations: Location[];
  events?: Event[];
  onLocationClick?: (location: Location) => void;
  onEventClick?: (event: Event) => void;
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGh3YW5pdDEwIiwiYSI6ImNtaTBoY2h3cjA3YjcyaXExd2hvcXpsenYifQ.gtR2uQQrt2va150pCARd9Q';

const StudySpotMap = ({ locations, events = [], onLocationClick, onEventClick }: StudySpotMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    // Center on OSU campus to show all locations from north to south campus
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-83.0270, 40.0050], // OSU campus center
      zoom: 14,
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
      
      // Color based on location type
      if (location.type === 'dining') {
        el.style.backgroundColor = 'hsl(var(--warning))';
      } else {
        el.style.backgroundColor = 'hsl(var(--primary))';
      }

      const crowdednessRating = location.crowdednessRating || 0;
      const noiseLevelRating = location.noiseLevelRating || 0;
      const crowdednessColor = crowdednessRating <= 3 ? '#10b981' : crowdednessRating <= 6 ? '#f59e0b' : '#ef4444';
      const noiseLabels: Record<string, string> = {
        silent: 'Silent',
        quiet: 'Quiet',
        moderate: 'Moderate',
        loud: 'Loud'
      };
      const noiseColors: Record<string, string> = {
        silent: '#10b981',
        quiet: '#10b981',
        moderate: '#f59e0b',
        loud: '#ef4444'
      };

      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 12px; min-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 12px; font-size: 15px;">${location.name}</h3>
                
                <div style="margin-bottom: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 13px; color: #666;">Crowdedness</span>
                    <span style="font-size: 12px; font-weight: 600; color: ${crowdednessColor};">${crowdednessRating}/10</span>
                  </div>
                  <div style="height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                    <div style="height: 100%; width: ${crowdednessRating * 10}%; background: ${crowdednessColor}; transition: width 0.3s;"></div>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 13px; color: #666;">Noise Level</span>
                    <span style="font-size: 12px; font-weight: 600; color: ${noiseColors[location.noiseLevel]};">${noiseLabels[location.noiseLevel]}</span>
                  </div>
                  <div style="height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                    <div style="height: 100%; width: ${noiseLevelRating * 10}%; background: ${noiseColors[location.noiseLevel]}; transition: width 0.3s;"></div>
                  </div>
                </div>
              </div>
            `)
        )
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onLocationClick?.(location);
      });

      markers.current.push(marker);
    });

    // Add markers for each event
    events.forEach((event) => {
      const location = locations.find(loc => loc.id === event.locationId);
      if (!location?.coordinates) return;

      // Create custom event marker element
      const el = document.createElement('div');
      el.className = 'custom-event-marker';
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontWeight = 'bold';
      el.style.fontSize = '16px';
      el.style.color = 'white';
      el.style.backgroundColor = 'hsl(var(--primary))';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 3px 12px rgba(0,0,0,0.3)';
      el.innerHTML = '📅';

      const checkInCount = event.checkInCount || 0;

      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25, maxWidth: '300px' })
            .setHTML(`
              <div style="padding: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="font-size: 20px;">📅</span>
                  <h3 style="font-weight: bold; font-size: 16px; margin: 0;">${event.name}</h3>
                </div>
                <p style="font-size: 13px; color: #666; margin-bottom: 8px; line-height: 1.4;">${event.description}</p>
                <div style="background: #f5f5f5; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
                  <p style="font-size: 13px; color: #333; margin: 0; display: flex; align-items: center; gap: 4px;">
                    <span>📍</span>
                    <strong>${location.name}</strong>
                  </p>
                </div>
                <div style="display: flex; gap: 12px; font-size: 13px; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <span>✅</span>
                    <span><strong>${checkInCount}</strong> checked in</span>
                  </div>
                </div>
                <p style="font-size: 12px; color: #999; margin: 0;">🕐 ${event.timestamp}</p>
              </div>
            `)
        )
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onEventClick?.(event);
      });

      markers.current.push(marker);
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [locations, events, onLocationClick, onEventClick]);

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default StudySpotMap;
