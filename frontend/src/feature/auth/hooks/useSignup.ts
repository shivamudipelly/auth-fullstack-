// src/features/auth/hooks/useSignup.ts
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";
import { URL } from "../../../constant";

const API_URL = `${URL}/api/users/register`;

export const useSignup = () => {
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
        notify(response.data.message, "success");
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

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
  };
};
