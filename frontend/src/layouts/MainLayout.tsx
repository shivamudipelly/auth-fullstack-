import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar Stays Fixed at the Top */}
            <Navbar />

            {/* Main Content - Ensures Flex Grow to Push Footer Down */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer Always Stays at the Bottom */}
            <Footer />
        </div>
    );
};

export default MainLayout;
