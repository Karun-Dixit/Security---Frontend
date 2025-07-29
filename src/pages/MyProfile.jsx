import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { api } from '../services/apiClient';

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      formData.append('userId', userData._id);
      if (image) formData.append('image', image);

      const { data } = await api.post('/api/user/update-profile', formData);

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return userData ? (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h1 className='text-3xl font-bold mb-2'>My Profile</h1>
          <p className='text-blue-100'>Manage your personal information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          {/* Profile image section */}
          <div className="bg-blue-50 py-10 px-6 text-center">
            <div className="relative inline-block">
              {isEdit ? (
                <label htmlFor="image" className="cursor-pointer">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                    <img
                      className="w-full h-full object-cover"
                      src={image ? URL.createObjectURL(image) : userData.image}
                      alt="Profile"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-2 shadow-md">
                    <img className="w-5 h-5" src={assets.upload_icon} alt="Upload" />
                  </div>
                  <input
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                        if (!validTypes.includes(file.type)) {
                          toast.error('Only .png, .jpeg, and .jpg files are allowed.');
                          return;
                        }
                        setImage(file);
                      }
                    }}
                    type="file"
                    id="image"
                    hidden
                  />
                </label>
              ) : (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                  <img
                    className="w-full h-full object-cover"
                    src={userData.image}
                    alt="Profile"
                  />
                </div>
              )}
            </div>

            {isEdit ? (
              <input
                className="mt-4 text-center text-2xl font-semibold bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none px-2 py-1"
                type="text"
                onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                value={userData.name}
              />
            ) : (
              <h2 className="mt-4 text-2xl font-semibold text-gray-800">{userData.name}</h2>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Contact Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-blue-600">{userData.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                  {isEdit ? (
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      type="text"
                      onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                      value={userData.phone}
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-700">{userData.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                  {isEdit ? (
                    <div className="space-y-2">
                      <input
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="text"
                        placeholder="Address Line 1"
                        onChange={(e) => setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))}
                        value={userData.address.line1}
                      />
                      <input
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="text"
                        placeholder="Address Line 2"
                        onChange={(e) => setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))}
                        value={userData.address.line2}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-700">
                        {userData.address.line1}<br />
                        {userData.address.line2}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  {isEdit ? (
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                      value={userData.gender}
                    >
                      <option value="Not Selected">Not Selected</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-700">{userData.gender}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Birthday</label>
                  {isEdit ? (
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      type="date"
                      onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                      value={userData.dob}
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-700">{userData.dob}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              {isEdit ? (
                <div className="space-x-4">
                  <button
                    onClick={updateUserProfileData}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    Save Information
                  </button>
                  <button
                    onClick={() => setIsEdit(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default MyProfile;