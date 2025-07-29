import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState('');

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/my-appointments`, { withCredentials: true });
      setAppointments(data.appointments.reverse());
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/user/verifyRazorpay`, response, {
            withCredentials: true,
          });
          if (data.success) {
            navigate('/my-appointments');
            getUserAppointments();
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-stripe`,
        { appointmentId },
        { withCredentials: true }
      );
      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F0F6FF] px-4 py-10">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">My Appointments</h2>
      <div className="space-y-6">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-4 sm:flex sm:gap-6 items-center"
          >
            <div>
              <img
                className="w-28 h-28 object-cover rounded bg-blue-100"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 mt-4 sm:mt-0 text-sm text-[#4B4B4B]">
              <p className="text-lg font-semibold text-blue-700">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="mt-2 text-gray-500 font-medium">Address:</p>
              <p>{item.docData.address.line1}</p>
              <p>{item.docData.address.line2}</p>
              <p className="mt-2">
                <span className="font-medium">Date & Time:</span>{' '}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-center text-sm text-center mt-4 sm:mt-0">
              {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                <button
                  onClick={() => setPayment(item._id)}
                  className="text-blue-600 border border-blue-500 py-1.5 px-4 rounded hover:bg-blue-500 hover:text-white transition"
                >
                  Pay Online
                </button>
              )}

              {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                <button
                  onClick={() => appointmentStripe(item._id)}
                  className="text-purple-600 border border-purple-400 py-1.5 px-4 rounded hover:bg-purple-600 hover:text-white transition"
                >
                  Pay with Stripe
                </button>
              )}

              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="py-1.5 px-4 rounded bg-green-100 text-green-700 border border-green-300">
                  Paid
                </button>
              )}

              {item.isCompleted && (
                <button className="py-1.5 px-4 rounded bg-blue-100 text-blue-700 border border-blue-300">
                  Completed
                </button>
              )}

              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-red-600 border border-red-500 py-1.5 px-4 rounded hover:bg-red-500 hover:text-white transition"
                >
                  Cancel
                </button>
              )}

              {item.cancelled && (
                <button className="py-1.5 px-4 rounded bg-red-100 text-red-600 border border-red-300">
                  Cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
