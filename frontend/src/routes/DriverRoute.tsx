import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const DriverRoute = ({ children }: { children: React.ReactNode }) => {
    const {user, loading} = useAuth();

    if (loading) return null; 

    
    if(user?.role === "DRIVER"){
        return children;
    }
    return <Navigate to="/" replace />;
}


export default DriverRoute;