import api from './api';

const userService = {
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile data
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  /**
   * Get user's public profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User's public profile data
   */
  getPublicProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/public`);
      return response;
    } catch (error) {
      console.error('Get public profile error:', error);
      throw error;
    }
  },

  /**
   * Update user's profile picture
   * @param {File} imageFile - Image file
   * @returns {Promise<Object>} Updated user data
   */
  updateProfilePicture: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', imageFile);
      
      const response = await api.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Update profile picture error:', error);
      throw error;
    }
  },

  /**
   * Get user's active trades
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of active trades
   */
  getActiveTrades: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/trades/active`);
      return response;
    } catch (error) {
      console.error('Get active trades error:', error);
      // For demo purposes, return mock data
      return [
        {
          _id: 'trade1',
          title: 'Premium Gaming Account',
          otherParty: 'John Doe',
          status: 'in_escrow',
          amount: 5000,
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'trade2',
          title: 'Rare Game Items Collection',
          otherParty: 'Jane Smith',
          status: 'awaiting_delivery',
          amount: 3500,
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
  },

  /**
   * Get user's rating and reviews
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Rating and reviews data
   */
  getRatingAndReviews: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/ratings`);
      return response;
    } catch (error) {
      console.error('Get ratings error:', error);
      throw error;
    }
  },

  /**
   * Submit a rating for a user
   * @param {string} userId - User ID to rate
   * @param {Object} ratingData - Rating data including score and review
   * @returns {Promise<Object>} Updated rating data
   */
  submitRating: async (userId, ratingData) => {
    try {
      const response = await api.post(`/users/${userId}/ratings`, ratingData);
      return response;
    } catch (error) {
      console.error('Submit rating error:', error);
      throw error;
    }
  },
};

export default userService;