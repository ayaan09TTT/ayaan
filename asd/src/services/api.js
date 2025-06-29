import axios from 'axios';

// Default API configuration
const api = axios.create({
  // In a production environment, this should point to your backend API
  // For development, we'll use a mock URL
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.tradeforge.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // For successful responses, just return the data portion
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized responses - token expired
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { refreshToken }
        );

        if (response.data.token) {
          // Save the new token
          localStorage.setItem('token', response.data.token);
          
          // Update the original request authorization header
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          
          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login page
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // If using react-router, you can use history to push to login page
        // history.push('/login');
        
        // For now, we'll just alert and redirect
        alert('Your session has expired. Please login again.');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      // Use a mock response for demo if needed
      if (error.config.url.includes('/wallet')) {
        console.log('Using mock response for wallet API');
        
        // If this is a wallet API call, return mock data
        if (error.config.url.includes('/balance')) {
          return Promise.resolve({ balance: Math.floor(Math.random() * 10000) + 5000 });
        }
        
        if (error.config.url.includes('/create-order')) {
          return Promise.resolve({ 
            id: 'order_' + Math.random().toString(36).substring(2, 15),
            amount: JSON.parse(error.config.data).amount * 100,
            currency: 'INR',
            receipt: 'rcpt_' + Math.random().toString(36).substring(2, 15),
          });
        }
        
        if (error.config.url.includes('/verify-payment')) {
          return Promise.resolve({ 
            success: true,
            message: 'Payment verified successfully',
            transaction: {
              id: 'txn_' + Math.random().toString(36).substring(2, 15),
              amount: JSON.parse(error.config.data).amount,
              status: 'completed',
              createdAt: new Date().toISOString()
            }
          });
        }
        
        if (error.config.url.includes('/withdraw')) {
          return Promise.resolve({ 
            success: true,
            message: 'Withdrawal request submitted successfully',
            transaction: {
              id: 'txn_' + Math.random().toString(36).substring(2, 15),
              amount: JSON.parse(error.config.data).amount,
              status: 'pending',
              createdAt: new Date().toISOString()
            }
          });
        }
      }
    }

    // Handle specific error status codes
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error('Bad Request:', error.response.data);
          break;
        case 403:
          console.error('Forbidden:', error.response.data);
          break;
        case 404:
          console.error('Not Found:', error.response.data);
          break;
        case 500:
          console.error('Server Error:', error.response.data);
          break;
        default:
          console.error(`Error ${error.response.status}:`, error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default api;