import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    let socketInstance = null;

    const connectSocket = () => {
      // Connect to the socket server only if user is authenticated
      if (currentUser && !socketInstance) {
        const token = localStorage.getItem('token');

        // Check if we're in development mode and conditionally connect to socket
        const apiUrl = import.meta.env.VITE_API_URL;
        
        // Only connect if we have an explicit API URL
        if (apiUrl) {
          socketInstance = io(apiUrl, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
          });
        } else {
          console.log('No API URL provided, socket connection disabled');
          // Set connected to true to avoid breaking application functionality
          setConnected(true);
          return; // Exit early to prevent socket event listeners
        }

        socketInstance.on('connect', () => {
          console.log('Socket connected');
          setConnected(true);
          setError(null);
        });

        socketInstance.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setConnected(false);
        });

        socketInstance.on('error', (err) => {
          console.error('Socket error:', err);
          setError(err);
          setConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          setError(err.message);
          setConnected(false);
        });

        setSocket(socketInstance);
      }
    };

    connectSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setSocket(null);
        setConnected(false);
      }
    };
  }, [currentUser]);

  const joinRoom = (roomId) => {
    if (socket && connected) {
      socket.emit('joinRoom', { roomId });
    }
  };

  const leaveRoom = (roomId) => {
    if (socket && connected) {
      socket.emit('leaveRoom', { roomId });
    }
  };

  const sendMessage = (roomId, message) => {
    if (socket && connected) {
      return new Promise((resolve, reject) => {
        socket.emit('sendMessage', { roomId, message }, (response) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response);
          }
        });
      });
    }
    return Promise.reject(new Error('Socket not connected'));
  };

  const value = {
    socket,
    connected,
    error,
    joinRoom,
    leaveRoom,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};