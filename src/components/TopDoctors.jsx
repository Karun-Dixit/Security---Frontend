import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const TopDoctors = () => {

    const navigate = useNavigate()

    const { doctors } = useContext(AppContext)

    return (
        <div className='bg-gradient-to-b from-white to-gray-50 py-24'>
            <div className='max-w-7xl mx-auto px-6'>
                {/* Header Section */}
                <div className='text-center mb-16'>
                    <div className='inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6'>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        Verified Medical Professionals
                    </div>
                    <h1 className='text-5xl font-extrabold text-gray-900 mb-6'>
                        Featured <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent'>Healthcare Experts</span>
                    </h1>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                        Meet our handpicked team of distinguished doctors who bring years of expertise and compassionate care to your health journey.
                    </p>
                </div>

                {/* Doctors Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
                    {doctors.slice(0, 9).map((item, index) => (
                        <div 
                            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} 
                            className='group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-200 cursor-pointer transform hover:-translate-y-2 transition-all duration-500' 
                            key={index}
                        >
                            {/* Background Pattern */}
                            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent opacity-50'></div>
                            
                            {/* Image Section */}
                            <div className='relative p-6 pb-0'>
                                <div className='relative mx-auto w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200'>
                                    <img 
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' 
                                        src={item.image} 
                                        alt={item.name} 
                                    />
                                    {/* Status Badge */}
                                    <div className='absolute -top-2 -right-2'>
                                        <div className={`w-6 h-6 rounded-full border-4 border-white ${
                                            item.available ? 'bg-green-500' : 'bg-red-500'
                                        } shadow-lg`}></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Content Section */}
                            <div className='p-6 text-center'>
                                <h3 className='text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors'>
                                    Dr. {item.name}
                                </h3>
                                <p className='text-blue-600 font-semibold mb-3 uppercase tracking-wide text-sm'>
                                    {item.speciality}
                                </p>
                                
                                {/* Stats Row */}
                                <div className='flex justify-center items-center gap-6 mb-6 text-sm text-gray-600'>
                                    <div className='flex items-center gap-1'>
                                        <span className='text-yellow-500'>★</span>
                                        <span className='font-medium'>4.9</span>
                                    </div>
                                    <div className='w-1 h-1 bg-gray-300 rounded-full'></div>
                                    <span>150+ Reviews</span>
                                    <div className='w-1 h-1 bg-gray-300 rounded-full'></div>
                                    <span>12+ Years</span>
                                </div>

                                {/* Availability Status */}
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                                    item.available 
                                        ? 'bg-green-50 text-green-700 border border-green-200' 
                                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                    {item.available ? 'Available Today' : 'Next Available: Tomorrow'}
                                </div>

                                {/* Action Button */}
                                <button className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'>
                                    Book Consultation
                                </button>
                            </div>

                            {/* Hover Overlay */}
                            <div className='absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA Section */}
                <div className='text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white'>
                    <h3 className='text-3xl font-bold mb-4'>Need a Different Specialist?</h3>
                    <p className='text-blue-100 mb-8 text-lg max-w-2xl mx-auto'>
                        Explore our complete directory of medical professionals across all specializations and find the perfect match for your healthcare needs.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <button 
                            onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} 
                            className='bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3'
                        >
                            Browse All Doctors
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                            </svg>
                        </button>
                        <button className='border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300'>
                            Emergency Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default TopDoctors