import React, { useState } from "react";
import { Home, Users, LogOut, Menu, X, PlusCircle, BusFront } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const baseNavItems = [
  { name: "Dashboard", icon: <Home size={20} />, path: "/admin" },
  { name: "Users", icon: <Users size={20} />, path: "/admin/users" },
  { name: "Buses", icon: <BusFront size={20} />, path: "/admin/buses" },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const extraNavItems = () => {
    if (location.pathname.startsWith("/admin/users")) {
      return [
        { name: "Dashboard", icon: <Home size={20} />, path: "/admin" },
        { name: "Users", icon: <Users size={20} />, path: "/admin/users" },
        { name: "Add User", icon: <PlusCircle size={20} />, path: "/admin/users/addUser" },
      ];
    }
    if (location.pathname.startsWith("/admin/buses")) {
      return [
        { name: "Dashboard", icon: <Home size={20} />, path: "/admin" },
        { name: "Buses", icon: <BusFront size={20} />, path: "/admin/buses" },
        { name: "Add Driver", icon: <PlusCircle size={20} />, path: "/admin/buses/addBus" },
      ];
    }
    return baseNavItems;
  };

  const navItems = [...extraNavItems()];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div
        className={`lg:hidden fixed top-4 left-4 z-50 transition-all duration-300 ${isOpen ? "left-48" : ""
          }`}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-white bg-gray-800 p-2 rounded-md"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 
        ${isOpen ? "w-64" : "w-0"}
        lg:w-64 lg:relative h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 overflow-hidden`}
      >
        {/* Header */}
        <Link to='/'>
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            Admin Panel
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-2 rounded-lg hover:bg-gray-800 transition ${location.pathname === item.path ? "bg-gray-800" : ""
                }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className={`${isOpen ? "" : "hidden"} md:inline`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-800 rounded-lg transition" onClick={logout}>
            <LogOut size={20} className="mr-3" />
            <span className={`${isOpen ? "" : "hidden"} md:inline`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
