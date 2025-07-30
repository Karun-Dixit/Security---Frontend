import { assets } from '../assets/assets'

const Introduction = () => {
  return (
    <div className='max-w-7xl mx-auto px-6 py-16 my-20'>
      {/* Main Introduction */}
      <div className='text-center mb-16'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
          Your Health, Our Priority
        </h2>
        <p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          Experience healthcare like never before with our comprehensive medical platform. 
          We connect you with qualified healthcare professionals, ensuring you receive 
          the best possible care tailored to your needs.
        </p>
      </div>

      {/* Features Grid */}
      <div className='grid md:grid-cols-3 gap-8 mb-16'>
        <div className='text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300'>
          <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <img className='w-8 h-8 filter brightness-0 invert' src={assets.verified_icon} alt="" />
          </div>
          <h3 className='text-xl font-semibold text-gray-800 mb-3'>Verified Doctors</h3>
          <p className='text-gray-600'>
            All our healthcare professionals are thoroughly verified and licensed, 
            ensuring you receive care from qualified experts.
          </p>
        </div>

        <div className='text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300'>
          <div className='w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-800 mb-3'>Quick Appointments</h3>
          <p className='text-gray-600'>
            Book appointments instantly with our streamlined process. 
            No more waiting on hold or lengthy booking procedures.
          </p>
        </div>

        <div className='text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-300'>
          <div className='w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-800 mb-3'>Secure & Private</h3>
          <p className='text-gray-600'>
            Your health information is protected with industry-leading security measures. 
            Complete privacy and confidentiality guaranteed.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className='bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          <div>
            <h4 className='text-3xl font-bold mb-2'>100+</h4>
            <p className='text-gray-300'>Expert Doctors</p>
          </div>
          <div>
            <h4 className='text-3xl font-bold mb-2'>50K+</h4>
            <p className='text-gray-300'>Happy Patients</p>
          </div>
          <div>
            <h4 className='text-3xl font-bold mb-2'>15+</h4>
            <p className='text-gray-300'>Specializations</p>
          </div>
          <div>
            <h4 className='text-3xl font-bold mb-2'>24/7</h4>
            <p className='text-gray-300'>Support Available</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className='text-center mt-16'>
        <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
          Ready to Take Control of Your Health?
        </h3>
        <p className='text-gray-600 mb-8 max-w-2xl mx-auto'>
          Join thousands of satisfied patients who have found the perfect healthcare solution 
          through our platform. Start your journey to better health today.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <a 
            href='#speciality' 
            className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300 inline-flex items-center justify-center gap-2'
          >
            Browse Doctors
            <img className='w-4' src={assets.arrow_icon} alt="" />
          </a>
          <button className='border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-full font-medium transition-colors duration-300'>
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default Introduction
