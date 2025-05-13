import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '@/components/Layout/dashboard';
import { 
  UserCircleIcon, 
  BellIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const { user, userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    emailNotifications: false,
    smsNotifications: false,
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || '',
        phoneNumber: userData.phoneNumber || '',
        emailNotifications: userData.emailNotifications || false,
        smsNotifications: userData.smsNotifications || false,
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      if (user?.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          displayName: formData.displayName,
          phoneNumber: formData.phoneNumber,
          emailNotifications: formData.emailNotifications,
          smsNotifications: formData.smsNotifications,
          updatedAt: new Date(),
        });
        
        // Refresh user data in context
        if (refreshUserData) {
          await refreshUserData();
        }
        
        setSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 shadow-sm">
        <div className="flex items-center">
          <CogIcon className="h-7 w-7 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600 mt-1 font-medium">
              Manage your account preferences and notification settings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-200">
              <div className="bg-blue-100 rounded-full p-6 mb-4">
                <UserCircleIcon className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {userData?.displayName || 'User Profile'}
              </h2>
              <p className="text-gray-500 mt-1">{user?.email}</p>
              <div className="mt-3 inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                {userData?.role || 'User'}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Settings Menu</h3>
              <nav className="space-y-2">
                <a href="#profile" className="flex items-center px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium">
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  Profile Information
                </a>
                <a href="#notifications" className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                  <BellIcon className="h-5 w-5 mr-3" />
                  Notification Preferences
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-xl p-6">
            <div>
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
                  <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                  <span>Settings updated successfully!</span>
                </div>
              )}

              <div id="profile" className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center mb-6">
                  <UserCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg mb-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="displayName">
                      Display Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phoneNumber">
                      Phone Number
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+1234567890"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 ml-1">
                      Used for SMS notifications and important updates
                    </p>
                  </div>
                </div>
              </div>

              <div id="notifications" className="mb-8">
                <div className="flex items-center mb-6">
                  <BellIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="mb-5 flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:border-blue-200 transition-colors">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-6 w-6 text-gray-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.emailNotifications ? 'translate-x-6' : ''}`}></div>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:border-blue-200 transition-colors">
                    <div className="flex items-center">
                      <PhoneIcon className="h-6 w-6 text-gray-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">Receive updates via text message</p>
                      </div>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="smsNotifications"
                        name="smsNotifications"
                        type="checkbox"
                        checked={formData.smsNotifications}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.smsNotifications ? 'translate-x-6' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end border-t border-gray-200 pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm focus:ring-4 focus:ring-blue-200 flex items-center transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;