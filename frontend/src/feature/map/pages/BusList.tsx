import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BusCard from '../components/BusCard'; // Import BusCard component
import { URL } from '../../../constant';

// Types for Bus, Driver, Location
interface Driver {
    _id: string;
    name: string;
    email: string;
}

interface Location {
    latitude: number;
    longitude: number;
    _id: string;
}

interface Bus {
    _id: string;  // Added _id for MongoDB document reference
    busId: number;
    destination: string;  // Fixed the mismatch with route
    driverId: Driver;  // Changed to reference the Driver object directly
    location: Location;
    stops: {
        name: string;
        coordinates: [number, number];
    }[];
}

const BusesList: React.FC = () => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const navigate = useNavigate();
    console.log(buses);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const res = await axios.get(`${URL}/api/buses/getAllBuses`);
                setBuses(res.data);
            } catch (error) {
                console.error('Error fetching buses:', error);
            }
        };

        fetchBuses();
    }, []);

    const handleBusClick = (busId: string) => {  // Changed busId to string (MongoDB _id)
        navigate(`/buses/map/${busId}`);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-center text-3xl font-semibold mb-8">Available Buses</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {buses.map((bus) => (
                    <BusCard
                        key={bus._id} 
                        busId={String(bus.busId)}
                        destination={bus.destination}  
                        driver={bus.driverId} 
                        onBusClick={handleBusClick}
                        stops={bus.stops}
                    />
                ))}
            </div>
        </div>
    );
};

export default BusesList;
