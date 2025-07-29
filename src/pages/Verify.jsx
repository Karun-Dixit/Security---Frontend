import { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { api } from '../services/apiClient';

const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get("success")
    const appointmentId = searchParams.get("appointmentId")

    const { backendUrl, token } = useContext(AppContext)

    const navigate = useNavigate()

    // Function to verify stripe payment
    const verifyStripe = async () => {

        try {

            const { data } = await api.post("/api/user/verify-Stripe", { success, appointmentId })

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

            navigate("/my-appointments")

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (token, appointmentId, success) {
            verifyStripe()
        }
    }, [token])

    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
        </div>
    )
}

export default Verify