import React, { useState } from "react";
import { useLocation, useParams, useNavigate, Navigate } from "react-router-dom";
import { updateUser } from "../services/userServices";

import { useNotification } from "../../../context/NotificationContext";

interface IUser {
    name: string;
    email: string;
    password?: string;
    isVerified: boolean;
    role: "USER" | "ADMIN" | "DRIVER";
}


export default function EditUser() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
    const { notify } = useNotification();

    const [formData, setFormData] = useState<IUser>({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        isVerified: user?.isVerified || false,
        role: user?.role || "User",
    });


    if (!userId || !user) {
        return <Navigate to="/admin/buses" replace />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                [name]: target.checked,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedData = {
            ...formData,
            ...(formData.password ? { password: formData.password} : {}),
        };

        const result = await updateUser(userId, updatedData);
        if (!result.error) {
            notify("User updated successfully!", "success");
            setTimeout(() => navigate("/admin/users"), 1500);
        } else {
            notify("Failed to update user. Please try again.", "error");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Name"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Email"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">New Password (optional)</label>
                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label className="block font-medium">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="DRIVER">DRIVER</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isVerified"
                        checked={formData.isVerified}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label className="font-medium">Is Verified</label>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
