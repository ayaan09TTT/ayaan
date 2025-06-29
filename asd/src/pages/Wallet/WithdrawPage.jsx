import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import walletService from '../../services/walletService';
import { AuthContext } from '../../contexts/AuthContext';

const WithdrawPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [balance, setBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [upiId, setUpiId] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsBalanceLoading(true);
        if (currentUser) {
          const userBalance = await walletService.getBalance(currentUser.id);
          setBalance(userBalance);
          // Prefill user name if available
          if (currentUser.name) {
            setAccountHolder(currentUser.name);
          }
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setIsBalanceLoading(false);
      }
    };

    fetchBalance();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'withdrawAmount') {
      // Only allow numbers
      if (/^\d*$/.test(value)) {
        setWithdrawAmount(value);
      }
    } else if (id === 'upiId') {
      setUpiId(value);
    } else if (id === 'accountHolder') {
      setAccountHolder(value);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate input
    const amount = parseInt(withdrawAmount);
    if (!amount) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (amount < 100) {
      setError('Minimum withdrawal is 100 coins');
      return;
    }
    
    if (amount > balance) {
      setError('Insufficient balance');
      return;
    }
    
    if (!upiId) {
      setError('Please enter your UPI ID');
      return;
    }
    
    if (!accountHolder) {
      setError('Please enter account holder name');
      return;
    }

    try {
      setIsLoading(true);
      
      // Call the withdrawal API
      const result = await walletService.requestWithdrawal(amount, {
        upiId,
        accountHolder,
      });
      
      if (result && result.success) {
        setSuccess(`Withdrawal request for ${amount} coins (₹${amount}) has been submitted successfully! The amount will be transferred to ${upiId} within 24 hours.`);
        
        setTimeout(() => {
          navigate('/wallet');
        }, 3000);
      } else {
        throw new Error('Withdrawal request failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError(error.message || 'Failed to process withdrawal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/wallet" className="text-blue-400 hover:text-blue-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Wallet
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Withdraw Coins</h1>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <div className="mb-6">
            <div className="bg-gray-700 p-4 rounded-md">
              <p className="text-gray-300">Available Balance</p>
              {isBalanceLoading ? (
                <div className="animate-pulse h-8 bg-gray-600 rounded mt-1 w-24"></div>
              ) : (
                <p className="text-2xl font-bold text-yellow-400">{balance} Coins</p>
              )}
              <p className="text-sm text-gray-400">1 Coin = ₹1</p>
            </div>
          </div>
          
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-300 mb-1">
                Enter coins to withdraw
              </label>
              <input
                id="withdrawAmount"
                type="text"
                value={withdrawAmount}
                onChange={handleInputChange}
                placeholder="Enter amount (min 100)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || isBalanceLoading}
              />
              {withdrawAmount && (
                <p className="text-sm text-gray-300 mt-1">You will receive: ₹{parseInt(withdrawAmount) || 0}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-300 mb-1">
                UPI ID
              </label>
              <input
                id="upiId"
                type="text"
                value={upiId}
                onChange={handleInputChange}
                placeholder="name@upi"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-300 mb-1">
                Account Holder Name
              </label>
              <input
                id="accountHolder"
                type="text"
                value={accountHolder}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || isBalanceLoading || !withdrawAmount || parseInt(withdrawAmount) < 100 || parseInt(withdrawAmount) > balance || !upiId || !accountHolder}
              className={`w-full py-3 px-4 rounded-md font-medium transition ${
                isLoading || isBalanceLoading || !withdrawAmount || parseInt(withdrawAmount) < 100 || parseInt(withdrawAmount) > balance || !upiId || !accountHolder
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Withdraw ${withdrawAmount || 0} Coins (₹${withdrawAmount || 0})`
              )}
            </button>
          </form>
          
          <div className="mt-6 text-sm text-gray-400">
            <p>• Minimum withdrawal: 100 coins (₹100)</p>
            <p>• No withdrawal fee</p>
            <p>• Processing time: 24 hours</p>
            <p>• Ensure your UPI ID is correct to avoid transfer issues</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;