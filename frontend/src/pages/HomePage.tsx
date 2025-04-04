import { Link } from 'react-router-dom';

const HomePage = () => {
  const busRoutes = [
    { id: 1, routeNumber: '101', destination: 'Main Campus', nextArrival: '10:15 AM', status: 'On Time' },
    { id: 2, routeNumber: '202', destination: 'Hostel Area', nextArrival: '10:30 AM', status: 'Delayed' },
    { id: 3, routeNumber: '303', destination: 'Library Block', nextArrival: '10:45 AM', status: 'On Time' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Hero Section */}
      <div className="bg-blue-500 text-white py-20 md:py-32 lg:py-40">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Anurag University Bus Tracker</h2>
          <p className="text-lg md:text-xl mb-8">Real-time tracking for college bus schedules and routes</p>
          <div className="max-w-2xl mx-auto bg-white rounded-full p-2 shadow-lg">
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Search by route number or destination..."
                className="flex-1 px-6 py-3 text-gray-800 rounded-full focus:outline-none"
              />
              <button className="bg-blue-600 text-white px-6 md:px-8 py-3 rounded-full hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="container mx-auto my-16 px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">System Overview</h3>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Track Anurag University buses in real-time, view schedules, and get updates on arrivals and delays.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-blue-600 text-5xl mb-4">🚌</div>
            <h4 className="text-xl font-bold mb-2">Live Tracking</h4>
            <p className="text-gray-600">Get live updates on bus locations and estimated arrival times.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-blue-600 text-5xl mb-4">📅</div>
            <h4 className="text-xl font-bold mb-2">Timetable</h4>
            <p className="text-gray-600">Check the latest bus schedules and routes.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-blue-600 text-5xl mb-4">🔔</div>
            <h4 className="text-xl font-bold mb-2">Instant Alerts</h4>
            <p className="text-gray-600">Stay informed about delays and schedule changes.</p>
          </div>
        </div>
      </div>

      {/* Bus Schedule Table */}
      <div className="container mx-auto px-4 mb-16">
        <h3 className="text-3xl font-bold mb-6 text-center">Bus Schedule</h3>
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Route</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Destination</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Next Arrival</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {busRoutes.map((bus) => (
                <tr key={bus.id} className="text-center">
                  <td className="px-6 py-4 whitespace-nowrap">{bus.routeNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bus.destination}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bus.nextArrival}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${bus.status === 'On Time' ? 'bg-green-100 text-green-800' :
                      bus.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {bus.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600 text-white py-20 flex flex-col items-center text-center px-6">
        <h3 className="text-3xl font-bold mb-4">Track Your Bus in Real Time!</h3>
        <p className="mb-6 text-lg max-w-xl">
          Never miss your college bus again. Get live updates, route details, and instant alerts.
        </p>
        <button className="bg-white text-blue-600 font-semibold px-10 py-4 rounded-full text-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-100">
          <Link to="/login">Start Tracking Now 🚀</Link>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
