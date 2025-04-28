import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboard } from '../services/dashboardServices';
import { useNotification } from '../../../context/NotificationContext';

const Dashboard = () => {
  const { notify } = useNotification();
  const [dashboard, setDashboard] = useState({ totalBuses: 0, totalDrivers: 0, activeBuses: 0 })

  // Fetch buses from the server
  useEffect(() => {
    const getBuses = async () => {
      const result = await fetchDashboard(); // Your API call to fetch buses
      if (result.error) notify(result.error, "error");
      else setDashboard(result);
    };
    getBuses();
  }, []);

  return (
    <div className=" min-h-[86.8vh] bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Buses</h2>
          <p className="text-3xl font-bold text-center">{dashboard.totalBuses}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Drivers</h2>
          <p className="text-3xl font-bold text-center">{dashboard.totalDrivers}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Active Buses</h2>
          <p className="text-3xl font-bold text-center">{dashboard.activeBuses}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Manage Buses and Drivers</h2>
        <div className="space-y-4">
          <Link to="/admin/buses" className="block text-lg text-blue-500 hover:underline">
            View Buses
          </Link>
          <Link to="/admin/add-bus" className="block text-lg text-blue-500 hover:underline">
            Add Bus
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
