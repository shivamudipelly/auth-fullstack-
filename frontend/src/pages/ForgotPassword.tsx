import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/logo.png";
import { LoadingSpinner } from "../components/LodingSpinner";
import { URL } from "../constant";
import { useNotification } from "../context/NotificationContext";

const API_URL = `${URL}/api/users/forgot-password`;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const { notify } = useNotification();

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleBlur = () => {
    setTouched(true);
    if (!email.trim()) {
      setServerError("Please enter your email.");
    } else if (!validateEmail(email)) {
      setServerError("Please enter a valid email address.");
    } else {
      setServerError("");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!email.trim()) {
      setServerError("Please enter your email.");
      notify("Please enter your email.", "error");
      return;
    }

    if (!validateEmail(email)) {
      setServerError("Please enter a valid email address.");
      notify("Please enter a valid email address.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_URL, { email });
      if (response.status === 200) {
        notify(response.data.message, "success");
      } else {
        notify("Something went wrong. Please try again.", "error");
      }
    } catch (error) {
      let errorMsg = "Network error. Please try again later.";
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 401) errorMsg = "Invalid email or password.";
        else if (status === 403) errorMsg = "Email not verified. Please check your inbox.";
        else errorMsg = data.error || "Failed to send reset link. Try again.";
      }
      notify(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="md:bg-white md:shadow-lg md:rounded-lg w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="AU Bus Track Logo" className="mx-auto h-12 w-auto" />
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-800">Forgot Password?</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Enter your email to receive a password reset link.
        </p>

        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              className={`mt-1 block w-full px-3 py-2 border ${
                serverError ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleBlur}
            />
            {touched && serverError && (
              <p className="text-red-500 text-sm mt-1">{serverError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!validateEmail(email) || loading}
            className={`w-full py-2 px-4 rounded-md text-center text-white text-sm font-medium shadow-md transition ${
              !validateEmail(email) || loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? <LoadingSpinner /> : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
