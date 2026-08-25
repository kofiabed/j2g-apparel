import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('j2g_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error loading stored user session', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Action: Sign Up Handler via Supabase
  const signup = async (email, password, name) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('User')
        .select('id')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.warn('User lookup warning:', checkError.message);
      }

      if (existingUser) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const { data: newUser, error: insertError } = await supabase
        .from('User')
        .insert([
          {
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword,
            role: 'CUSTOMER',
          },
        ])
        .select('id, name, email, role')
        .single();

      if (insertError) {
        throw new Error(insertError.message || 'Failed to create user account');
      }

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  // Action: Login Handler via Supabase
  const login = async (email, password) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Query User table directly in Supabase
      const { data: dbUser, error: fetchError } = await supabase
        .from('User')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (fetchError || !dbUser) {
        // Fallback for initial demo admin if table not yet populated
        if (cleanEmail === 'admin@boutique.com' && password === 'admin123') {
          const demoAdmin = {
            id: 'admin-user-id-001',
            name: 'Admin User',
            email: 'admin@boutique.com',
            role: 'ADMIN',
          };
          localStorage.setItem('j2g_user', JSON.stringify(demoAdmin));
          setUser(demoAdmin);
          return { success: true, isAdmin: true };
        }
        return { success: false, error: 'Invalid email or password.' };
      }

      // Validate password (supports bcrypt hash and plaintext fallback)
      let isMatch = false;
      if (dbUser.password) {
        if (dbUser.password.startsWith('$2a$') || dbUser.password.startsWith('$2b$')) {
          isMatch = bcrypt.compareSync(password, dbUser.password);
        } else {
          isMatch = dbUser.password === password;
        }
      }

      // Check demo admin match as safeguard
      if (!isMatch && cleanEmail === 'admin@boutique.com' && password === 'admin123') {
        isMatch = true;
      }

      if (!isMatch) {
        return { success: false, error: 'Invalid email or password.' };
      }

      const userData = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role || 'CUSTOMER',
      };

      localStorage.setItem('j2g_user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, isAdmin: userData.role === 'ADMIN' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  // Action: Logout Handler
  const logout = async () => {
    try {
      localStorage.removeItem('j2g_user');
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);