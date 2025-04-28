// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import logo from "../assets/images/logo.png";
// import { URL } from "../constant";
// import { LoadingSpinner } from "../components/LodingSpinner";
// import { useNotification } from "../context/NotificationContext";
// import { useAuth } from "../context/AuthContext";

// const API_URL = `${URL}/api/users/login`;

// const LoginPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { notify } = useNotification();
//   const {setUser} = useAuth();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });
//   const [error, setError] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   // Check if form is valid (both email and password are valid)
//   const isFormValid = (): boolean => {
//     return (
//       formData.email.trim() !== "" &&
//       /\S+@\S+\.\S+/.test(formData.email) &&
//       formData.password.trim() !== ""
//     );
//   };

//   // Clear error on change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     // Clear the error message when user starts typing
//     setError((prev) => ({ ...prev, [name]: "" }));
//   };

//   // Validate individual field on blur
//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (name === "email") {
//       if (value.trim() === "") {
//         setError((prev) => ({ ...prev, email: "Email is required." }));
//       } else if (!/\S+@\S+\.\S+/.test(value)) {
//         setError((prev) => ({ ...prev, email: "Invalid email format." }));
//       }
//     } else if (name === "password") {
//       if (value.trim() === "") {
//         setError((prev) => ({ ...prev, password: "Password is required." }));
//       }
//     }
//   };

//   // Handle form submission with final validation
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Final validation check
//     setError({
//       email:
//         formData.email.trim() === ""
//           ? "Email is required."
//           : !/\S+@\S+\.\S+/.test(formData.email)
//             ? "Invalid email format."
//             : "",
//       password:
//         formData.password.trim() === "" ? "Password is required." : "",
//     });

//     if (!isFormValid()) return;

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         API_URL,
//         {
//           email: formData.email,
//           password: formData.password,
//           rememberMe: formData.rememberMe, // Send rememberMe flag
//         },
//         { withCredentials: true }
//       );

//       notify(response.data.message, "success")
//       setUser(response.data.user)
//       setTimeout(() => navigate("/"), 2000); // Redirect to dashboard after login
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         const { status, data } = error.response;
//         if (status === 401) notify("Invalid email or password.","error");
//         else if (status === 403)
//           notify("Email not verified. Please check your inbox.","error");
//         else notify(data.error || "Login failed. Please try again.","error");
//       } else {
//         notify("Network error. Please try again later.","error");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="md:bg-white md:shadow-lg md:rounded-lg overflow-hidden w-full max-w-md p-8">
//         {/* Logo */}
//         <div className="text-center mb-6">
//           <img src={logo} alt="AU Bus Track Logo" className="mx-auto h-12 w-auto" />
//         </div>

//         {/* Login Form */}
//         <form className="space-y-6" onSubmit={handleLogin}>
//           {/* Email Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email or phone number
//             </label>
//             <input
//               type="email"
//               name="email"
//               className={`mt-1 block w-full px-3 py-2 border ${error.email ? "border-red-500" : "border-gray-300"
//                 } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Email or phone number"
//               value={formData.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//             />
//             {error.email && (
//               <p className="text-red-500 text-sm mt-1">{error.email}</p>
//             )}
//           </div>

//           {/* Password Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               className={`mt-1 block w-full px-3 py-2 border ${error.password ? "border-red-500" : "border-gray-300"
//                 } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//             />
//             {error.password && (
//               <p className="text-red-500 text-sm mt-1">{error.password}</p>
//             )}
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 type="checkbox"
//                 name="rememberMe"
//                 checked={formData.rememberMe}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//               />
//               <label className="ml-2 text-sm text-gray-900">Remember me</label>
//             </div>
//             <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
//               Forgot password?
//             </Link>
//           </div>

//           {/* Sign In Button */}
//           <button
//             type="submit"
//             disabled={!isFormValid() || loading}
//             className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium shadow-md transition ${!isFormValid() || loading
//               ? "bg-blue-300 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//               }`}
//           >
//             {loading ? <LoadingSpinner /> : "Sign in"}
//           </button>

//           {/* Divider */}
//           <div className="relative my-4">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or sign in with</span>
//             </div>
//           </div>

//           {/* Google Login Button */}
//           <button
//             type="button"
//             className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition duration-200 ease-in-out"
//           >
//             <img
//               src="https://storage.googleapis.com/a1aa/image/al82gDMZnhbtZz6veMpqASWzGrN0dErpWZ6nJCuj49s.jpg"
//               alt="Google logo"
//               className="h-5 w-5 mr-3"
//             />
//             <span className="text-gray-700 font-semibold">Sign in with Google</span>
//           </button>
//         </form>

//         {/* Sign Up Redirect */}
//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Don't have an account?{" "}
//             <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
//               Sign up now
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


// src/features/auth/LoginPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import { LoadingSpinner } from "../components/LodingSpinner";
import { useLogin } from "../feature/auth/hooks/useLogin";
import logo from "../assets/images/logo.png"

const LoginPage: React.FC = () => {
  const { formData, error, loading, handleChange, handleBlur, handleLogin, isFormValid } = useLogin();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="md:bg-white md:shadow-lg md:rounded-lg overflow-hidden w-full max-w-md p-8">
        <div className="text-center mb-6">
          <img src={logo} alt="AU Bus Track Logo" className="mx-auto h-12 w-auto" />
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <InputField
            label="Email or phone number"
            type="email"
            name="email"
            placeholder="Email or phone number"
            value={formData.email}
            error={error.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            error={error.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-900">Remember me</label>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium shadow-md transition ${!isFormValid() || loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? <LoadingSpinner /> : "Sign in"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition duration-200 ease-in-out"
          >
            <img
              src="https://storage.googleapis.com/a1aa/image/al82gDMZnhbtZz6veMpqASWzGrN0dErpWZ6nJCuj49s.jpg"
              alt="Google logo"
              className="h-5 w-5 mr-3"
            />
            <span className="text-gray-700 font-semibold">Sign in with Google</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
