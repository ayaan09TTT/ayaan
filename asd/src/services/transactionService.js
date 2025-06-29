import api from './api';

const transactionService = {
  /**
   * Initiate a transaction for a trade
   * @param {Object} transactionData - Transaction details
   * @returns {Promise<Object>} Created transaction
   */
  initiateTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response;
    } catch (error) {
      console.error('Initiate transaction error:', error);
      throw error;
    }
  },

  /**
   * Approve a transaction (buyer confirms receipt)
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Updated transaction
   */
  approveTransaction: async (transactionId) => {
    try {
      const response = await api.post(`/transactions/${transactionId}/approve`);
      return response;
    } catch (error) {
      console.error('Approve transaction error:', error);
      throw error;
    }
  },

  /**
   * File a dispute for a transaction
   * @param {string} transactionId - Transaction ID
   * @param {string} reason - Reason for dispute
   * @returns {Promise<Object>} Updated transaction with dispute status
   */
  disputeTransaction: async (transactionId, reason) => {
    try {
      const response = await api.post(`/transactions/${transactionId}/dispute`, { reason });
      return response;
    } catch (error) {
      console.error('Dispute transaction error:', error);
      throw error;
    }
  },

  /**
   * Mark item as delivered in a transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Updated transaction
   */
  markItemDelivered: async (transactionId) => {
    try {
      const response = await api.post(`/transactions/${transactionId}/deliver`);
      return response;
    } catch (error) {
      console.error('Mark delivered error:', error);
      throw error;
    }
  },

  /**
   * Cancel a transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Cancelled transaction
   */
  cancelTransaction: async (transactionId) => {
    try {
      const response = await api.post(`/transactions/${transactionId}/cancel`);
      return response;
    } catch (error) {
      console.error('Cancel transaction error:', error);
      throw error;
    }
  },

  /**
   * Get transaction details by ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction details
   */
  getTransactionById: async (transactionId) => {
    try {
      const response = await api.get(`/transactions/${transactionId}`);
      return response;
    } catch (error) {
      console.error('Get transaction error:', error);
      throw error;
    }
  },

  /**
   * Get all transactions for a user
   * @param {string} userId - User ID
   * @param {Object} options - Pagination and filtering options
   * @returns {Promise<Array>} User transactions
   */
  getUserTransactions: async (userId, options = {}) => {
    try {
      const response = await api.get(`/transactions/user/${userId}`, { params: options });
      return response;
    } catch (error) {
      console.error('Get user transactions error:', error);
      // For demo purposes, return mock transactions
      return Array.from({ length: options.limit || 5 }, (_, i) => ({
        _id: `txn-${i + 1}`,
        tradeRoom: {
          _id: `room-${i + 1}`,
          title: `Trade Room ${i + 1}`
        },
        seller: {
          _id: `seller-${i + 1}`,
          fullName: `Seller ${i + 1}`
        },
        buyer: {
          _id: `buyer-${i + 1}`,
          fullName: `Buyer ${i + 1}`
        },
        amount: Math.floor(Math.random() * 5000) + 1000,
        platformFee: Math.floor(Math.random() * 250) + 50,
        status: ['completed', 'in_escrow', 'awaiting_delivery', 'disputed', 'completed'][i % 5],
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date(Date.now() - (i * 20 * 60 * 60 * 1000)).toISOString()
      }));
    }
  },
};

export default transactionService;