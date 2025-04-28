import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const {user, loading} = useAuth();

    if (loading) return null; 

    
    if(user?.role === "ADMIN"){
        return children;
    }
    return <Navigate to="/" replace />;
}


export default ProtectedRoute;