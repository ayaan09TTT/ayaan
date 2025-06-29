import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import walletService from '../../services/walletService';
import { AuthContext } from '../../contexts/AuthContext';
import RazorpayScript from '../../utils/RazorpayScript';

const DepositPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [coinAmount, setCoinAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update total amount and platform fee when coin amount changes
  useEffect(() => {
    const amount = parseInt(coinAmount) || 0;
    const fee = amount > 0 ? Math.ceil(amount * 0.02) : 0;
    setPlatformFee(fee);
    setTotalAmount(amount + fee);
  }, [coinAmount]);

  // Load Razorpay script when component mounts
  useEffect(() => {
    const loadRazorpayScript = async () => {
      try {
        await RazorpayScript.load();
      } catch (error) {
        console.error('Failed to load Razorpay script:', error);
      }
    };
    
    loadRazorpayScript();
    
    // Cleanup when component unmounts
    return () => {
      // No need to unload the script as it might be used in other parts of the application
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setCoinAmount(value);
    }
  };

  const handleDeposit = async () => {
    setError('');
    setSuccess('');

    // Validate input
    const amount = parseInt(coinAmount);
    if (!amount) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (amount < 10) {
      setError('Minimum deposit is 10 coins');
      return;
    }
    
    if (amount > 5000) {
      setError('Maximum deposit is 5000 coins');
      return;
    }

    try {
      setIsLoading(true);

      // First create an order through your backend
      const orderData = await walletService.createOrder(amount);
      
      if (!orderData || !orderData.id) {
        throw new Error('Failed to create order');
      }

      // Load Razorpay SDK
      await RazorpayScript.load();
      
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please try again later.');
      }

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_111222333444', // Your Razorpay Key ID
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Trade Forge',
        description: `Purchase ${coinAmount} coins`,
        order_id: orderData.id,
        handler: async function(response) {
          try {
            // Verify the payment on your server
            const result = await walletService.verifyPayment({
              orderId: orderData.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: coinAmount
            });
            
            if (result && result.success) {
              setSuccess(`Successfully added ${coinAmount} coins to your wallet!`);
              setTimeout(() => {
                navigate('/wallet');
              }, 2000);
            } else {
              setError('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          contact: currentUser?.phone || '',
        },
        theme: {
          color: '#0F172A',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Deposit error:', error);
      setError(error.message || 'Failed to process deposit. Please try again.');
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
          <h1 className="text-2xl font-bold mb-6">Deposit Coins</h1>
          
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
          
          <div className="space-y-6">
            <div>
              <label htmlFor="coinAmount" className="block text-sm font-medium text-gray-300 mb-1">
                Enter coins to buy
              </label>
              <input
                id="coinAmount"
                type="text"
                value={coinAmount}
                onChange={handleInputChange}
                placeholder="Enter amount (min 10, max 5000)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-400 mt-1">1 Coin = ₹1</p>
            </div>
            
            {coinAmount && parseInt(coinAmount) >= 10 && (
              <div className="p-4 bg-gray-700 rounded-md">
                <div className="flex justify-between pb-3 border-b border-gray-600">
                  <span>Coins amount:</span>
                  <span>₹{parseInt(coinAmount) || 0}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-600">
                  <span>Platform fee (2%):</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between pt-3 font-bold">
                  <span>Total Payment:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={handleDeposit}
              disabled={isLoading || !coinAmount || parseInt(coinAmount) < 10}
              className={`w-full py-3 px-4 rounded-md font-medium transition ${
                isLoading || !coinAmount || parseInt(coinAmount) < 10
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
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
                `Pay ₹${totalAmount} to buy ${coinAmount || 0} coins`
              )}
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-400">
            <p>• Minimum purchase: 10 coins (₹10)</p>
            <p>• Maximum purchase: 5,000 coins (₹5,000)</p>
            <p>• 2% platform fee will be added to your purchase</p>
            <p>• Payments are secured by Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;