import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AppContext } from "./context/AppContext";
import About from "./pages/About";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import OtpVerify from "./pages/OtpVerify";
import ResetPassword from "./pages/ResetPassword";
import Verify from "./pages/Verify";

const App = () => {
  const { isInitializing } = useContext(AppContext);

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-4 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Initializing...</h2>
          <p className="text-gray-500">Setting up secure connection</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="mx-4 sm:mx-[10%]">
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
