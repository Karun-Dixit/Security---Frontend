import { useContext, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import zxcvbn from 'zxcvbn';
import { AppContext } from "../context/AppContext";
import { api } from '../services/apiClient';

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [passwordFeedback, setPasswordFeedback] = useState({ warning: '', suggestions: [] });

  const navigate = useNavigate();
  const { backendUrl, token, setToken, isInitializing } = useContext(AppContext);
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (showCaptcha && !captchaToken) {
      toast.error("Please verify you are a human.");
      return;
    }

    try {
      if (state === "Sign Up") {
        const { data } = await api.post('/api/user/register', {
          name,
          email,
          password,
        });

        if (data.success) {
          if (
            data.message ===
            "OTP sent to your email. Please verify to complete registration."
          ) {
            toast.success(data.message);
            navigate("/otp-verify", { state: { email } });
          } else {
            setToken(true); // Just mark as logged in, don't store token
          }
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await api.post('/api/user/login', {
          email,
          password,
          captchaToken: showCaptcha ? captchaToken : undefined,
        });

        if (data.success) {
          if (data.requiresOtp) {
            toast.success(data.message || "OTP sent to your email for secure login");
            navigate("/otp-verify", { state: { email, isLogin: true } });
          } else {
            setToken(true); // Mark as logged in
            toast.success("Login successful!");
            navigate("/");
          }
        } else {
          toast.error(data.message || "Login failed.");
        }
      }
    } catch (error) {
      toast.error("Server error or endpoint not found");
      console.error(error);
    }
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (state === 'Sign Up') {
      const result = zxcvbn(pwd);
      setPasswordStrength(result.score);
      setPasswordFeedback(result.feedback);
    }
  };

  useEffect(() => {
    // Only redirect if not initializing and user is actually logged in
    if (!isInitializing && token) {
      navigate("/");
    }
  }, [token, isInitializing, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center justify-center bg-[#EAF2FF] px-4"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mb-2">
            P
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Please {state === "Sign Up" ? "sign up" : "log in"} to book appointment
          </p>
        </div>

        {/* Toggle buttons */}
        <div className="flex justify-between bg-blue-50 p-1 rounded-md">
          <button
            type="button"
            onClick={() => setState("Login")}
            className={`w-1/2 py-2 rounded-md text-sm font-medium transition-all ${state === "Login"
              ? "bg-blue-500 text-white shadow-md"
              : "text-blue-500 hover:bg-blue-100"
              }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setState("Sign Up")}
            className={`w-1/2 py-2 rounded-md text-sm font-medium transition-all ${state === "Sign Up"
              ? "bg-blue-500 text-white shadow-md"
              : "text-blue-500 hover:bg-blue-100"
              }`}
          >
            Sign Up
          </button>
        </div>

        {state === "Sign Up" && (
          <div>
            <label className="text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        )}

        <div>
          <label className="text-sm text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {/* Password strength meter (only for Sign Up) */}
          {state === 'Sign Up' && password && (
            <div className="mt-2">
              <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
                <div
                  style={{
                    width: `${((passwordStrength ?? 0) + 1) * 20}%`,
                    backgroundColor:
                      passwordStrength === 0 ? '#ef4444' :
                        passwordStrength === 1 ? '#f59e42' :
                          passwordStrength === 2 ? '#fbbf24' :
                            passwordStrength === 3 ? '#22c55e' :
                              '#22c55e',
                    transition: 'width 0.3s',
                  }}
                  className="h-full"
                />
              </div>
              <div className="text-xs mt-1 font-medium"
                style={{
                  color:
                    passwordStrength === 0 ? '#ef4444' :
                      passwordStrength === 1 ? '#f59e42' :
                        passwordStrength === 2 ? '#fbbf24' :
                          passwordStrength === 3 ? '#22c55e' :
                            '#22c55e',
                }}
              >
                {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength ?? 0]}
              </div>
              {passwordFeedback.warning && (
                <div className="text-xs text-yellow-600 mt-1">{passwordFeedback.warning}</div>
              )}
              {passwordFeedback.suggestions && passwordFeedback.suggestions.length > 0 && (
                <ul className="text-xs text-gray-500 mt-1 list-disc pl-4">
                  {passwordFeedback.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {state === "Login" && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="human-check"
                checked={showCaptcha}
                onChange={() => {
                  setShowCaptcha((prev) => !prev);
                  setCaptchaToken("");
                }}
              />
              <label htmlFor="human-check" className="text-sm text-gray-600">
                I'm not a robot
              </label>
            </div>

            {showCaptcha && (
              <div>
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={setCaptchaToken}
                  className="mt-2"
                />
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-md"
        >
          {state === "Sign Up" ? "Create account" : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() =>
              setState((prev) => (prev === "Sign Up" ? "Login" : "Sign Up"))
            }
          >
            {state === "Sign Up" ? "Login here" : "Register now"}
          </span>
        </p>

        {/* Forgot Password Link - Only show on Login state */}
        {state === "Login" && (
          <p className="text-center text-sm text-gray-600 mt-2">
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline font-medium"
            >
              Reset it here
            </Link>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
