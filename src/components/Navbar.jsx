import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData, logout } = useContext(AppContext)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className='flex items-center justify-between py-6 mb-8 backdrop-blur-sm bg-white/80 sticky top-0 z-50 border-b border-gray-100 shadow-sm'>
      {/* Only show Carepoint as a clickable brand name, no logo */}
      <span onClick={() => navigate('/')} className='font-bold text-2xl text-[#1a237e] cursor-pointer select-none transition-transform duration-200 hover:scale-110 hover:text-blue-600'>Carepoint</span>

      <ul className='md:flex items-center gap-8 font-medium hidden'>
        <NavLink to='/' className={({ isActive }) => `relative group px-4 py-2 rounded-full transition-all duration-300 ${isActive ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>
          <li className='py-1 font-semibold tracking-wide text-sm uppercase'>HOME</li>
        </NavLink>
        <NavLink to='/doctors' className={({ isActive }) => `relative group px-4 py-2 rounded-full transition-all duration-300 ${isActive ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>
          <li className='py-1 font-semibold tracking-wide text-sm uppercase'>ALL DOCTORS</li>
        </NavLink>
        <NavLink to='/about' className={({ isActive }) => `relative group px-4 py-2 rounded-full transition-all duration-300 ${isActive ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>
          <li className='py-1 font-semibold tracking-wide text-sm uppercase'>ABOUT</li>
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => `relative group px-4 py-2 rounded-full transition-all duration-300 ${isActive ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>
          <li className='py-1 font-semibold tracking-wide text-sm uppercase'>CONTACT</li>
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {
          token && userData
            ? <div className='flex items-center gap-3 cursor-pointer group relative'>
              <div className='relative'>
                <img className='w-10 h-10 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300' src={userData.image} alt="" />
                <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
              </div>
              <img className='w-3 transition-transform duration-300 group-hover:rotate-180' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-16 text-base font-medium text-gray-700 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300'>
                <div className='min-w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden'>
                  <div className='bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-gray-100'>
                    <p className='font-semibold text-gray-800'>{userData.name}</p>
                    <p className='text-sm text-gray-600'>{userData.email}</p>
                  </div>
                  <div className='p-2'>
                    <p onClick={() => navigate('/my-profile')} className='hover:bg-gray-50 hover:text-primary cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3'>
                      <span className='w-2 h-2 bg-primary rounded-full'></span>
                      My Profile
                    </p>
                    <p onClick={() => navigate('/my-appointments')} className='hover:bg-gray-50 hover:text-primary cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3'>
                      <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                      My Appointments
                    </p>
                    <p onClick={handleLogout} className='hover:bg-red-50 hover:text-red-600 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3'>
                      <span className='w-2 h-2 bg-red-500 rounded-full'></span>
                      Logout
                    </p>
                  </div>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-3 rounded-full font-medium hidden md:block hover:shadow-lg hover:scale-105 transition-all duration-300 backdrop-blur-sm'>
              Create account
            </button>
        }
        <button onClick={() => setShowMenu(true)} className='w-8 h-8 md:hidden flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all duration-300'>
          <img className='w-6' src={assets.menu_icon} alt="" />
        </button>

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-50 overflow-hidden bg-white/95 backdrop-blur-lg transition-all duration-500`}>
          <div className='flex items-center justify-between px-6 py-6 border-b border-gray-100'>
            <img src={assets.logo} className='w-36' alt="" />
            <button onClick={() => setShowMenu(false)} className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300'>
              <img src={assets.cross_icon} className='w-6' alt="" />
            </button>
          </div>
          <div className='p-6'>
            <ul className='flex flex-col gap-3'>
              <NavLink onClick={() => setShowMenu(false)} to='/' className={({ isActive }) => `block p-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-50'}`}>
                <p className='font-semibold text-lg'>HOME</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/doctors' className={({ isActive }) => `block p-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-50'}`}>
                <p className='font-semibold text-lg'>ALL DOCTORS</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/about' className={({ isActive }) => `block p-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-50'}`}>
                <p className='font-semibold text-lg'>ABOUT</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/contact' className={({ isActive }) => `block p-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-50'}`}>
                <p className='font-semibold text-lg'>CONTACT</p>
              </NavLink>
            </ul>
            {!token && (
              <button onClick={() => { navigate('/login'); setShowMenu(false); }} className='w-full mt-6 bg-gradient-to-r from-primary to-primary/80 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300'>
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar