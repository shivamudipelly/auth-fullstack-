import { Server, Socket } from 'socket.io';
import BusLocation from '../models/BusLocation';

// Define a type for Bus location updates
interface Bus {
    busId: string;
    lat: number;
    lng: number;
}

// Define events sent from client to server
interface ClientToServerEvents {
    joinBus: (payload: { busId: string }) => void;
    leaveBus: (payload: { busId: string }) => void;
    locationUpdate: (data: Bus) => void;
}

// Define events sent from server to client
interface ServerToClientEvents {
    busLocationUpdate: (data: Bus) => void;
}

export const handleSocketConnection = (
    io: Server<ClientToServerEvents, ServerToClientEvents>
) => {
    io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
        console.log('Client connected:', socket.id);

        // Client joins a room for a specific bus
        socket.on('joinBus', ({ busId }) => {
            socket.join(busId);
            console.log(`Client ${socket.id} joined bus ${busId}`);
        });

        // Client leaves a bus room
        socket.on('leaveBus', ({ busId }) => {
            socket.leave(busId);
            console.log(`Client ${socket.id} left bus ${busId}`);
        });

        // Process a location update event
        socket.on('locationUpdate', async (data: Bus) => {
            try {
                const { busId, lat, lng } = data;

                // Update existing location or create a new one for the bus
                const updatedLocation = await BusLocation.findOneAndUpdate(
                    { busId },
                    { latitude: lat, longitude: lng, timestamp: new Date() },
                    { new: true, upsert: true }
                );

                console.log(`Updated location for Bus ${busId}:`, updatedLocation);

                // Emit update only to clients subscribed to this bus
                io.to(busId).emit('busLocationUpdate', { busId, lat, lng });
            } catch (error) {
                console.error('Error updating location:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
