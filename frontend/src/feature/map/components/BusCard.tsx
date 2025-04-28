import React from 'react';

interface Driver {
    name: string;
    email: string;
}

interface BusCardProps {
    stops: {
        name: string;
        coordinates: [number, number];
    }[];
    busId: string;  // busId should be a string, as we are using MongoDB _id
    destination: string;  // Replace 'route' with 'destination'
    driver: Driver;  // Driver is passed as the full object
    onBusClick: (busId: string) => void;  // busId passed as string
}

const BusCard: React.FC<BusCardProps> = ({ busId, destination, stops, driver, onBusClick }) => {
    // Capitalize the first letter of the driver's name
    const formattedDriverName = driver?.name.charAt(0).toUpperCase() + driver?.name.slice(1).toLowerCase();

    return (
        <div
            key={busId}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
            <img
                src="https://images.unsplash.com/photo-1722791438165-be7cf02adad7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJ1cyUyMHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D"
                alt="Bus"
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{destination}</h2> {/* Use destination instead of route */}

                <ul className="text-gray-600 mb-4">
                    <li><strong>Driver Name:</strong> {formattedDriverName || 'N/A'}</li>
                    <li><strong>Driver Email:</strong> {driver.email || 'N/A'}</li>
                </ul>
                <div className="p-2">
                    <strong>Stops</strong>
                    <ul className="text-gray-600 mb-4 list-disc list-inside max-h-[120px] overflow-y-auto w-64">
                        {stops.map((stop, index) => (
                            <li key={index}>
                                {stop.name}
                            </li>
                        ))}
                    </ul>
                </div>



                <button
                    onClick={() => onBusClick(busId)}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all cursor-pointer"
                >
                    View on Map
                </button>
            </div>

        </div>
    );
};

export default BusCard;
