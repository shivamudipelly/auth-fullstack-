// src/pages/SignupPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import SignupForm from "../feature/auth/components/SignupForm";

const SignupPage: React.FC = () => {
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

        <SignupForm />

        <div className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-500">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
