import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

type MapProps = {
  center: [number, number];
  zoom?: number;
  onMapReady: (map: mapboxgl.Map) => void;
};

const Map: React.FC<MapProps> = ({ center, zoom = 13, onMapReady }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom,
    });

    map.addControl(new mapboxgl.NavigationControl());
    onMapReady(map);

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh', zIndex: 0 }} />;
};

export default Map;
