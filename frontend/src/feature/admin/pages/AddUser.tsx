import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userServices"; // make sure this service exists
import { useNotification } from "../../../context/NotificationContext";

interface IUser {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    role: "USER" | "ADMIN" | "DRIVER";
}

export default function AddUser() {
    const navigate = useNavigate();
    const { notify } = useNotification();

    const [formData, setFormData] = useState<IUser>({
        name: "",
        email: "",
        password: "",
        role: "USER",
        isVerified: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await createUser(formData);

        if (!result.error) {
            notify( result.message || "User created successfully!","success");
            setTimeout(() => navigate("/admin/users"), 1500);
        } else {
            notify( result.message || "Failed to create user.","error");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Full Name"
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
                    <label className="block font-medium">Password</label>
                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="••••••••"
                        required
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
                    Create User
                </button>
            </form>
        </div>
    );
}
