import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBus } from "../services/busServices";
import { useNotification } from "../../../context/NotificationContext";
import { isAxiosError } from "axios";

interface IRouteStop {
    name: string;
    coordinates: [number, number];
}

interface IBus {
    busId: number;
    destination: string;
    driverId: string;
    stops: IRouteStop[];
}

export default function AddBus() {
    const navigate = useNavigate();
    const { notify } = useNotification();

    // Main form data including bus info and dynamic route stops
    const [formData, setFormData] = useState<IBus>({
        busId: 0,
        destination: "", // Static destination
        driverId: "", // Static driver email
        stops: [],
    });

    // Handle changes for bus info fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle changes for route stop fields (name, latitude, longitude)
    const handleRouteStopChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: "name" | "latitude" | "longitude") => {
        const updatedStops = [...formData.stops];
        if (field === "name") {
            updatedStops[index].name = e.target.value;
        } else if (field === "latitude") {
            updatedStops[index].coordinates[0] = parseFloat(e.target.value);
        } else if (field === "longitude") {
            updatedStops[index].coordinates[1] = parseFloat(e.target.value);
        }
        setFormData(prev => ({ ...prev, stops: updatedStops }));
    };

    // Add a new route stop
    const handleAddRouteStop = () => {
        setFormData(prev => ({
            ...prev,
            stops: [...prev.stops, { name: "", coordinates: [0, 0] }],
        }));
    };

    // Remove a route stop by index
    const handleRemoveRouteStop = (index: number) => {
        const updatedStops = formData.stops.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, stops: updatedStops }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await createBus(formData);
            console.log(result);

            notify(result.message || "Bus created successfully!", "success");
            setTimeout(() => navigate("/admin/buses"), 1500);
        } catch (error) {
            if (isAxiosError(error)) {
                notify(error.response?.data?.message || "Failed to create bus.", "error");
            } else {
                notify("Something went wrong.", "error");
            }
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Add New Bus</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Bus ID</label>
                    <input
                        name="busId"
                        type="number"
                        value={formData.busId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Bus ID"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Destination</label>
                    <input
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Destination Location"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Driver Email</label>
                    <input
                        name="driverId"
                        value={formData.driverId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Driver's Email"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Route Stops</label>
                    <div className="space-y-4">
                        {formData.stops.map((stop, index) => (
                            <div key={index} className="flex justify-between items-center space-x-4">
                                <div className="flex-1">
                                    <label className="block font-medium">Stop Name</label>
                                    <input
                                        type="text"
                                        value={stop.name}
                                        onChange={(e) => handleRouteStopChange(e, index, "name")}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        placeholder="Stop Name"
                                    />
                                    <div className="flex space-x-2 mt-2">
                                        <input
                                            type="number"
                                            step="any"
                                            value={stop.coordinates[0]}
                                            onChange={(e) => handleRouteStopChange(e, index, "latitude")}
                                            className="w-1/2 p-2 border border-gray-300 rounded"
                                            placeholder="Latitude"
                                        />
                                        <input
                                            type="number"
                                            step="any"
                                            value={stop.coordinates[1]}
                                            onChange={(e) => handleRouteStopChange(e, index, "longitude")}
                                            className="w-1/2 p-2 border border-gray-300 rounded"
                                            placeholder="Longitude"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveRouteStop(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddRouteStop}
                        className="mt-2 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Add Route Stop
                    </button>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create Bus
                </button>
            </form>
        </div>
    );
}
