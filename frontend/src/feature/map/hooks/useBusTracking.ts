// hooks/useBusTracking.ts
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { distanceBetween } from '../util/distance';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL!;
const MOVE_THRESHOLD = 10; // meters

export function useBusTracking(busId: string | null) {
    const socketRef = useRef<ReturnType<typeof io> | null>(null);
    const watchIdRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);
    const [tracking, setTracking] = useState(false);
    const [lastSentPos, setLastSentPos] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (busId) {
            socketRef.current = io(SOCKET_URL);
            return () => {
                socketRef.current?.disconnect();
            };
        }
    }, [busId]);

    const toggleTracking = () => setTracking((t) => !t);

    useEffect(() => {
        if (!tracking || !busId) {
            cleanup();
            return;
        }

        if (navigator.geolocation) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                ({ coords }) => {
                    const pos: [number, number] = [coords.longitude, coords.latitude];
                    if (!lastSentPos || distanceBetween(lastSentPos, pos) > MOVE_THRESHOLD) {
                        emit(pos);
                    }
                },
                (err) => console.error(err),
                { enableHighAccuracy: true, maximumAge: 1000 }
            );
        } else {
            console.error('Geolocation not supported');
        }

        intervalRef.current = window.setInterval(() => {
            if (lastSentPos) {
                emit(lastSentPos);
            }
        }, 2000);

        return cleanup;
    }, [tracking, lastSentPos, busId]);

    const emit = (pos: [number, number]) => {
        if (busId && socketRef.current) {
            socketRef.current.emit('locationUpdate', {
                busId,
                lng: pos[0],
                lat: pos[1],
            });
            setLastSentPos(pos);
        }
    };

    const cleanup = () => {
        if (watchIdRef.current != null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        if (intervalRef.current != null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    return { tracking, toggleTracking };
}
