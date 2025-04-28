import axios, { isAxiosError } from 'axios';
import { URL } from '../../../constant';


interface IUser {
    name: string;
    email: string;
    password?: string;
    isVerified: boolean;
    role: "USER" | "ADMIN" | "DRIVER";
}

// Define API endpoint
const API_URL = `${URL}/api/admin`;  // Replace with your backend URL

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', 
    withCredentials: true,
});

// Fetch user data from the backend
export const fetchUsers = async () => {
    return api.get(`${API_URL}/getAllUsers`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching users", error);
            return { error: "Failed to fetch users" };
        });
};

//create user fromt he bakcend
export const createUser = async (userData: IUser) => {
    try {
        const res = await api.post(`${API_URL}/addUser`, userData);
        return res.data;
    } catch (error) {
        if (isAxiosError(error))
            return { error: true, message: error.response?.data?.message || "Server error" };
    }
};

// Delete user from the backend
export const deleteUser = async (userId: number) => {
    try {
      const res = await api.delete(`${API_URL}/deleteUser/${userId}`);
      console.log(res);
      
      return res.data;
    } catch (error) {
      console.error("Error deleting user", error);
      return error;
    }
  };
  

// Update user (using PUT method)
export const updateUser = async (userId: string, userData: { name: string; password?: string; email: string; role: string }) => {
    console.log(userData);

    return api.put(`${API_URL}/updateUser/${userId}`, userData)
        .then(response => response.data)
        .catch(error => {
            console.error("Error updating user", error);
            return { error: "Failed to update user" };
        });
};
