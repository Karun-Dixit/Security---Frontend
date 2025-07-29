import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header Section */}
      <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16'>
        <div className='max-w-6xl mx-auto px-6 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Contact Us</h1>
          <p className='text-blue-100 text-lg'>Get in touch with our team</p>
          <div className='w-20 h-1 bg-white mx-auto mt-4 rounded-full'></div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-16'>

        {/* Contact Content */}
        <div className='grid md:grid-cols-2 gap-12 items-start'>

          {/* Contact Image */}
          <div>
            <img
              className='w-full rounded-2xl shadow-lg'
              src={assets.contact_image}
              alt="Contact Us"
            />
          </div>

          {/* Contact Information */}
          <div className='space-y-8'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>Our Office</h2>

              <div className='space-y-6'>
                <div className='bg-white rounded-xl p-6 shadow-lg border border-blue-100'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
                    <span className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3'>
                      📍
                    </span>
                    Address
                  </h3>
                  <p className='text-gray-600 ml-11'>
                    54709 Willms Station <br />
                    Suite 350, Washington, USA
                  </p>
                </div>

                <div className='bg-white rounded-xl p-6 shadow-lg border border-blue-100'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
                    <span className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3'>
                      📞
                    </span>
                    Phone
                  </h3>
                  <p className='text-gray-600 ml-11'>
                    Tel: (415) 555-0132 <br />
                    Mobile: (415) 555-0198
                  </p>
                </div>

                <div className='bg-white rounded-xl p-6 shadow-lg border border-blue-100'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
                    <span className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3'>
                      ✉️
                    </span>
                    Email
                  </h3>
                  <p className='text-gray-600 ml-11'>
                    greatstackdev@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500'>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>Careers at Carepoint</h3>
              <p className='text-gray-700 leading-relaxed mb-4'>
                Learn more about our teams and job openings.
              </p>
              <button className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors'>
                Explore Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact