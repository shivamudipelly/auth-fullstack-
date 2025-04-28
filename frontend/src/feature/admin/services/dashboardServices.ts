import axios from 'axios';


// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', 
    withCredentials: true,
});

export const fetchDashboard = async ()=>{
    try {
        const res = await api.get('/api/dashboard/stats')
        return res.data
    } catch (error) {
        console.error(error);
        return error
    }
}