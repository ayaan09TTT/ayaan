import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser } = useAuth();
  
  // Function to handle navigation item click on mobile
  const handleClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };
  
  return (
    <>
      {/* Overlay to close the sidebar on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 bg-indigo-600 text-white">
          <span className="text-xl font-bold">Menu</span>
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-md hover:bg-indigo-500 lg:hidden"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          <Link 
            to="/" 
            className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-md"
            onClick={handleClick}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </div>
          </Link>
          
          <Link 
            to="/trade-rooms" 
            className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-md"
            onClick={handleClick}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Browse Trade Rooms
            </div>
          </Link>
          
          {currentUser ? (
            <>
              <Link 
                to="/dashboard" 
                className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-md"
                onClick={handleClick}
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Dashboard
                </div>
              </Link>
              
              <Link 
                to="/create-trade-room" 
                className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-md"
                onClick={handleClick}
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Trade Room
                </div>
              </Link>
              
              <div className="pt-4 mt-4 border-t border-gray-200">
                <h5 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  My Account
                </h5>
                
                <Link 
                  to="/dashboard/profile" 
                  className="mt-1 block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-md"
                  onClick={handleClick}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </div>
                </Link>
                
                <Link 
                  to="/wallet" 
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-md"
                  onClick={handleClick}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Wallet
                  </div>
                </Link>
                
                <Link 
                  to="/dashboard/transactions" 
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-md"
                  onClick={handleClick}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Transactions
                  </div>
                </Link>
              </div>
            </>
          ) : (
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
              <Link 
                to="/login" 
                className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-md"
                onClick={handleClick}
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </div>
              </Link>
              
              <Link 
                to="/register" 
                className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-md"
                onClick={handleClick}
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </div>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;