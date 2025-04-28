import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { updateBus } from '../services/busServices';
import { useNotification } from '../../../context/NotificationContext';

interface IRouteStop {
  name: string;
  coordinates: [number, number];
}

interface Driver {
  _id: string;
  name: string;
  email: string;
}

interface IBus {
  _id: string;
  destination: string;
  driverId: Driver;
  stops: IRouteStop[];
}

export default function EditBus() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { busId } = useParams();

  // Use IBus object as the state
  const [bus, setBus] = useState<IBus>(location.state?.bus);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!bus || !busId) {
      notify('No bus data found. Redirecting...', 'error');
      navigate('/admin/buses');
    } else {
      setBus(bus);  // Directly set the bus data
    }
  }, [bus, busId, notify, navigate]);

  const handleRouteStopChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'name' | 'latitude' | 'longitude') => {
    const updatedStops = [...bus!.stops];
    if (field === 'name') {
      updatedStops[index].name = e.target.value;
    } else if (field === 'latitude') {
      updatedStops[index].coordinates[0] = parseFloat(e.target.value);
    } else if (field === 'longitude') {
      updatedStops[index].coordinates[1] = parseFloat(e.target.value);
    }
    setBus(prev => ({
      ...prev!,
      stops: updatedStops,
    }));
  };

  // Add a new route stop
  const handleAddRouteStop = () => {
    setBus(prev => ({
      ...prev!,
      stops: [...prev!.stops, { name: '', coordinates: [0, 0] }],
    }));
  };

  // Remove a route stop
  const handleRemoveRouteStop = (index: number) => {
    const updatedStops = bus!.stops.filter((_, i) => i !== index);
    setBus(prev => ({
      ...prev!,
      stops: updatedStops,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bus || !bus._id) {
      notify('Bus data is missing or invalid', 'error');
      return;
    }

    const { destination, driverId, stops } = bus;
    const { email } = driverId;

    // Ensure all fields are filled out, including 'stops'
    if (!destination || !email || !stops) {
      notify('Please fill in all required fields', 'error');
      return;
    }

    // Prepare the updated bus object, including all fields
    const updatedBus = {
      destination,
      driverId: email,  // Pass the email instead of the whole driver object
      stops,
    };

    setLoading(true);
    const result = await updateBus(bus._id, updatedBus);
    setLoading(false);

    if (result) {
      notify(result.message || 'Bus updated successfully', 'success');
      setTimeout(()=>navigate('/admin/buses'));
    } else {
      notify(result.message || 'Failed to update bus', 'error');
    }
  };

  if (!bus) {
    return <div className="p-4 text-red-600">Bus not found or data not available!</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Bus</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="destination" className="font-medium">Destination</label>
          <input
            type="text"
            id="destination"
            value={bus.destination}
            onChange={(e) => setBus({ ...bus, destination: e.target.value })}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="driverEmail" className="font-medium">Driver Email</label>
          <input
            type="email"
            id="driverEmail"
            value={bus.driverId.email}
            onChange={(e) => setBus({ ...bus, driverId: { ...bus.driverId, email: e.target.value } })}
            className="p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Route Stops</label>
          <div className="space-y-4">
            {bus.stops.map((stop, index) => (
              <div key={index} className="flex justify-between items-center space-x-4">
                <div className="flex-1">
                  <label className="block font-medium">Stop Name</label>
                  <input
                    type="text"
                    value={stop.name}
                    onChange={(e) => handleRouteStopChange(e, index, 'name')}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Stop Name"
                  />
                  <div className="flex space-x-2 mt-2">
                    <input
                      type="number"
                      step="any"
                      value={stop.coordinates[0]}
                      onChange={(e) => handleRouteStopChange(e, index, 'latitude')}
                      className="w-1/2 p-2 border border-gray-300 rounded"
                      placeholder="Latitude"
                    />
                    <input
                      type="number"
                      step="any"
                      value={stop.coordinates[1]}
                      onChange={(e) => handleRouteStopChange(e, index, 'longitude')}
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
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
