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
  
  type UserType = {
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "DRIVER";
  };
  
  interface AuthContextType {
    user: UserType | null;
    setUser: Dispatch<SetStateAction<UserType | null>>;
    logout: () => void;
  }
  
  const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    logout: () => {},
  });
  
  export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null);
  
    // 🔍 Check if user is already logged in on first render
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
            if(axios.isAxiosError(err))
                setUser(null);
        }
      };
  
      checkUser();
    }, []);
  
    const logout = async () => {
      try {
        await axios.get(`${URL}/api/users/logout`, {
          withCredentials: true,
        });
        setUser(null);
        window.location.href = "/";
      } catch (err) {
        console.error("Logout failed", err);
      }
    };
  
    return (
      <AuthContext.Provider value={{ user, setUser, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // eslint-disable-next-line react-refresh/only-export-components
  export const useAuth = () => useContext(AuthContext);
  