// src/components/RouteLayer.tsx
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Feature, LineString } from 'geojson';

type Stop = { name: string; coordinates: [number, number] };

type RouteLayerProps = {
  map: mapboxgl.Map;
  route: { geometry: LineString };
  stops: Stop[];
};

const RouteLayer: React.FC<RouteLayerProps> = ({ map, route, stops }) => {
  useEffect(() => {
    const markers: mapboxgl.Marker[] = [];

    const addLayers = () => {
      // Add or update the route line
      const routeFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: route.geometry,
      };

      if (!map.getSource('route')) {
        map.addSource('route', {
          type: 'geojson',
          data: routeFeature,
        });
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#0078A8',
            'line-width': 4,
          },
        });
      } else {
        (map.getSource('route') as mapboxgl.GeoJSONSource).setData(routeFeature);
      }

      // Add stop markers
      stops.forEach((stop) => {
        const marker = new mapboxgl.Marker({ color: 'orange' })
          .setLngLat(stop.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(stop.name))
          .addTo(map);
        markers.push(marker);
      });
    };

    if (!map.isStyleLoaded()) {
      map.once('load', addLayers);
    } else {
      addLayers();
    }

    return () => {
      // Clean up route
      if (map.getLayer('route-line')) map.removeLayer('route-line');
      if (map.getSource('route')) map.removeSource('route');

      // Clean up markers
      markers.forEach((marker) => marker.remove());
    };
  }, [map, route.geometry, stops]);

  return null;
};

export default RouteLayer;
