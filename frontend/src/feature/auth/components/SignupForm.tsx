// src/features/auth/components/SignupForm.tsx
import React from "react";
import InputField from "../../../components/InputField";
import { LoadingSpinner } from "../../../components/LodingSpinner";
import { useSignup } from "../hooks/useSignup";

const SignupForm: React.FC = () => {
  const {
    formData,
    errors,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
  } = useSignup();

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputField
        label="Name"
        type="text"
        name="name"
        placeholder="Enter your name"
        value={formData.name}
        error={errors.name}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <InputField
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        error={errors.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <InputField
        label="Password"
        type="password"
        name="password"
        placeholder="Create a password"
        value={formData.password}
        error={errors.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <InputField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div>
        <button
          type="submit"
          disabled={!isFormValid() || loading}
          className={`w-full py-2 px-4 text-sm font-medium text-white rounded-md shadow-sm transition duration-200 flex items-center justify-center ${
            !isFormValid() || loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? <LoadingSpinner /> : "Sign Up"}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
