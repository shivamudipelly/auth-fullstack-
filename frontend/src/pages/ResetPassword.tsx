import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { URL } from "../constant";
import { LoadingSpinner } from "../components/LodingSpinner";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<{ newPassword?: string; confirmPassword?: string;}>({});
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (!value) {
      setError((prev) => ({ ...prev, newPassword: "Password is required." }));
    } else if (value.length < 6) {
      setError((prev) => ({ ...prev, newPassword: "Password must be at least 6 characters." }));
    } else {
      setError((prev) => ({ ...prev, newPassword: undefined }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (!value) {
      setError((prev) => ({ ...prev, confirmPassword: "Confirm password is required." }));
    } else if (value !== newPassword) {
      setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
    } else {
      setError((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError((prev) => ({ ...prev, apiError: undefined }));

    if (!newPassword || !confirmPassword) {
      return setError((prev) => ({ ...prev, apiError: "Both fields are required." }));
    }

    if (newPassword.length < 6 || newPassword !== confirmPassword) return;

    if (!token) {
      return setError((prev) => ({ ...prev, apiError: "Invalid or expired reset link." }));
    }

    try {
      setLoading(true);
      const response = await fetch(`${URL}/api/users/reset-password?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        notify(data.error || "Failed to reset password.", "error");
        return
      }

      notify("Password reset successful! Redirecting...", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        notify(err.response?.data?.error || "Something went wrong", "error");
      } else {
        notify("Unexpected error occurred.", "error");
      }
      setNewPassword("")
      setConfirmPassword("")
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="md:bg-white md:shadow-lg md:rounded-lg p-6 w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold text-gray-800">Reset Password</h2>
        <form className="mt-4 space-y-4" onSubmit={handleReset}>
          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              className={`mt-1 block w-full px-3 py-2 border ${error.newPassword ? "border-red-500" : "border-gray-300"} rounded-md`}
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            {error.newPassword && <p className="text-red-500 text-sm">{error.newPassword}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              className={`mt-1 block w-full px-3 py-2 border ${error.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md`}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            />
            {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword || !!error.newPassword || !!error.confirmPassword}
            className={`w-full py-2 rounded-md text-white ${
              loading || !newPassword || !confirmPassword || error.newPassword || error.confirmPassword
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? <LoadingSpinner /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
