import api from './api';

// Helper to get users from localStorage
const getStoredUsers = () => {
  const users = localStorage.getItem('tradeforge_users');
  if (users) {
    return JSON.parse(users);
  } else {
    // Create default user if none exist
    const defaultUser = {
      _id: 'user_default123',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      phone: '1234567890',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 5.0,
      verified: false
    };
    
    const defaultUsers = [defaultUser];
    localStorage.setItem('tradeforge_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
};

// Helper to save users to localStorage
const saveUsersToStorage = (users) => {
  localStorage.setItem('tradeforge_users', JSON.stringify(users));
};

// Generate a token
const generateToken = () => {
  return 'tf_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response with user and token
   */
  register: async (userData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getStoredUsers();
      
      // Check if email already exists
      if (users.find(user => user.email === userData.email)) {
        throw { response: { data: { message: 'Email already in use' } } };
      }
      
      const newUser = {
        _id: 'user_' + Math.random().toString(36).substring(2, 9),
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 5.0,
        verified: false
      };
      
      // Add user to storage
      users.push(newUser);
      saveUsersToStorage(users);
      
      // Generate token
      const token = generateToken();
      localStorage.setItem('tradeforge_current_user_token', token);
      localStorage.setItem('tradeforge_current_user', JSON.stringify(newUser));
      
      return { user: newUser, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Log in a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Response with user and token
   */
  login: async (email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getStoredUsers();
      
      // Find user by email (in real app we'd check password too)
      const user = users.find(user => user.email === email);
      
      if (!user) {
        throw { response: { data: { message: 'Invalid email or password' } } };
      }
      
      // Generate token
      const token = generateToken();
      localStorage.setItem('tradeforge_current_user_token', token);
      localStorage.setItem('tradeforge_current_user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Get current user profile using saved token
   * @returns {Promise<Object>} User data
   */
  getCurrentUser: async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userJson = localStorage.getItem('tradeforge_current_user');
      if (!userJson) {
        throw new Error('No user logged in');
      }
      
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - User profile data to update
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (userData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getStoredUsers();
      const currentUserJson = localStorage.getItem('tradeforge_current_user');
      
      if (!currentUserJson) {
        throw new Error('No user logged in');
      }
      
      const currentUser = JSON.parse(currentUserJson);
      
      // Find and update user
      const updatedUsers = users.map(user => {
        if (user._id === currentUser._id) {
          const updatedUser = {
            ...user,
            ...userData,
            updatedAt: new Date().toISOString()
          };
          // Update current user in local storage
          localStorage.setItem('tradeforge_current_user', JSON.stringify(updatedUser));
          return updatedUser;
        }
        return user;
      });
      
      saveUsersToStorage(updatedUsers);
      return JSON.parse(localStorage.getItem('tradeforge_current_user'));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Verify email or phone using code
   * @param {Object} verificationData - Data for verification
   * @returns {Promise<Object>} Response with success status
   */
  verify: async (verificationData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getStoredUsers();
      const currentUserJson = localStorage.getItem('tradeforge_current_user');
      
      if (!currentUserJson) {
        throw new Error('No user logged in');
      }
      
      const currentUser = JSON.parse(currentUserJson);
      
      // Find and update user verification status
      const updatedUsers = users.map(user => {
        if (user._id === currentUser._id) {
          const updatedUser = {
            ...user,
            verified: true,
            updatedAt: new Date().toISOString()
          };
          // Update current user in local storage
          localStorage.setItem('tradeforge_current_user', JSON.stringify(updatedUser));
          return updatedUser;
        }
        return user;
      });
      
      saveUsersToStorage(updatedUsers);
      return { success: true, message: 'Verification successful' };
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  },
};

// Function to update profile, exported separately to match import in ProfilePage
const updateProfile = async (profileData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStoredUsers();
    const currentUserJson = localStorage.getItem('tradeforge_current_user');
    
    if (!currentUserJson) {
      throw new Error('No user logged in');
    }
    
    const currentUser = JSON.parse(currentUserJson);
    
    // Find and update user
    const updatedUsers = users.map(user => {
      if (user._id === currentUser._id) {
        const updatedUser = {
          ...user,
          ...profileData, // Update with provided profile data
          updatedAt: new Date().toISOString()
        };
        // Update current user in local storage
        localStorage.setItem('tradeforge_current_user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return user;
    });
    
    saveUsersToStorage(updatedUsers);
    return JSON.parse(localStorage.getItem('tradeforge_current_user'));
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Function to update password
const updatePassword = async (oldPassword, newPassword) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStoredUsers();
    const currentUserJson = localStorage.getItem('tradeforge_current_user');
    
    if (!currentUserJson) {
      throw new Error('No user logged in');
    }
    
    const currentUser = JSON.parse(currentUserJson);
    
    // In a real app, we'd verify the old password
    // Here we'll just update the password
    
    // Find and update user
    const updatedUsers = users.map(user => {
      if (user._id === currentUser._id) {
        const updatedUser = {
          ...user,
          password: newPassword,
          updatedAt: new Date().toISOString()
        };
        return updatedUser;
      }
      return user;
    });
    
    saveUsersToStorage(updatedUsers);
    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

export { updateProfile, updatePassword };
export default authService;