import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser } from "../services/userServices";
import { useNotification } from "../../../context/NotificationContext";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("All");  // Role filter state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(10);  // Entries per page
  const navigate = useNavigate();
  const { notify } = useNotification();

  useEffect(() => {
    const getUsers = async () => {
      const result = await fetchUsers();
      if (result.error) notify(result.error, "error");
      else setUsers(result);
      setLoading(false);
    };
    getUsers();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);  // Reset to page 1 when searching
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);  // Reset to page 1 when changing role filter
  };

  const handleDelete = async (userId: number) => {
    const result = await deleteUser(userId);
    if (result === true) {
      setUsers(u => u.filter(x => x.id !== userId));
      notify("User deleted successfully", "success");
    } else {
      notify(result.error || "Failed to delete user", "error");
    }
  };

  const handleEdit = (user: User) => {
    navigate(`/admin/users/edit/${user.id}`, { state: { user } });
  };

  // Filtering based on search query and role
  const filtered = users.filter(u => 
    (roleFilter === "All" || u.role === roleFilter) &&  // Filter by role
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by search query
  );

  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const start = (currentPage - 1) * usersPerPage;
  const currentUsers = filtered.slice(start, start + usersPerPage);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="relative overflow-hidden shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 space-y-4 sm:space-y-0">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for users"
          className="p-2 text-sm border rounded w-full sm:w-80"
        />

        {/* Role filter dropdown */}
        <div className="flex items-center space-x-2">
          <span>Filter by role:</span>
          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="p-2 text-sm border rounded"
          >
            <option value="All">All</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="DRIVER">Driver</option>
            {/* Add more roles as necessary */}
          </select>
        </div>

        {/* Entries per page dropdown */}
        <div className="flex items-center space-x-2">
          <span>Show</span>
          <select
            value={usersPerPage}
            onChange={(e) => setUsersPerPage(Number(e.target.value))}
            className="p-2 text-sm border rounded"
          >
            {[10, 20, 30, 50].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3 hidden sm:table-cell">Role</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="text-center py-4">Loading...</td>
            </tr>
          ) : currentUsers.length > 0 ? (
            currentUsers.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">{user.role}</td>
                <td className="px-6 py-4 space-x-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:underline"
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:underline"
                  >Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
