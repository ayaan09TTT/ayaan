import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, updatePassword } from '../../services/authService';

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        email: currentUser.email || ''
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    setProfileLoading(true);
    
    try {
      const updatedUser = await updateProfile(profileForm);
      setCurrentUser({
        ...currentUser,
        ...updatedUser
      });
      setProfileMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });
    } catch (error) {
      setProfileMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    
    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordMessage({ 
        type: 'error', 
        text: 'New passwords do not match.' 
      });
    }
    
    if (passwordForm.newPassword.length < 6) {
      return setPasswordMessage({ 
        type: 'error', 
        text: 'New password must be at least 6 characters.' 
      });
    }
    
    setPasswordLoading(true);
    
    try {
      await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      // Reset password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordMessage({ 
        type: 'success', 
        text: 'Password changed successfully!' 
      });
    } catch (error) {
      setPasswordMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update password. Please check your current password and try again.' 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Profile Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 transition-colors duration-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Personal Information</h2>
        
        {profileMessage.text && (
          <div 
            className={`mb-4 p-3 rounded ${
              profileMessage.type === 'success' 
                ? 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-400'
            }`}
          >
            {profileMessage.text}
          </div>
        )}
        
        <form onSubmit={handleProfileSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              required
            />
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileLoading}
              className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                profileLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors duration-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Change Password</h2>
        
        {passwordMessage.text && (
          <div 
            className={`mb-4 p-3 rounded ${
              passwordMessage.type === 'success' 
                ? 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-400'
            }`}
          >
            {passwordMessage.text}
          </div>
        )}
        
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="currentPassword" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              required
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="newPassword" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              required
              minLength={6}
            />
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              required
              minLength={6}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                passwordLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;