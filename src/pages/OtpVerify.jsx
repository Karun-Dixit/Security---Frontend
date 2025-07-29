import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const OtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, setToken } = useContext(AppContext);

  // Get email and flow type from navigation state
  const email = location.state?.email;
  const isLogin = location.state?.isLogin || false;

  useEffect(() => {
    // Redirect to login if no email provided
    if (!email) {
      navigate("/login");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    try {
      // Use different endpoints based on flow type
      const endpoint = isLogin
        ? `${backendUrl}/api/user/verify-login-otp`
        : `${backendUrl}/api/user/verify-otp`;

      const { data } = await axios.post(endpoint, {
        email,
        otp: otpCode,
      }, { withCredentials: true });

      if (data.success) {
        if (isLogin) {
          // For login flow, set token and navigate to home
          toast.success(data.message || "Login successful!");
          setToken(true); // Just mark as logged in, don't store token
          navigate("/");
        } else {
          // For registration flow, navigate to login page
          toast.success(
            data.message ||
            "Registration completed successfully! Please login to continue."
          );
          navigate("/login");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      // Use different endpoints based on flow type
      const endpoint = isLogin
        ? `${backendUrl}/api/user/resend-login-otp`
        : `${backendUrl}/api/user/resend-otp`;

      const { data } = await axios.post(endpoint, { email }, { withCredentials: true });

      if (data.success) {
        toast.success("OTP resent successfully!");
        setTimeLeft(300); // Reset timer
        setOtp(["", "", "", "", "", ""]); // Clear current OTP
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-4 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {isLogin ? "Secure Login Verification" : "Verify Your Email"}
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? "We've sent a security code to verify your login"
              : "We've sent a 6-digit verification code to"}
          </p>
          <p className="font-medium text-primary">{email}</p>
        </div>

        <form onSubmit={handleVerifyOtp} className="w-full">
          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold border border-[#DADADA] rounded-lg focus:border-primary focus:outline-none"
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join("").length !== 6}
            className="bg-primary text-white w-full py-3 rounded-md text-base font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {isLoading
              ? "Verifying..."
              : isLogin
                ? "Verify & Login"
                : "Verify OTP"}
          </button>
        </form>

        <div className="text-center w-full">
          {timeLeft > 0 ? (
            <p className="text-gray-600">
              Resend OTP in{" "}
              <span className="font-medium text-primary">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-primary underline hover:text-primary/80 disabled:text-gray-400"
            >
              {isLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        <div className="text-center">
          <p>
            {isLogin
              ? "Having trouble logging in?"
              : "Want to use a different email?"}{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-primary underline cursor-pointer hover:text-primary/80"
            >
              {isLogin ? "Try again" : "Go back to registration"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
