import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import { io } from 'socket.io-client';
import axios from 'axios';
import Map from '../components/Map';
import RouteLayer from '../components/RouteLayer';
import BusMarker from '../components/BusMarker';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

type Stop = { name: string; coordinates: [number, number] };

interface DirectionsRoute {
  geometry: { type: 'LineString'; coordinates: [number, number][] };
}

export default function MapboxExample() {
  const { busId } = useParams<{ busId: string }>();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [route, setRoute] = useState<DirectionsRoute | null>(null);
  const [busPosition, setBusPosition] = useState<[number, number] | null>(null);
  const [stopsData, setStopsData] = useState<Stop[]>([]);

  const url = import.meta.env.VITE_SERVER_URL;


  // Ref to hold socket connection
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  // Fetch the bus stops and route from the API
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await axios.get(`${url}/api/buses/${busId}`, { withCredentials: true });
        const busData = response.data;

        if (busData && busData.stops) {
          setStopsData(busData.stops);
        }

        // Fetch route using Mapbox API
        if (busData?.stops && busData.stops.length > 0) {
          const coordStr = busData.stops.map((stop: Stop) => stop.coordinates.join(',')).join(';');
          const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordStr}` +
            `?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
          const res = await fetch(mapboxUrl);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            setRoute(data.routes[0] as DirectionsRoute);
          }
        }
      } catch (error) {
        console.error('Error fetching bus data:', error);
      }
    };

    if (busId) fetchApi();
  }, [busId, url]);

  // Socket setup
  useEffect(() => {
    if (!busId) return;

    // Connect only once
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL);

      socketRef.current.emit('joinBus', { busId });

      socketRef.current.on('busLocationUpdate', (data) => {
        if (data.busId === busId) {
          setBusPosition([data.lng, data.lat]);
        }
      });



      // Cleanup on component unmount or busId change
      return () => {
        if (socketRef.current) {
          socketRef.current.emit('leaveBus', { busId });
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [busId, route]);

  return (
    <div className="relative w-full min-h-screen">
      {/* Map */}
      {stopsData.length > 0 && <Map center={stopsData[0].coordinates} onMapReady={setMap} />}

      {/* Route */}
      {map && route && <RouteLayer map={map} route={route} stops={stopsData} />}

      {/* Bus Live Marker */}
      {map && busPosition && <BusMarker map={map} position={busPosition } />}
    </div>
  );
}
