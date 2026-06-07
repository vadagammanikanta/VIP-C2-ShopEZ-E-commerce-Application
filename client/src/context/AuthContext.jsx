import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Create default axios config
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shopez_token') || '');
  const [loading, setLoading] = useState(true);

  // Apply Authorization Header to Axios
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Load User Profile on mount or token changes
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await axios.get('/users/profile');
          setUser(data);
        } catch (error) {
          console.error('Failed to load user profile, logging out', error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/users/login', { email, password });
      localStorage.setItem('shopez_token', data.token);
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Register handler
  const register = async (name, email, password, phone) => {
    try {
      const { data } = await axios.post('/users/register', { name, email, password, phone });
      localStorage.setItem('shopez_token', data.token);
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('shopez_token');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.put('/users/profile', profileData);
      if (data.token) {
        localStorage.setItem('shopez_token', data.token);
        setToken(data.token);
      }
      setUser(data);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
