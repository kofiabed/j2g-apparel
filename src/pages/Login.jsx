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
      } else {
        setErrorMessage(response.error || 'Login failed.');
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
      } else {
        setErrorMessage(response.error || 'Registration failed.');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-sans relative overflow-hidden bg-background transition-colors duration-500">
      
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-40 animate-slow-zoom" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/90 to-zinc-50/50 dark:from-zinc-950 dark:via-zinc-950/90 dark:to-zinc-950/50"></div>
      
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-wine/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 bg-card/70 backdrop-blur-2xl border border-border/40 p-8 md:p-10 rounded-sm shadow-2xl animate-fade-in-up">
        
        {/* Minimalist Tab Heading Toggles */}
        <div className="flex border-b border-zinc-200/50 dark:border-border/50 text-center text-[11px] tracking-[0.2em] font-black uppercase mb-8">
          <button 
            onClick={() => { setIsLoginMode(true); setErrorMessage(''); }}
            className={`w-1/2 pb-4 cursor-pointer border-b-2 transition-all duration-300 ${isLoginMode ? 'border-brand-wine text-brand-wine shadow-[0_1px_10px_rgba(122,21,39,0.2)]' : 'border-transparent text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setIsLoginMode(false); setErrorMessage(''); }}
            className={`w-1/2 pb-4 cursor-pointer border-b-2 transition-all duration-300 ${!isLoginMode ? 'border-brand-wine text-brand-wine shadow-[0_1px_10px_rgba(122,21,39,0.2)]' : 'border-transparent text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground'}`}
          >
            Create Account
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-light tracking-[0.3em] uppercase text-foreground">
            J2G <span className="font-black text-brand-wine drop-shadow-sm">{isLoginMode ? 'ACCESS' : 'REGISTER'}</span>
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">
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
                className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground"
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
              className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground"
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
              className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground"
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
                className="w-full border border-border p-4 text-xs rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine bg-input/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)] text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}

          <button type="submit" className="w-full bg-[#111] dark:bg-zinc-100 text-background text-[11px] font-black tracking-[0.2em] uppercase py-4 hover:bg-brand-wine dark:hover:bg-brand-wine dark:hover:text-white transition-all duration-300 rounded-sm shadow-xl hover:shadow-[0_0_20px_rgba(122,21,39,0.3)] cursor-pointer hover:-translate-y-1 mt-2">
            {isLoginMode ? 'Authorize Account Login' : 'Complete Account Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}