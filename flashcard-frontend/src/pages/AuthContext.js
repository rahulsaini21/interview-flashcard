// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (token) {
          const response = await axios.get('http://localhost:8080/api/verify-token', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    setLoading(false);

    // verifyToken();
  }, [token]);

  const login = async (username, password) => {
    try {
        const response = await axios.post('http://localhost:8080/generate-token', {
          username,
          password,
        });
        console.log('Login response:', response); // Debugging line to check login response
        console.log('Response headers:', response.data); // Debugging line to check headers
        const receivedToken = response.data["token"]; // Adjusted to match the response structure
        console.log('Received token:', receivedToken); // Debugging line to check received token
        setToken(receivedToken);
        localStorage.setItem('token', receivedToken);
        console.log('Token set in username:', username); // Debugging line to check token in localStorage
        setUser({ username });
        console.log("get token from localStorage", localStorage.getItem('token')); // Debugging line to check token in localStorage
    } catch (error) {
        console.error('Login error:', error); // Debugging line to check login error
        throw new Error('Login failed. Please check your credentials.');    
    }
  };

  const register = async (username, password) => {
    await axios.post('http://localhost:8080/api/user-register', {
      username,
      password,
    });
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
