// src/features/auth/hooks/useLogin.ts
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";
import { useAuth } from "../../../context/AuthContext";
import { URL } from "../../../constant";

const API_URL = `${URL}/api/users/login`;

export const useLogin = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const isFormValid = (): boolean => {
    return (
      formData.email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password.trim() !== ""
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      if (value.trim() === "") {
        setError((prev) => ({ ...prev, email: "Email is required." }));
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        setError((prev) => ({ ...prev, email: "Invalid email format." }));
      }
    } else if (name === "password") {
      if (value.trim() === "") {
        setError((prev) => ({ ...prev, password: "Password is required." }));
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError({
      email:
        formData.email.trim() === ""
          ? "Email is required."
          : !/\S+@\S+\.\S+/.test(formData.email)
          ? "Invalid email format."
          : "",
      password: formData.password.trim() === "" ? "Password is required." : "",
    });

    if (!isFormValid()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        {
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        },
        { withCredentials: true }
      );
      notify(response.data.message, "success");
      setUser(response.data.user);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 401) notify("Invalid email or password.", "error");
        else if (status === 403)
          notify("Email not verified. Please check your inbox.", "error");
        else notify(data.error || "Login failed. Please try again.", "error");
      } else {
        notify("Network error. Please try again later.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    handleChange,
    handleBlur,
    handleLogin,
    isFormValid,
  };
};
