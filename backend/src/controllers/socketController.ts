import { Server, Socket } from 'socket.io';
import Bus from '../models/Bus';

interface BusLocationUpdate {
  busId: string;
  lat: number;
  lng: number;
}

interface ClientToServerEvents {
  joinBus: (payload: { busId: string }) => void;
  leaveBus: (payload: { busId: string }) => void;
  locationUpdate: (data: BusLocationUpdate) => void;
}

interface ServerToClientEvents {
  busLocationUpdate: (data: BusLocationUpdate) => void;
}

export const handleSocketConnection = (
  io: Server<ClientToServerEvents, ServerToClientEvents>
) => {
  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('joinBus', async ({ busId }) => {
      socket.join(busId);
      console.log(`🚌 Client ${socket.id} joined room for Bus ${busId}`);

      try {
        // Optionally send the last known location immediately
        const existingBus = await Bus.findOne({ busId });
        if (existingBus) {
          socket.emit('busLocationUpdate', {
            busId,
            lat: existingBus.location.latitude,
            lng: existingBus.location.longitude,
          });
        } else {
          console.warn(`⚠️ Bus ${busId} not found in DB`);
        }
      } catch (error) {
        console.error(`❌ Error fetching bus location for ${busId}:`, error);
      }
    });

    socket.on('leaveBus', ({ busId }) => {
      socket.leave(busId);
      console.log(`🚪 Client ${socket.id} left room for Bus ${busId}`);
    });

    socket.on('locationUpdate', async ({ busId, lat, lng }) => {
      try {
        const updatedBus = await Bus.findOneAndUpdate(
          { busId },
          {
            location: {
              latitude: lat,
              longitude: lng,
              timestamp: new Date(),
            },
          },
          { new: true }
        );

        if (updatedBus) {
          console.log(`📍 Updated Bus ${busId} → ${lat}, ${lng}`);
          io.to(busId).emit('busLocationUpdate', { busId, lat, lng });
        } else {
          console.warn(`⚠️ Bus ${busId} not found in DB`);
        }
      } catch (error) {
        console.error(`❌ Error updating location for Bus ${busId}:`, error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
