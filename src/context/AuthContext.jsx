import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_URL = 'http://127.0.0.1:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read existing active sessions from storage on mount (since cookies are HTTP-only, we store minimal user info in localStorage for UI state, or we fetch /me)
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem('j2g_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Action: Sign Up Handler
  const signup = async (email, password, name) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  // Action: Login Handler
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('j2g_user', JSON.stringify(data.user));
      setUser(data.user);
      
      return { success: true, isAdmin: data.user.role === 'ADMIN' };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  // Action: Logout Handler
  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST' });
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('j2g_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);