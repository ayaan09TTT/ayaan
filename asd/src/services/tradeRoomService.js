/**
 * Service for handling trade room-related functionality with localStorage persistence
 */

// Helper to get trade rooms from localStorage
const getTradeRooms = () => {
  const rooms = localStorage.getItem('tradeforge_trade_rooms');
  return rooms ? JSON.parse(rooms) : [];
};

// Helper to save trade rooms to localStorage
const saveTradeRooms = (rooms) => {
  localStorage.setItem('tradeforge_trade_rooms', JSON.stringify(rooms));
};

// Initialize with example trade rooms
const initializeTradeRooms = () => {
  const exampleRooms = [
    {
      _id: `room-${Date.now()}-1`,
      title: 'Premium Fortnite Account',
      description: 'Level 100 account with rare skins and battle pass items from Season 1-10.',
      price: 2500,
      category: 'Gaming Accounts',
      tags: ['gaming', 'fortnite', 'account'],
      seller: {
        _id: 'user-example-1',
        fullName: 'John Doe',
        rating: 4.9
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      images: []
    },
    {
      _id: `room-${Date.now()}-2`,
      title: 'Adobe Creative Suite License',
      description: 'Full Adobe Creative Suite license with 1 year of updates remaining.',
      price: 3500,
      category: 'Software & Applications',
      tags: ['software', 'design', 'adobe'],
      seller: {
        _id: 'user-example-2',
        fullName: 'Jane Smith',
        rating: 4.7
      },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      images: []
    },
    {
      _id: `room-${Date.now()}-3`,
      title: 'Digital Marketing Course Bundle',
      description: 'Complete digital marketing course covering SEO, SEM, social media marketing, and email campaigns.',
      price: 1200,
      category: 'Courses & E-Learning',
      tags: ['marketing', 'education', 'digital'],
      seller: {
        _id: 'user-example-3',
        fullName: 'Mike Johnson',
        rating: 4.8
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      images: []
    }
  ];
  
  saveTradeRooms(exampleRooms);
  return exampleRooms;
};

const tradeRoomService = {
  /**
   * Create a new trade room
   * @param {Object} roomData - Trade room data
   * @returns {Promise<Object>} Created trade room
   */
  createRoom: async (roomData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Get current user from localStorage to set as seller
      const currentUserJson = localStorage.getItem('tradeforge_current_user');
      let seller = {
        _id: 'current-user-id',
        fullName: 'Current User',
        rating: 5.0
      };
      
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson);
        seller = {
          _id: currentUser._id,
          fullName: currentUser.fullName,
          rating: currentUser.rating || 5.0
        };
      }
      
      // Get existing rooms
      let rooms = getTradeRooms();
      
      // Create new room object
      const newRoom = {
        _id: `room-${Date.now()}`,
        title: roomData.title,
        description: roomData.description,
        price: roomData.price,
        category: roomData.category,
        tags: roomData.tags,
        seller: seller,
        createdAt: new Date().toISOString(),
        status: 'open',
        images: roomData.images || [],
        filePreviewUrl: roomData.filePreviewUrl || null,
        messages: []
      };
      
      // Add to rooms array
      rooms.unshift(newRoom);
      saveTradeRooms(rooms);
      
      return newRoom;
    } catch (error) {
      console.error('Create trade room error:', error);
      throw error;
    }
  },

  /**
   * Update an existing trade room
   * @param {string} roomId - Trade room ID
   * @param {Object} roomData - Updated trade room data
   * @returns {Promise<Object>} Updated trade room
   */
  updateRoom: async (roomId, roomData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Get current user from localStorage to verify ownership
      const currentUserJson = localStorage.getItem('tradeforge_current_user');
      if (!currentUserJson) {
        throw new Error('Must be logged in to update a trade room');
      }
      
      const currentUser = JSON.parse(currentUserJson);
      
      // Get existing rooms
      let rooms = getTradeRooms();
      
      // Find room index
      const roomIndex = rooms.findIndex(room => room._id === roomId);
      
      if (roomIndex === -1) {
        throw new Error('Trade room not found');
      }
      
      // Verify ownership (in a real app) - skipping for demo
      // if (rooms[roomIndex].seller._id !== currentUser._id) {
      //   throw new Error('You can only update your own trade rooms');
      // }
      
      // Update room
      rooms[roomIndex] = {
        ...rooms[roomIndex],
        ...roomData,
        updatedAt: new Date().toISOString()
      };
      
      saveTradeRooms(rooms);
      
      return rooms[roomIndex];
    } catch (error) {
      console.error('Update trade room error:', error);
      throw error;
    }
  },

  /**
   * Delete a trade room
   * @param {string} roomId - Trade room ID
   * @returns {Promise<Object>} Response with success status
   */
  deleteRoom: async (roomId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get current user from localStorage to verify ownership
      const currentUserJson = localStorage.getItem('tradeforge_current_user');
      if (!currentUserJson) {
        throw new Error('Must be logged in to delete a trade room');
      }
      
      const currentUser = JSON.parse(currentUserJson);
      
      // Get existing rooms
      let rooms = getTradeRooms();
      
      // Find room index
      const roomIndex = rooms.findIndex(room => room._id === roomId);
      
      if (roomIndex === -1) {
        throw new Error('Trade room not found');
      }
      
      // Verify ownership (in a real app) - skipping for demo
      // if (rooms[roomIndex].seller._id !== currentUser._id) {
      //   throw new Error('You can only delete your own trade rooms');
      // }
      
      // Remove room
      rooms.splice(roomIndex, 1);
      saveTradeRooms(rooms);
      
      return { success: true, message: 'Trade room deleted successfully' };
    } catch (error) {
      console.error('Delete trade room error:', error);
      throw error;
    }
  },

  /**
   * Get a trade room by ID
   * @param {string} roomId - Trade room ID
   * @returns {Promise<Object>} Trade room data
   */
  getRoomById: async (roomId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get trade rooms from localStorage
      let rooms = getTradeRooms();
      if (rooms.length === 0) {
        rooms = initializeTradeRooms();
      }
      
      // Find the room by ID
      const room = rooms.find(room => room._id === roomId);
      
      if (!room) {
        throw new Error('Trade room not found');
      }
      
      return room;
    } catch (error) {
      console.error('Get trade room error:', error);
      throw error;
    }
  },

  /**
   * List trade rooms with optional filters
   * @param {Object} filters - Filters for trade rooms
   * @returns {Promise<Array>} Array of trade rooms
   */
  listRooms: async (filters = {}) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get trade rooms from localStorage or initialize if empty
      let rooms = getTradeRooms();
      if (rooms.length === 0) {
        rooms = initializeTradeRooms();
      }
      
      return rooms;
    } catch (error) {
      console.error('List trade rooms error:', error);
      throw error;
    }
  },

  /**
   * Search trade rooms by query string
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching trade rooms
   */
  searchRooms: async (query) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Get trade rooms from localStorage
      let rooms = getTradeRooms();
      if (rooms.length === 0) {
        rooms = initializeTradeRooms();
      }
      
      // Simple search implementation
      if (!query || query.trim() === '') {
        return rooms;
      }
      
      const searchTerm = query.toLowerCase().trim();
      return rooms.filter(room => 
        room.title.toLowerCase().includes(searchTerm) || 
        room.description.toLowerCase().includes(searchTerm) ||
        room.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Search trade rooms error:', error);
      throw error;
    }
  },

  /**
   * Upload images for a trade room
   * @param {Array<File>} images - Array of image files
   * @returns {Promise<Object>} Response with image URLs
   */
  uploadImages: async (images) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Mock image URLs for development
      const imageUrls = images.map((_, index) => `https://example.com/mock-image-${Date.now()}-${index + 1}.jpg`);
      
      return { success: true, urls: imageUrls };
    } catch (error) {
      console.error('Upload images error:', error);
      throw error;
    }
  },

  /**
   * Upload preview file for a trade room
   * @param {File} file - Preview file
   * @returns {Promise<Object>} Response with file URL
   */
  uploadPreviewFile: async (file) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock file URL for development
      const fileUrl = `https://example.com/mock-preview-${Date.now()}.jpg`;
      
      return { success: true, url: fileUrl };
    } catch (error) {
      console.error('Upload preview file error:', error);
      throw error;
    }
  },
  
  /**
   * Add message to a trade room
   * @param {string} roomId - Trade room ID
   * @param {string} message - Message content
   * @returns {Promise<Object>} Message object
   */
  addMessage: async (roomId, message) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get current user from localStorage
      const currentUserJson = localStorage.getItem('tradeforge_current_user');
      if (!currentUserJson) {
        throw new Error('Must be logged in to send a message');
      }
      
      const currentUser = JSON.parse(currentUserJson);
      
      // Get existing rooms
      let rooms = getTradeRooms();
      
      // Find room index
      const roomIndex = rooms.findIndex(room => room._id === roomId);
      
      if (roomIndex === -1) {
        throw new Error('Trade room not found');
      }
      
      // Create message object
      const newMessage = {
        _id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        sender: {
          _id: currentUser._id,
          fullName: currentUser.fullName
        },
        content: message.trim(),
        createdAt: new Date().toISOString()
      };
      
      // Add message to room
      if (!rooms[roomIndex].messages) {
        rooms[roomIndex].messages = [];
      }
      
      rooms[roomIndex].messages.push(newMessage);
      saveTradeRooms(rooms);
      
      return newMessage;
    } catch (error) {
      console.error('Add message error:', error);
      throw error;
    }
  },
  
  /**
   * Create a transaction for a trade room
   * @param {string} roomId - Trade room ID
   * @param {string} buyerId - Buyer user ID
   * @returns {Promise<Object>} Transaction details
   */
  createTransaction: async (roomId, buyerId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get existing rooms
      let rooms = getTradeRooms();
      
      // Find room
      const roomIndex = rooms.findIndex(room => room._id === roomId);
      
      if (roomIndex === -1) {
        throw new Error('Trade room not found');
      }
      
      const room = rooms[roomIndex];
      
      // Check if room is available
      if (room.status !== 'open') {
        throw new Error('This item is no longer available for purchase');
      }
      
      // Update room status
      rooms[roomIndex].status = 'pending';
      rooms[roomIndex].transaction = {
        _id: `trans-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        buyerId: buyerId,
        sellerId: room.seller._id,
        amount: room.price,
        status: 'in_escrow',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      saveTradeRooms(rooms);
      
      return rooms[roomIndex].transaction;
    } catch (error) {
      console.error('Create transaction error:', error);
      throw error;
    }
  }
};

export default tradeRoomService;