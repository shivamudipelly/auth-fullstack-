import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBuses, deleteBus } from "../services/busServices"; // Assuming you have these functions
import { useNotification } from "../../../context/NotificationContext"; // Assuming you have a Notification Context
import { isAxiosError } from "axios";

interface Location {
  latitude: number;
  longitude: number;
}

interface Driver {
  _id: string;
  name: string;
  email: string;
}

interface IRouteStop {
  name: string;
  coordinates: [number, number];
}

interface IBus {
  _id: string;
  busId: number;
  destination: string;
  driverId: Driver;
  location: Location;
  stops: IRouteStop[];
}

export default function BusTable() {
  const [buses, setBuses] = useState<IBus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [busesPerPage] = useState<number>(10); // Entries per page
  const navigate = useNavigate();
  const { notify } = useNotification();

  // Fetch buses from the server
  useEffect(() => {
    const getBuses = async () => {
      try {
        const result: IBus[] = await fetchBuses(); // Your API call to fetch buses
        if (result.length === 0) {
          notify("No Buses Found!", "success");
        } else {
          setBuses(result);
          notify("Buses fetched successfully", "success");
        }
      } catch (error) {
        if (isAxiosError(error))
          notify("Error fetching buses. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };
    getBuses();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const handleDelete = async (busId: string) => {
    try {
      const result = await deleteBus(busId); // Your API call to delete bus
      if (result?.error) {
        notify(result.message || "Failed to delete bus", "error");
      } else {
        setBuses((b) => b.filter((x) => x._id !== busId));
        notify(result?.message || "Bus deleted successfully", "success");
      }
    } catch (error) {
      if (isAxiosError(error))
        notify("Error deleting bus. Please try again.", "error");
    }
  };

  const handleEdit = (bus: IBus) => {
    navigate(`/admin/buses/editBus/${bus._id}`, { state: { bus } });
  };

  // Filtering buses based on search query
  const filtered = buses.filter(
    (b) =>
      (b.destination && b.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b._id.toString().includes(searchQuery)
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / busesPerPage);
  const start = (currentPage - 1) * busesPerPage;
  const currentBuses = filtered.slice(start, start + busesPerPage);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };



  const formatDestination = (destination: string): string => {
    // Trim the destination string to remove leading/trailing spaces
    const trimmedDestination = destination.trim();

    // Capitalize the first letter of each word
    const formattedDestination = trimmedDestination
      .split(' ')  // Split by spaces
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize each word
      .join(' ');  // Join them back into a single string

    // Return the formatted destination
    return `Anurag University - ${formattedDestination}`;
  };




  return (
    <div className="relative overflow-hidden shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 space-y-4 sm:space-y-0">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for buses"
          className="p-2 text-sm border rounded w-full sm:w-80"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Bus ID</th>
              <th className="px-6 py-3">Route</th>
              <th className="px-6 py-3">Driver</th>
              <th className="px-6 py-3">No Bus Stops</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : currentBuses.length > 0 ? (
              currentBuses.map((bus) => (
                <tr key={bus._id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{bus.busId}</td>
                  <td className="px-6 py-4">{formatDestination(bus.destination)}</td>
                  <td className="px-6 py-4">
                    {typeof bus.driverId === "object" ? (
                      <>
                        <div className="font-semibold">{bus.driverId.name}</div>
                        <div className="text-gray-500">{bus.driverId.email}</div>
                      </>
                    ) : (
                      bus.driverId // If it's not an object, display the driverId (e.g., email)
                    )}
                  </td>
                  <td>
                    {bus.stops.length}
                  </td>
                  <td className="px-6 py-4 space-x-4">
                    <button
                      onClick={() => handleEdit(bus)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bus._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No buses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav aria-label="Page navigation" className="flex justify-center p-4">
        <ul className="inline-flex -space-x-px text-sm">
          {/* Previous */}
          <li>
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 h-8 leading-tight border border-e-0 rounded-s-lg flex items-center justify-center
                ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
            >
              Previous
            </button>
          </li>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page}>
              <button
                onClick={() => goTo(page)}
                className={`px-3 h-8 leading-tight border
                  ${page === currentPage
                    ? "bg-blue-50 text-blue-600 border-blue-300"
                    : "bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700"}`}
              >
                {page}
              </button>
            </li>
          ))}

          {/* Next */}
          <li>
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 h-8 leading-tight border rounded-e-lg flex items-center justify-center
                ${currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
