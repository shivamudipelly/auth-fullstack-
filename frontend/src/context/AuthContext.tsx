import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";
import { URL } from "../constant";
import { useNotification } from "./NotificationContext";

// ------------------- Types -------------------
type UserType = {
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "DRIVER";
};

interface AuthContextType {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  logout: () => void;
  loading: boolean;
}

// ------------------- Context -------------------
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

// ------------------- Provider -------------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  // Auto-fetch user session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(`${URL}/api/users/protected-route`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          setUser(res.data.user);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await axios.get(`${URL}/api/users/logout`, {
        withCredentials: true,
      });
      setUser(null);
      notify("Logged out successfully", "success");
      setTimeout(() => (window.location.href = "/"), 2000);
    } catch (err) {
      console.error("Logout failed", err);
      notify("Logout failed. Please try again.", "error");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ------------------- Custom Hook -------------------
export const useAuth = () => useContext(AuthContext);
