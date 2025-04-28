import axios from 'axios';

// Axios instance setup
export const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
    withCredentials: true,
});

// Interfaces for better type safety
interface ILocation {
    latitude: number;
    longitude: number;
}

interface IRouteStop {
    name: string;
    coordinates: [number, number];
}

interface IBus {
    busId: number;
    destination: string;
    driverId: string;
    location?: ILocation;
    stops: IRouteStop[];
}


export const createBus = async (busData: IBus) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.post("/api/buses/addBus", busData);
        return response.data;
    } catch (error) {
        throw error;
    }
};



// Fetch all buses from the backend
export const fetchBuses = async () => {
    try {
        const response = await api.get(`/api/buses/getAllBuses`);
        return response.data;
    } catch (error) {
        return error;
    }
};




// Delete a bus by ID (DELETE request)
export const deleteBus = async (busId: string) => {
    try {
        const response = await api.delete(`/api/buses/deleteBus/${busId}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

// Update bus data (PUT request)
export const updateBus = async (busId: string, busData: Partial<IBus>) => {
    try {
        const response = await api.put(`/api/buses/editBus/${busId}`, busData);
        return response.data;
    } catch (error) {
        return error;
    }
};
