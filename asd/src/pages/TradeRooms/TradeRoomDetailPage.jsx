import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import tradeRoomService from '../../services/tradeRoomService';
import transactionService from '../../services/transactionService';
import walletService from '../../services/walletService';

const TradeRoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { socket, connected, joinRoom, leaveRoom, sendMessage } = useSocket();
  const [tradeRoom, setTradeRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const messagesEndRef = useRef(null);

  // Mock transaction status options: null, 'in_escrow', 'awaiting_delivery', 'completed', 'disputed'

  // Fetch trade room details and wallet balance
  useEffect(() => {
    const fetchTradeRoomDetails = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch the actual trade room by ID
        const roomData = await tradeRoomService.getRoomById(id);
        setTradeRoom(roomData);

        // If user is logged in, fetch their wallet balance
        if (currentUser) {
          const balance = await walletService.getBalance(currentUser._id);
          setWalletBalance(balance);
        }
      } catch (error) {
        console.error('Error fetching trade room details:', error);
        setError('Failed to load trade room details. Please try again later.');
        // Mock data for demonstration
        setTradeRoom({
          _id: id,
          title: 'Premium Gaming Account with Rare Items',
          description: 'Level 100 account with exclusive skins, weapons, and in-game currency. Perfect for serious gamers looking to skip the grind. All achievements unlocked and special event items included.',
          price: 6500,
          category: 'Gaming Accounts',
          seller: {
            _id: 'seller-123',
            fullName: 'Pro Seller',
            rating: 4.9
          },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'open',
          images: [],
          filePreviewUrl: null
        });

        if (currentUser) {
          setWalletBalance(10000); // Mock balance
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTradeRoomDetails();
  }, [id, currentUser]);

  // Handle socket connections for chat
  useEffect(() => {
    if (connected && tradeRoom && currentUser && socket) {
      // Join the chat room
      joinRoom(id);

      // Listen for incoming messages
      socket?.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Fetch previous messages
      socket?.emit('getRoomMessages', { roomId: id }, (response) => {
        if (response.messages) {
          setMessages(response.messages);
        }
      });

      // Mock chat messages for demonstration
      const mockMessages = [
        {
          _id: 'm1',
          sender: {
            _id: 'seller-123',
            fullName: 'Pro Seller'
          },
          content: 'Hello! Welcome to my trade room. Feel free to ask any questions about the item.',
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        },
        {
          _id: 'm2',
          sender: {
            _id: currentUser?._id || 'buyer-123',
            fullName: currentUser?.fullName || 'You'
          },
          content: 'Hi there! Is this account still available?',
          createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString()
        },
        {
          _id: 'm3',
          sender: {
            _id: 'seller-123',
            fullName: 'Pro Seller'
          },
          content: 'Yes, it\'s available! It has several rare items and a lot of in-game currency.',
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        }
      ];
      
      setMessages(mockMessages);

      // Clean up
      return () => {
        leaveRoom(id);
        socket?.off('message');
      };
    }
  }, [connected, id, tradeRoom, currentUser, socket, joinRoom, leaveRoom]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      // In a real app, this would use the socket to send a message
      if (connected) {
        await sendMessage(id, newMessage.trim());
      }

      // Mock sending a message
      const mockMessage = {
        _id: `m${Date.now()}`,
        sender: {
          _id: currentUser._id || 'user-123',
          fullName: currentUser.fullName || 'You'
        },
        content: newMessage.trim(),
        createdAt: new Date().toISOString()
      };

      setMessages((prevMessages) => [...prevMessages, mockMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handlePurchase = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/trade-rooms/${id}` } });
      return;
    }

    if (walletBalance < tradeRoom.price) {
      alert('Insufficient funds. Please add coins to your wallet.');
      return;
    }

    try {
      setPurchaseInProgress(true);
      
      // In a real app, this would call the transaction service
      const transaction = await transactionService.initiateTransaction({
        tradeRoomId: id,
        sellerId: tradeRoom.seller._id,
        amount: tradeRoom.price
      });

      // Mock transaction initiation
      setTimeout(() => {
        setTransactionStatus('in_escrow');
        setPurchaseInProgress(false);
      }, 1500);
    } catch (error) {
      console.error('Error initiating purchase:', error);
      setPurchaseInProgress(false);
      alert('Failed to initiate purchase. Please try again.');
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      setTransactionStatus('awaiting_delivery');
      // In a real app, this would confirm the transaction
      setTimeout(() => {
        setTransactionStatus('completed');
      }, 2000);
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alert('Failed to confirm delivery. Please try again.');
    }
  };

  const handleDisputeTransaction = async () => {
    try {
      setTransactionStatus('disputed');
      alert('Your dispute has been filed. An admin will review your case shortly.');
    } catch (error) {
      console.error('Error filing dispute:', error);
      alert('Failed to file dispute. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error && !tradeRoom) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <svg className="h-16 w-16 text-red-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trade Room Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/trade-rooms" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
          Browse Other Trade Rooms
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && currentUser._id === tradeRoom?.seller?._id;
  const isTransactionActive = transactionStatus !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/trade-rooms" className="text-indigo-600 hover:text-indigo-700 flex items-center">
          <svg className="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Trade Rooms
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Item Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <div className="text-gray-400">[Item Preview]</div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <span className="text-xs text-indigo-600 font-semibold">{tradeRoom.category}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  tradeRoom.status === 'sold' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                }`}>
                  {tradeRoom.status === 'sold' ? 'Sold' : 'Available'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-4">{tradeRoom.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                    {tradeRoom.seller.fullName.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Listed by {tradeRoom.seller.fullName}</p>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-gray-600 ml-1">{tradeRoom.seller.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  Listed {new Date(tradeRoom.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{tradeRoom.description}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-3xl font-bold text-gray-900">{tradeRoom.price.toLocaleString()} coins</p>
                </div>
                
                {!isOwner && !isTransactionActive && (
                  <button
                    onClick={handlePurchase}
                    disabled={purchaseInProgress}
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md ${
                      purchaseInProgress ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {purchaseInProgress ? (
                      <div className="flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing
                      </div>
                    ) : (
                      'Buy Now'
                    )}
                  </button>
                )}

                {isOwner && (
                  <div className="space-x-3">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                      Edit
                    </button>
                    <button className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md">
                      Delete
                    </button>
                  </div>
                )}
              </div>
              
              {transactionStatus && (
                <div className="mt-6">
                  <div className="p-4 rounded-lg border border-indigo-200 bg-indigo-50">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-2">Transaction Status</h3>
                    
                    {transactionStatus === 'in_escrow' && (
                      <>
                        <p className="text-indigo-700 mb-3">
                          <span className="font-medium">Your payment is in escrow.</span> Wait for the seller to deliver the item.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="w-2/3 bg-indigo-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '33%' }}></div>
                          </div>
                          <span className="text-sm text-indigo-600 ml-2">Waiting for delivery</span>
                        </div>
                      </>
                    )}

                    {transactionStatus === 'awaiting_delivery' && (
                      <>
                        <p className="text-indigo-700 mb-3">
                          <span className="font-medium">The seller has delivered the item.</span> Please review and confirm receipt.
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-2/3 bg-indigo-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '66%' }}></div>
                          </div>
                          <span className="text-sm text-indigo-600 ml-2">Delivery confirmation</span>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={handleConfirmDelivery}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex-1"
                          >
                            Confirm Receipt
                          </button>
                          <button
                            onClick={handleDisputeTransaction}
                            className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md flex-1"
                          >
                            File Dispute
                          </button>
                        </div>
                      </>
                    )}

                    {transactionStatus === 'completed' && (
                      <>
                        <p className="text-green-700 mb-3">
                          <span className="font-medium">Transaction completed successfully!</span> The payment has been released to the seller.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="w-2/3 bg-indigo-200 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                          <span className="text-sm text-green-600 ml-2">Completed</span>
                        </div>
                      </>
                    )}

                    {transactionStatus === 'disputed' && (
                      <>
                        <p className="text-yellow-700 mb-3">
                          <span className="font-medium">This transaction is under dispute.</span> An admin will review and resolve the issue.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="w-2/3 bg-indigo-200 rounded-full h-2.5">
                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <span className="text-sm text-yellow-600 ml-2">Under review</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Chat */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg overflow-hidden h-[600px] flex flex-col">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-gray-900">Chat with {isOwner ? 'Buyer' : tradeRoom.seller.fullName}</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => {
                  const isCurrentUser = currentUser && message.sender._id === currentUser._id;
                  return (
                    <div 
                      key={message._id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isCurrentUser 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {!isCurrentUser && (
                          <p className="text-xs font-medium mb-1">
                            {message.sender.fullName}
                          </p>
                        )}
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <svg className="h-12 w-12 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              {currentUser ? (
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 p-3 text-center rounded-md">
                  <p className="text-gray-600 mb-2">You need to be logged in to chat</p>
                  <Link 
                    to="/login" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md inline-block"
                  >
                    Login to Chat
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Wallet Info (for buyers) */}
          {!isOwner && (
            <div className="mt-6 bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Your Wallet</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-xl font-bold text-gray-900">
                    {walletBalance.toLocaleString()} coins
                  </p>
                </div>
                <Link 
                  to="/dashboard/wallet" 
                  className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-md text-sm"
                >
                  Add Coins
                </Link>
              </div>
              
              {walletBalance < tradeRoom.price && (
                <div className="mt-3 p-2 bg-yellow-50 text-yellow-700 text-sm rounded-md">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p>
                      Insufficient balance to purchase this item. You need {(tradeRoom.price - walletBalance).toLocaleString()} more coins.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Tips */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-md font-semibold text-blue-800 mb-2">Safety Tips</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-1.5 mt-0.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Always use the platform's escrow system for payments.
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-1.5 mt-0.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Keep all communication within the platform.
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-1.5 mt-0.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Report suspicious behavior immediately.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeRoomDetailPage;