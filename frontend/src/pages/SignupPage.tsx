import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/logo.png";
import { URL } from "../constant";
import { LoadingSpinner } from "../components/LodingSpinner";
import { useNotification } from "../context/NotificationContext";

const API_URL = `${URL}/api/users/register`;

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { notify } = useNotification();

  const isFormValid = (): boolean => {
    const { name, email, password, confirmPassword } = formData;
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(email) &&
      password.trim() !== "" &&
      password.length >= 6 &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required.";
        break;
      case "email":
        if (!value.trim()) error = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email format.";
        break;
      case "password":
        if (!value.trim()) error = "Password is required.";
        else if (value.length < 6) error = "Password must be at least 6 characters.";
        break;
      case "confirmPassword":
        if (!value.trim()) error = "Confirm password is required.";
        else if (value !== formData.password) error = "Passwords do not match.";
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      try {
        const response = await axios.post(API_URL, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });


        notify(response.data.message, "success")


      } catch (error) {
        let errorMsg = "An error occurred.";
        if (axios.isAxiosError(error) && error.response?.data?.error) {
          errorMsg = error.response.data.error;
        } else if (error instanceof Error) {
          errorMsg = error.message;
        }
        notify(errorMsg, "error");
      } finally {
        setLoading(false);
        setTimeout(() => navigate("/login"), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="md:bg-white md:shadow-lg md:rounded-lg overflow-hidden w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="AU Bus Track Logo"
            className="mx-auto mb-4 h-12 w-auto"
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`w-full py-2 px-4 text-sm font-medium text-white rounded-md shadow-sm transition duration-200 flex items-center justify-center ${!isFormValid() || loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? <LoadingSpinner /> : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          Already have an account? {" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:text-blue-500"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;