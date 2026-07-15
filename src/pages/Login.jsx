import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoginMode) {
      const response = await login(formData.email, formData.password);
      if (response.success) {
        alert(`Welcome back!`);
        navigate(response.isAdmin ? '/admin' : '/');
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      const response = await signup(formData.email, formData.password, formData.name);
      if (response.success) {
        alert(`Account created successfully! Welcome to J2G Apparel.`);
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-sans relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-40 animate-slow-zoom" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/90 to-zinc-50/50 dark:from-zinc-950 dark:via-zinc-950/90 dark:to-zinc-950/50"></div>
      
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-wine/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/5 p-8 md:p-10 rounded-sm shadow-2xl animate-fade-in-up">
        
        {/* Minimalist Tab Heading Toggles */}
        <div className="flex border-b border-zinc-200/50 dark:border-zinc-800/50 text-center text-[11px] tracking-[0.2em] font-black uppercase mb-8">
          <button 
            onClick={() => { setIsLoginMode(true); setErrorMessage(''); }}
            className={`w-1/2 pb-4 cursor-pointer border-b-2 transition-all duration-300 ${isLoginMode ? 'border-brand-wine text-brand-wine shadow-[0_1px_10px_rgba(122,21,39,0.2)]' : 'border-transparent text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setIsLoginMode(false); setErrorMessage(''); }}
            className={`w-1/2 pb-4 cursor-pointer border-b-2 transition-all duration-300 ${!isLoginMode ? 'border-brand-wine text-brand-wine shadow-[0_1px_10px_rgba(122,21,39,0.2)]' : 'border-transparent text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
          >
            Create Account
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-light tracking-[0.3em] uppercase text-zinc-900 dark:text-white">
            J2G <span className="font-black text-brand-wine drop-shadow-sm">{isLoginMode ? 'ACCESS' : 'REGISTER'}</span>
          </h2>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-2">
            {isLoginMode ? 'Enter credentials for premium access' : 'Join the elite fashion ecosystem hub'}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-brand-wine/10 border border-brand-wine/20 text-brand-wine text-xs p-3.5 text-center rounded-sm font-bold tracking-wider uppercase mb-6 animate-pulse">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Form Inputs Module */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {!isLoginMode && (
            <div>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="w-full border border-zinc-200 dark:border-zinc-800 p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>
          )}

          <div>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleInputChange} 
              className="w-full border border-zinc-200 dark:border-zinc-800 p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>

          <div>
            <input 
              type="password" 
              name="password" 
              required 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleInputChange} 
              className="w-full border border-zinc-200 dark:border-zinc-800 p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>

          {!isLoginMode && (
            <div>
              <input 
                type="password" 
                name="confirmPassword" 
                required 
                placeholder="Confirm Password" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                className="w-full border border-zinc-200 dark:border-zinc-800 p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>
          )}

          <button type="submit" className="w-full bg-[#111] dark:bg-zinc-100 text-white dark:text-[#111] text-[11px] font-black tracking-[0.2em] uppercase py-4 hover:bg-brand-wine dark:hover:bg-brand-wine dark:hover:text-white transition-all duration-300 rounded-sm shadow-xl hover:shadow-[0_0_20px_rgba(122,21,39,0.3)] cursor-pointer hover:-translate-y-1 mt-2">
            {isLoginMode ? 'Authorize Account Login' : 'Complete Account Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}