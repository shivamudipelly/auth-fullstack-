import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Bus } from '../../../assets'; // your bus PNG or SVG

type BusMarkerProps = {
  map: mapboxgl.Map;
  position: [number, number]; // position from server every 2 sec
  defaultZoom?: number;
};

const BusMarker: React.FC<BusMarkerProps> = ({ map, position, defaultZoom = 16 }) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const animationRef = useRef<number | null>(null);

  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [targetPos, setTargetPos] = useState<[number, number] | null>(null);
  const [follow, setFollow] = useState(true);

  // Initialize marker
  useEffect(() => {
    if (!map) return;

    if (!markerRef.current) {
      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.backgroundImage = `url(${Bus})`;
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat(position)
        .addTo(map);

      setCurrentPos(position);
      setTargetPos(position);
    }
  }, [map, position]);

  // Update target position when new data arrives
  useEffect(() => {
    if (!targetPos) return;
    setTargetPos(position);
  }, [position]);

  // Animate movement toward targetPos
  useEffect(() => {
    if (!map || !markerRef.current || !currentPos || !targetPos) return;

    const speed = 0.0003; // Adjust this for smoothness (smaller = slower)

    const move = () => {
      const [currLng, currLat] = currentPos;
      const [tgtLng, tgtLat] = targetPos;

      const dx = tgtLng - currLng;
      const dy = tgtLat - currLat;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < speed) {
        setCurrentPos([tgtLng, tgtLat]);
        markerRef.current?.setLngLat([tgtLng, tgtLat]);
        return;
      }

      const ratio = speed / distance;
      const newLng = currLng + dx * ratio;
      const newLat = currLat + dy * ratio;

      markerRef.current?.setLngLat([newLng, newLat]);
      setCurrentPos([newLng, newLat]);

      if (follow) {
        map.easeTo({
          center: [newLng, newLat],
          zoom: defaultZoom,
          duration: 300,
          easing: (t) => t * (2 - t),
        });
      }

      animationRef.current = requestAnimationFrame(move);
    };

    animationRef.current = requestAnimationFrame(move);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentPos, targetPos, map, follow, defaultZoom]);

  // Disable follow when user interacts
  useEffect(() => {
    if (!map) return;

    const disableFollow = () => setFollow(false);

    map.on('dragstart', disableFollow);
    map.on('zoomstart', disableFollow);
    map.on('rotatestart', disableFollow);
    map.on('pitchstart', disableFollow);

    return () => {
      map.off('dragstart', disableFollow);
      map.off('zoomstart', disableFollow);
      map.off('rotatestart', disableFollow);
      map.off('pitchstart', disableFollow);
    };
  }, [map]);

  // Recenter manually
  const handleRecenter = () => {
    if (!map || !currentPos) return;
    setFollow(true);
    map.easeTo({
      center: currentPos,
      zoom: defaultZoom,
      duration: 500,
      easing: (t) => t * (2 - t),
    });
  };

  return (
    <>
      {!follow && (
        <button
          onClick={handleRecenter}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 w-16 h-16 lg:w-12 lg:h-12 lg:text-2xl bg-blue-500 text-white border-none rounded-full shadow-md text-4xl flex items-center justify-center transform -rotate-90 cursor-pointer z-50"
          aria-label="Recenter on Bus"
          title="Recenter on Bus"
        >
          ➤
        </button>
      )}
    </>
  );
};

export default BusMarker;
