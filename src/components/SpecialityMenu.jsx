import { Link } from 'react-router-dom'
import { specialityData } from '../assets/assets'

const SpecialityMenu = () => {
    return (
        <div id='speciality' className='pb-8 bg-gradient-to-br from-gray-50 to-blue-50'>
            <div className='max-w-7xl mx-auto px-6'>
                <div className='text-center mb-16'>
                    <h1 className='text-4xl font-bold text-gray-800 mb-4'>
                        Explore Medical <span className='text-blue-600'>Specializations</span>
                    </h1>
                    <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                        Discover specialized care tailored to your health needs. Our expert doctors across various fields are ready to provide you with personalized treatment.
                    </p>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
                    {specialityData.map((item, index) => (
                        <Link 
                            to={`/doctors/${item.speciality}`} 
                            onClick={() => scrollTo(0, 0)} 
                            className='group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col items-center text-center cursor-pointer transform hover:scale-105 transition-all duration-300' 
                            key={index}
                        >
                            <div className='w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300'>
                                <img className='w-12 h-12 object-contain' src={item.image} alt={item.speciality} />
                            </div>
                            <h3 className='font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm'>
                                {item.speciality}
                            </h3>
                            <div className='w-0 group-hover:w-8 h-0.5 bg-blue-600 mt-2 transition-all duration-300'></div>
                        </Link>
                    ))}
                </div>

                <div className='text-center mt-16'>
                    <p className='text-gray-600 mb-6'>Can't find what you're looking for?</p>
                    <Link 
                        to="/doctors" 
                        className='inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
                    >
                        Browse All Doctors
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 7l5 5m0 0l-5 5m5-5H6' />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SpecialityMenu