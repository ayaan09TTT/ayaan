/**
 * Service for handling wallet-related functionality with localStorage persistence
 */

// Helper to get wallet data from localStorage
const getWalletData = (userId) => {
  const wallets = localStorage.getItem('tradeforge_wallets');
  const walletsData = wallets ? JSON.parse(wallets) : {};
  
  if (!walletsData[userId]) {
    // Give new users a starting balance of 1000 coins
    walletsData[userId] = {
      balance: 1000,
      transactions: [{
        id: `welcome-${Date.now()}`,
        type: 'deposit',
        amount: 1000,
        status: 'completed',
        createdAt: new Date().toISOString(),
        description: 'Welcome bonus'
      }]
    };
    localStorage.setItem('tradeforge_wallets', JSON.stringify(walletsData));
  }
  
  return walletsData[userId];
};

// Helper to save wallet data to localStorage
const saveWalletData = (userId, walletData) => {
  const wallets = localStorage.getItem('tradeforge_wallets');
  const walletsData = wallets ? JSON.parse(wallets) : {};
  
  walletsData[userId] = walletData;
  localStorage.setItem('tradeforge_wallets', JSON.stringify(walletsData));
};

// Generate a transaction ID
const generateTransactionId = () => {
  return 'tx_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const walletService = {
  /**
   * Get user's wallet balance
   * @param {string} userId - User ID
   * @returns {Promise<number>} - User's balance
   */
  getBalance: async (userId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const walletData = getWalletData(userId);
      return walletData.balance;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  },

  /**
   * Get transaction history for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Transaction history
   */
  getTransactionHistory: async (userId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const walletData = getWalletData(userId);
      return walletData.transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  },

  /**
   * Add funds to user's wallet
   * @param {string} userId - User ID
   * @param {number} amount - Amount to add
   * @param {string} source - Source of funds (e.g., 'razorpay', 'promocode')
   * @returns {Promise<Object>} - Updated wallet data
   */
  addFunds: async (userId, amount, source = 'deposit') => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const walletData = getWalletData(userId);
      
      // Update balance
      walletData.balance += amount;
      
      // Create transaction record
      const transaction = {
        id: generateTransactionId(),
        type: 'deposit',
        amount: amount,
        status: 'completed',
        timestamp: new Date().toISOString(),
        description: `Added ${amount} coins via ${source}`,
        paymentId: 'pay_' + Math.random().toString(36).substring(2, 10)
      };
      
      // Add to transactions history
      walletData.transactions.unshift(transaction);
      
      // Save updated wallet
      saveWalletData(userId, walletData);
      
      return {
        success: true,
        balance: walletData.balance,
        transaction: transaction
      };
    } catch (error) {
      console.error('Error adding funds:', error);
      throw error;
    }
  },

  /**
   * Create an order for payment
   * @param {string} userId - User ID
   * @param {number} amount - Amount in coins
   * @returns {Promise<Object>} - Order details
   */
  createOrder: async (userId, amount) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create order ID
      const orderId = 'order_' + Math.random().toString(36).substring(2, 10);
      
      // Store the order info in localStorage
      const orders = localStorage.getItem('tradeforge_orders') || '[]';
      const ordersArray = JSON.parse(orders);
      
      ordersArray.push({
        id: orderId,
        userId: userId,
        amount: amount,
        status: 'created',
        createdAt: new Date().toISOString()
      });
      
      localStorage.setItem('tradeforge_orders', JSON.stringify(ordersArray));
      
      return {
        id: orderId,
        amount: amount * 100, // Assuming amount needs to be in smaller units like cents
        currency: 'INR',
        receipt: 'receipt_' + Math.random().toString(36).substring(2, 10)
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Verify payment after payment gateway callback
   * @param {string} userId - User ID
   * @param {Object} paymentData - Payment verification data
   * @returns {Promise<Object>} - Verification result
   */
  verifyPayment: async (userId, paymentData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the order status
      const orders = localStorage.getItem('tradeforge_orders') || '[]';
      const ordersArray = JSON.parse(orders);
      
      const orderIndex = ordersArray.findIndex(order => order.id === paymentData.orderId);
      
      if (orderIndex >= 0) {
        ordersArray[orderIndex].status = 'paid';
        localStorage.setItem('tradeforge_orders', JSON.stringify(ordersArray));
        
        // Add funds to wallet
        const amount = ordersArray[orderIndex].amount;
        await walletService.addFunds(userId, amount, 'payment_gateway');
        
        return {
          success: true,
          message: 'Payment verified successfully',
          transaction: {
            id: 'tx_' + Math.random().toString(36).substring(2, 10),
            amount: amount,
            status: 'completed'
          }
        };
      } else {
        throw new Error('Order not found');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  /**
   * Request a withdrawal of funds
   * @param {string} userId - User ID
   * @param {number} amount - Amount to withdraw
   * @param {Object} bankDetails - Bank account details
   * @returns {Promise<Object>} - Withdrawal request status
   */
  requestWithdrawal: async (userId, amount, bankDetails) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const walletData = getWalletData(userId);
      
      // Check if user has sufficient balance
      if (walletData.balance < amount) {
        throw new Error('Insufficient balance');
      }
      
      // Update balance
      walletData.balance -= amount;
      
      // Create transaction record
      const transaction = {
        id: generateTransactionId(),
        type: 'withdrawal',
        amount: amount,
        status: 'processing', // Initially processing, would be confirmed later in a real system
        timestamp: new Date().toISOString(),
        description: 'Withdrawal to bank account',
        bankDetails: bankDetails
      };
      
      // Add to transactions history
      walletData.transactions.unshift(transaction);
      
      // Save updated wallet
      saveWalletData(userId, walletData);
      
      return {
        success: true,
        message: 'Withdrawal request submitted successfully',
        transaction: transaction
      };
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      throw error;
    }
  },
  
  /**
   * Transfer coins to another user (for trade transactions)
   * @param {string} fromUserId - Sender user ID
   * @param {string} toUserId - Receiver user ID
   * @param {number} amount - Amount to transfer
   * @param {string} description - Transaction description
   * @returns {Promise<Object>} - Transfer status
   */
  transferFunds: async (fromUserId, toUserId, amount, description = 'Trade payment') => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const senderWallet = getWalletData(fromUserId);
      const receiverWallet = getWalletData(toUserId);
      
      // Check if sender has sufficient balance
      if (senderWallet.balance < amount) {
        throw new Error('Insufficient balance');
      }
      
      // Create transaction ID to link sender and receiver transactions
      const transactionId = generateTransactionId();
      
      // Update sender's wallet
      senderWallet.balance -= amount;
      const senderTransaction = {
        id: transactionId,
        type: 'trade',
        amount: amount,
        status: 'completed',
        timestamp: new Date().toISOString(),
        description: description,
        toUserId: toUserId
      };
      senderWallet.transactions.unshift(senderTransaction);
      saveWalletData(fromUserId, senderWallet);
      
      // Update receiver's wallet
      receiverWallet.balance += amount;
      const receiverTransaction = {
        id: transactionId,
        type: 'trade',
        amount: amount,
        status: 'completed',
        timestamp: new Date().toISOString(),
        description: description,
        fromUserId: fromUserId
      };
      receiverWallet.transactions.unshift(receiverTransaction);
      saveWalletData(toUserId, receiverWallet);
      
      return {
        success: true,
        message: 'Transfer completed successfully',
        transaction: senderTransaction
      };
    } catch (error) {
      console.error('Error transferring funds:', error);
      throw error;
    }
  }
};

export default walletService;