import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../constant";
import { useNotification } from "../context/NotificationContext";

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [message, setMessage] = useState<string>("Verifying your email...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      try {
        const response = await axios.get(`${URL}/api/users/verify-email?token=${token}`);
        const successMessage = response.data.message || "Email verified successfully!";
        setMessage(successMessage);
        notify(successMessage, "success");
        setLoading(false);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Verification failed. Redirecting to signup...";
        setMessage(errorMessage);
        notify(errorMessage, "error");
        setLoading(false);

        setTimeout(() => {
          navigate("/signup");
        }, 2000);
      }
    };

    verifyEmail();
  }, [searchParams, navigate, notify]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold">Email Verification</h2>
        <p className={`text-gray-600 mt-4 ${loading ? "animate-pulse" : ""}`}>{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
