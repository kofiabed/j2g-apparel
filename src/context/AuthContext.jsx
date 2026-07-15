import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read existing active sessions from storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('j2g_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Action: Sign Up Handler
  const signup = async (email, password, name) => {
    // MVP local simulation (hooks directly to MongoDB auth routes later)
    const mockUser = { name, email, role: 'customer', token: 'mock-jwt-token-xyz' };
    localStorage.setItem('j2g_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return { success: true };
  };

  // Action: Login Handler
  const login = async (email, password) => {
    // Check if accessing admin privileges for dashboard access later
    const isSecretAdmin = email === "admin@j2g.com" && password === "admin123";
    
    const loggedUser = {
      name: isSecretAdmin ? "Store Manager" : "Valued Client",
      email: email,
      role: isSecretAdmin ? 'admin' : 'customer',
      token: 'mock-jwt-token-abc'
    };

    localStorage.setItem('j2g_user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    return { success: true, isAdmin: isSecretAdmin };
  };

  // Action: Logout Handler
  const logout = () => {
    localStorage.removeItem('j2g_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);