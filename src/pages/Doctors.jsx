import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-6 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Browse through the doctors specialist</h1>
          <div className='w-20 h-1 bg-white mx-auto rounded-full'></div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='flex flex-col sm:flex-row items-start gap-5'>
          
          {/* Filter Button for Mobile */}
          <button 
            className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-blue-500 text-white' : 'border-gray-300'}`} 
            onClick={() => setShowFilter(prev => !prev)}
          >
            Filters
          </button>
          
          {/* Filter Menu */}
          <div className={`flex-shrink-0 ${showFilter ? 'flex' : 'hidden sm:flex'} flex-col gap-4 text-sm text-gray-600`}>
            <div className='bg-white rounded-xl shadow-lg p-6 w-full sm:w-64'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <span className='w-6 h-6 bg-blue-500 rounded mr-2'></span>
                Specialties
              </h3>
              <div className='space-y-2'>
                {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((spec) => (
                  <p 
                    key={spec}
                    onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)} 
                    className={`w-full py-2 px-3 border border-gray-300 rounded-lg cursor-pointer transition-all ${speciality === spec ? 'bg-blue-500 text-white' : 'hover:bg-blue-50 hover:border-blue-200'}`}
                  >
                    {spec}
                  </p>
                ))}
              </div>
            </div>
          </div>
          
          {/* Doctors Grid */}
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filterDoc.map((item, index) => (
              <div 
                onClick={() => navigate(`/appointment/${item._id}`)} 
                className='bg-white border border-blue-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1' 
                key={index}
              >
                <div className='bg-blue-50 p-4'>
                  <img 
                    className='w-full h-48 object-cover rounded-lg' 
                    src={item.image} 
                    alt={item.name} 
                  />
                </div>
                <div className='p-6'>
                  <div className='flex items-center gap-2 text-sm text-center text-blue-600 mb-2'>
                    <p className='w-2 h-2 bg-blue-500 rounded-full'></p>
                    <p>Available</p>
                  </div>
                  <p className='text-gray-800 text-lg font-medium mb-1'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                  <div className='mt-3 pt-3 border-t border-gray-100'>
                    <p className='text-blue-600 font-medium'>View Profile →</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors