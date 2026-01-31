import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingSignup, setPendingSignup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Logging in with:', email); // Debug log
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status); // Debug log
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (!response.ok) {
        // Return error message from server or default
        return { 
          success: false, 
          error: data.message || `Login failed (${response.status})` 
        };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error); // Debug log
      return { 
        success: false, 
        error: error.message || 'Network error. Please check your connection.' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || `Signup failed (${response.status})` 
        };
      }

      // Store user data temporarily for OTP verification
      setPendingSignup(userData);

      return { 
        success: true, 
        email: userData.email,
        message: data.message 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Network error' 
      };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      // Check if we have pending signup data
      if (!pendingSignup || pendingSignup.email !== email) {
        return { 
          success: false, 
          error: 'Signup data not found. Please restart signup process.' 
        };
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          otp,
          name: pendingSignup.name,
          password: pendingSignup.password,
          contact: pendingSignup.contact
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || `OTP verification failed (${response.status})` 
        };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setPendingSignup(null); // Clear pending signup data
      
      return { 
        success: true,
        message: data.message 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Network error' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPendingSignup(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      verifyOtp, 
      logout, 
      loading,
      pendingSignup 
    }}>
      {children}
    </AuthContext.Provider>
  );
};