import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
    case 'AUTH_CHECK_COMPLETE':
       return { ...state, loadingAuth: false };
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    loadingAuth: true,
  });

  // Set up axios interceptor
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token on app load
      verifyToken();
    } else {
    dispatch({ type: 'AUTH_CHECK_COMPLETE' }); // If no token, still mark as done
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      dispatch({ type: 'LOGOUT' });
    }finally {
    dispatch({ type: 'AUTH_CHECK_COMPLETE' });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      toast.success('Login successful!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      console.log('Registering with:', { name, email, password });
      console.log('API URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
      
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        name,
        email,
        password
      });

      console.log('Full response:', response);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      toast.success('Registration successful!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};