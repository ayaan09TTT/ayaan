import api from './api';

const chatService = {
  /**
   * Get chat messages for a specific room
   * @param {string} roomId - Trade room ID
   * @param {Object} options - Pagination options
   * @returns {Promise<Array>} Chat messages
   */
  getRoomMessages: async (roomId, options = {}) => {
    try {
      const response = await api.get(`/chat/messages/${roomId}`, { params: options });
      return response;
    } catch (error) {
      console.error('Get room messages error:', error);
      throw error;
    }
  },

  /**
   * Send a chat message
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Created message
   */
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/chat/messages', messageData);
      return response;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  /**
   * Mark messages as read
   * @param {string} roomId - Trade room ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Response with success status
   */
  markMessagesAsRead: async (roomId, userId) => {
    try {
      const response = await api.post('/chat/mark-read', { roomId, userId });
      return response;
    } catch (error) {
      console.error('Mark messages as read error:', error);
      throw error;
    }
  },

  /**
   * Get unread message count for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Unread message counts per room
   */
  getUnreadCount: async (userId) => {
    try {
      const response = await api.get(`/chat/unread-count/${userId}`);
      return response;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  },

  /**
   * Upload and attach a file to a message
   * @param {string} messageId - Message ID
   * @param {File} file - File to attach
   * @returns {Promise<Object>} Updated message with file URL
   */
  attachFileToMessage: async (messageId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/chat/messages/${messageId}/attach-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Attach file error:', error);
      throw error;
    }
  },

  /**
   * Get active chat rooms for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Active chat rooms
   */
  getUserChatRooms: async (userId) => {
    try {
      const response = await api.get(`/chat/rooms/${userId}`);
      return response;
    } catch (error) {
      console.error('Get user chat rooms error:', error);
      throw error;
    }
  },
};

export default chatService;