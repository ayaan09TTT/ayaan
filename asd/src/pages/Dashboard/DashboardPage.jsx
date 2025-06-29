import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import walletService from '../../services/walletService';
import userService from '../../services/userService';
import transactionService from '../../services/transactionService';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [activeTrades, setActiveTrades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch wallet balance
        if (currentUser) {
          const balance = await walletService.getBalance(currentUser._id);
          setWalletBalance(balance);
          
          // Fetch recent transactions
          const transactions = await transactionService.getUserTransactions(currentUser._id, { limit: 5 });
          setRecentTransactions(transactions);
          
          // Fetch active trades
          const trades = await userService.getActiveTrades(currentUser._id);
          setActiveTrades(trades);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-xl text-gray-600 mb-4">Please log in to view your dashboard</p>
        <Link 
          to="/login" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser.fullName}</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center">
            <div className="bg-indigo-50 rounded-lg p-4 mb-4 md:mb-0 md:mr-4">
              <p className="text-sm text-indigo-700 font-medium">Wallet Balance</p>
              <p className="text-2xl font-bold text-indigo-900">{walletBalance.toLocaleString()} coins</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/wallet')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Manage Wallet
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => handleTabChange('overview')}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange('activity')}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === 'activity'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => handleTabChange('trades')}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === 'trades'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Trades
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Profile</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">{currentUser.fullName}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-sm font-medium text-gray-900">{currentUser.email}</p>
                      </div>
                      {currentUser.phone && (
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-sm font-medium text-gray-900">{currentUser.phone}</p>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-600">Rating</p>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-1">
                            {currentUser.rating || '5.0'}
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.floor(currentUser.rating || 5)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Link 
                        to="/dashboard/profile" 
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                      >
                        Edit Profile
                        <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">Total Trades</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {recentTransactions.length || 0}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">Active Trades</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {activeTrades.length || 0}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">Trade Rooms</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.floor(Math.random() * 10)}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">Member Since</p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <Link 
                        to="/create-trade-room" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Create Trade Room
                      </Link>
                      <Link 
                        to="/dashboard/transactions" 
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                      >
                        View All Transactions
                        <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity Tab */}
              {activeTab === 'activity' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                  {recentTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentTransactions.length ? (
                            recentTransactions.map((transaction, index) => (
                              <tr key={transaction._id || index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  #{transaction._id?.substring(0, 8) || `TRANS${index}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {transaction.type || 'Trade'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                  {transaction.amount?.toLocaleString() || (1000 + index * 100)} coins
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    transaction.status === 'disputed' ? 'bg-red-100 text-red-800' : 
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {transaction.status || 'Completed'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(transaction.createdAt || new Date().setDate(new Date().getDate() - index)).toLocaleString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                No recent transactions found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-gray-600">No recent transactions found.</p>
                      <p className="mt-2">
                        <Link to="/trade-rooms" className="text-indigo-600 hover:text-indigo-700">
                          Browse trade rooms
                        </Link>
                        {" "}to start trading or{" "}
                        <Link to="/dashboard/wallet" className="text-indigo-600 hover:text-indigo-700">
                          add coins to your wallet
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* My Trades Tab */}
              {activeTab === 'trades' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">My Active Trades</h3>
                  
                  {activeTrades.length > 0 ? (
                    <div className="grid gap-4">
                      {activeTrades.map((trade, index) => (
                        <div key={trade._id || index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">{trade.title || `Trade #${index + 1}`}</h4>
                              <p className="text-sm text-gray-600">
                                with {trade.otherParty || `User${Math.floor(Math.random() * 1000)}`}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center">
                              <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                                trade.status === 'in_escrow' ? 'bg-blue-100 text-blue-800' : 
                                trade.status === 'awaiting_delivery' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {trade.status || 'In Progress'}
                              </span>
                              <Link 
                                to={`/trade-rooms/${trade._id}`} 
                                className="ml-4 text-indigo-600 hover:text-indigo-700 text-sm"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <div className="text-sm">
                              <span className="text-gray-600">Amount:</span>
                              <span className="ml-1 font-medium">{trade.amount || 1000 + index * 500} coins</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(trade.updatedAt || new Date().setDate(new Date().getDate() - index)).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-gray-600">You don't have any active trades at the moment.</p>
                      <Link 
                        to="/trade-rooms" 
                        className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                      >
                        Browse Trade Rooms
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/create-trade-room"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Trade Room</p>
                <p className="text-sm text-gray-600">List a digital item for sale</p>
              </div>
            </Link>
            
            <Link
              to="/dashboard/wallet"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Coins</p>
                <p className="text-sm text-gray-600">Add or withdraw coins</p>
              </div>
            </Link>
            
            <Link
              to="/dashboard/profile"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-600">Update your personal details</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Trade Rooms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { 
                title: "Premium Gaming Account", 
                price: 5000,
                category: "Gaming Accounts"
              },
              { 
                title: "Photoshop Templates Bundle", 
                price: 1200,
                category: "Digital Assets"
              }
            ].map((room, index) => (
              <Link to={`/trade-rooms/${index+1}`} key={index} className="block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="text-xs text-indigo-600 font-semibold mb-1">{room.category}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{room.title}</h3>
                  <div className="flex justify-between items-center">
                    <div className="font-bold">{room.price.toLocaleString()} coins</div>
                    <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link 
              to="/trade-rooms" 
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium inline-flex items-center"
            >
              View all trade rooms
              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;