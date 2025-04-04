import { useState } from "react";
import { Link } from "react-router-dom";
import Profile from "../assets/images/profile.png";
import Logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    // Navigation Menu Items
    const navItems = [
        { name: "Home", path: "/" },
        { name: "Buses", path: "/buses" },
        { name: "Profile", path: "/profile" },
        { name: "Contact", path: "/contact" },
    ];

    // User Dropdown Menu Items
    const userMenuItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Settings", path: "/settings" },
    ];

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo Section */}
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={Logo} className="h-8" alt="Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Au Bus Track</span>
                </Link>

                {/* User Profile & Mobile Menu Button */}
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {user ? <>
                        {/* Profile Dropdown Button */}
                        < button
                            type="button"
                            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <img className="w-8 h-8 rounded-full" src={Profile} alt="User photo" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div
                                className="absolute right-14 top-[30px] md:right-[140px] mt-4 z-50 text-base bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-gray-900 dark:text-white">{user.name}</span>
                                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                                </div>
                                <ul className="py-2">
                                    {userMenuItems.map((item) => (
                                        <li key={item.path}>
                                            <Link to={item.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                    <li>
                                        <p
                                            onClick={logout}
                                            className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Logout
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        )} </>
                        :
                        <Link to="/login">Login</Link>
                    }

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Menu */}
                <div className={`items-center justify-between ${isMobileMenuOpen ? "block" : "hidden"} w-full md:flex md:w-auto md:order-1`}>
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className="block py-2 px-3 text-gray-900 rounded-sm  md:hover:bg-transparent hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}


                    </ul>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
