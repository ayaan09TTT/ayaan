import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Buy & Sell Digital Items with Complete Security
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Trade gaming accounts, digital files, and virtual assets with confidence using RealTrade's secure escrow system.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/register" 
                  className="bg-white text-indigo-700 font-medium px-5 py-3 rounded-lg hover:bg-indigo-50 transition-colors inline-block text-center"
                >
                  Get Started
                </Link>
                <Link 
                  to="/trade-rooms" 
                  className="bg-indigo-600 text-white font-medium px-5 py-3 rounded-lg hover:bg-indigo-500 transition-colors inline-block text-center"
                >
                  Browse Trade Rooms
                </Link>
              </div>
            </div>
            <div className="hidden lg:block lg:relative">
              <div className="bg-indigo-800 rounded-xl overflow-hidden p-2">
                <div className="bg-indigo-900 rounded-lg p-8 relative">
                  <div className="absolute top-4 left-4 right-4 h-2 bg-indigo-800 rounded-full"></div>
                  <div className="mt-6 bg-indigo-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-lg font-semibold">Premium Gaming Account</div>
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">Available</div>
                    </div>
                    <div className="text-sm opacity-75 mb-4">Level 100 character with rare items and skins</div>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-xl">8,500 coins</div>
                      <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100">
                        Buy Now
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-indigo-800 rounded-lg p-4">
                    <div className="flex space-x-3 items-start mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">S</div>
                      <div className="text-sm bg-indigo-700 p-3 rounded-lg">
                        Item is available. I can provide screenshots of game inventory.
                      </div>
                    </div>
                    <div className="flex space-x-3 items-start ml-12">
                      <div className="text-sm bg-indigo-600 p-3 rounded-lg">
                        Great, I'm interested. How long have you had this account?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How RealTrade Works</h2>
            <p className="mt-4 text-xl text-gray-600">Safe trading in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Find & Negotiate</h3>
              <p className="text-gray-600">Browse trade rooms to find the digital item you want, then chat with the seller to negotiate details.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Secure Escrow</h3>
              <p className="text-gray-600">Your payment is held securely in escrow while the seller transfers the digital item to you.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Complete Trade</h3>
              <p className="text-gray-600">After receiving your item, confirm the transaction and the seller receives payment automatically.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Trade Rooms */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Trade Rooms</h2>
            <Link 
              to="/trade-rooms"
              className="inline-flex items-center mt-4 sm:mt-0 text-indigo-600 hover:text-indigo-800"
            >
              View all trade rooms
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mock Trade Room Cards */}
            {[
              { 
                title: "Premium Fortnite Account", 
                price: 5000,
                category: "Gaming Accounts",
                image: "default-game.jpg"
              },
              { 
                title: "Photoshop Templates Bundle", 
                price: 1200,
                category: "Digital Assets",
                image: "default-design.jpg"
              },
              { 
                title: "Rare CSGO Knife Skin", 
                price: 8000,
                category: "Game Items",
                image: "default-item.jpg"
              }
            ].map((room, index) => (
              <Link to={`/trade-rooms/${index+1}`} key={index} className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 h-40 flex items-center justify-center">
                  <div className="text-gray-400">[Item Preview]</div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-indigo-600 font-semibold mb-1">{room.category}</div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{room.title}</h3>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-xl">{room.price.toLocaleString()} coins</div>
                    <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Trust & Safety Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose RealTrade?</h2>
            <p className="mt-4 text-xl text-gray-600">We prioritize your safety and security in every transaction</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Secure Escrow",
                description: "Your payment is protected until you receive your item"
              },
              {
                icon: (
                  <svg className="h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                ),
                title: "Real-time Chat",
                description: "Communicate directly with buyers and sellers"
              },
              {
                icon: (
                  <svg className="h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Dispute Resolution",
                description: "Fair and transparent mediation for any issues"
              },
              {
                icon: (
                  <svg className="h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Lower Fees",
                description: "Only 4-5% transaction fee, lower than competitors"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-16">
            <Link 
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
            >
              Join RealTrade Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;