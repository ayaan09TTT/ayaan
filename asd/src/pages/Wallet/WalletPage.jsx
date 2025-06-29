import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import walletService from '../../services/walletService';
import { AuthContext } from '../../contexts/AuthContext';
import TransactionHistory from '../../components/wallet/TransactionHistory';

const WalletPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        if (currentUser) {
          const userBalance = await walletService.getBalance(currentUser.id);
          const txHistory = await walletService.getTransactionHistory(currentUser.id);
          
          setBalance(userBalance);
          setTransactions(txHistory);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Wallet</h1>
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-14 bg-gray-700 rounded"></div>
            <div className="h-40 bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Wallet</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Your Balance</p>
              <p className="text-4xl font-bold text-yellow-400">{balance} Coins</p>
              <p className="text-sm text-gray-400 mt-1">1 Coin = ₹1</p>
            </div>
            <div className="space-y-3">
              <Link 
                to="/wallet/deposit" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium flex items-center justify-center transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Deposit Coins
              </Link>
              <Link 
                to="/wallet/withdraw" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center justify-center transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Withdraw Coins
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;