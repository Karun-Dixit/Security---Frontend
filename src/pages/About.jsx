import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header Section */}
      <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16'>
        <div className='max-w-6xl mx-auto px-6 text-center'>
          <h1 className='text-4xl font-bold mb-4'>About Us</h1>
          <div className='w-20 h-1 bg-white mx-auto rounded-full'></div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-6 py-16'>

        {/* About Section */}
        <div className='grid lg:grid-cols-2 gap-12 items-center mb-20'>
          <div>
            <img
              className='w-full rounded-2xl shadow-lg'
              src={assets.about_image}
              alt="About Carepoint"
            />
          </div>

          <div className='space-y-6'>
            <div className='space-y-4 text-gray-700 leading-relaxed'>
              <p className='text-lg'>
                Welcome to Carepoint, your trusted partner in managing your healthcare needs conveniently and efficiently. At Carepoint, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
              </p>
              <p className='text-lg'>
                Carepoint is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Carepoint is here to support you every step of the way.
              </p>
            </div>

            <div className='bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500'>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>Our Vision</h3>
              <p className='text-gray-700 leading-relaxed'>
                Our vision at Carepoint is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            Why Choose Us
          </h2>
          <div className='w-16 h-1 bg-blue-500 mx-auto rounded-full'></div>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {[
            {
              title: "EFFICIENCY",
              description: "Streamlined appointment scheduling that fits into your busy lifestyle.",
              icon: "⚡"
            },
            {
              title: "CONVENIENCE",
              description: "Access to a network of trusted healthcare professionals in your area.",
              icon: "🏥"
            },
            {
              title: "PERSONALIZATION",
              description: "Tailored recommendations and reminders to help you stay on top of your health.",
              icon: "🎯"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 hover:border-blue-200'
            >
              <div className='text-3xl mb-4'>{feature.icon}</div>
              <h3 className='text-xl font-bold text-gray-800 mb-4'>{feature.title}</h3>
              <p className='text-gray-600 leading-relaxed'>{feature.description}</p>
              <div className='mt-4 w-full h-1 bg-blue-100 rounded-full'>
                <div className='h-1 bg-blue-500 rounded-full w-1/3'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About