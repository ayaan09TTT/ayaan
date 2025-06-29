import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { DarkModeProvider } from './contexts/DarkModeContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/AuthPages/LoginPage';
import RegisterPage from './pages/AuthPages/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/Dashboard/ProfilePage';
import TradeRoomsListPage from './pages/TradeRooms/TradeRoomsListPage';
import TradeRoomDetailPage from './pages/TradeRooms/TradeRoomDetailPage';
import CreateTradeRoomPage from './pages/TradeRooms/CreateTradeRoomPage';

// Wallet Pages
import WalletPage from './pages/Wallet/WalletPage';
import DepositPage from './pages/Wallet/DepositPage';
import WithdrawPage from './pages/Wallet/WithdrawPage';

// Utils
import PrivateRoute from './utils/PrivateRoute';
import RazorpayScript from './utils/RazorpayScript';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load Razorpay script when the app starts
  useEffect(() => {
    RazorpayScript.load();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <SocketProvider>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
              <Header toggleSidebar={toggleSidebar} />
              <div className="flex flex-1">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } />
                  <Route path="/trade-rooms" element={<TradeRoomsListPage />} />
                  <Route path="/trade-rooms/:id" element={<TradeRoomDetailPage />} />
                  <Route path="/create-trade-room" element={
                    <PrivateRoute>
                      <CreateTradeRoomPage />
                    </PrivateRoute>
                  } />
                  
                  {/* Wallet Routes */}
                  <Route path="/wallet" element={
                    <PrivateRoute>
                      <WalletPage />
                    </PrivateRoute>
                  } />
                  <Route path="/wallet/deposit" element={
                    <PrivateRoute>
                      <DepositPage />
                    </PrivateRoute>
                  } />
                  <Route path="/wallet/withdraw" element={
                    <PrivateRoute>
                      <WithdrawPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </SocketProvider>
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;