import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { useApp } from './context/AppContext'; // 1. Subscribed safely to Global Settings Context
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';

function Navbar() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user, logout } = useAuth(); 
  const { darkMode, toggleDarkMode } = useApp(); // 2. Hooked up dark mode dynamic controls
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calculate shopping statistics on the fly
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => {
    const activePrice = item.discountPrice || item.price;
    return acc + (activePrice * item.quantity);
  }, 0);

  return (
    <>
      {/* NAVIGATION BAR */}
      <nav className="bg-brand-black/75 backdrop-blur-lg text-white sticky top-0 z-40 px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 tracking-widest border-b border-white/10 font-sans shadow-lg shadow-black/20 transition-all duration-500">
        <Link to="/" className="text-xl font-bold tracking-widest hover:text-brand-wine transition group">
          J2G <span className="text-brand-wine group-hover:text-brand-gold transition-colors duration-300">APPAREL</span>
        </Link>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[10px] md:text-[11px] uppercase font-bold items-center tracking-[0.1em] md:tracking-[0.15em]">
          <Link to="/" className="relative group hover:text-white text-zinc-300 transition-colors duration-300 hidden sm:block">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/catalog" className="relative group hover:text-white text-zinc-300 transition-colors duration-300">
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
          </Link> 
          <Link to="/contact" className="relative group hover:text-white text-zinc-300 transition-colors duration-300 hidden sm:block">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          {/* 3. INTEGRATED MANUALLY TRIGGERED THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleDarkMode}
            className="p-1.5 rounded-full border border-zinc-800 hover:border-zinc-600 transition cursor-pointer text-sm bg-zinc-950/40 flex items-center justify-center w-8 h-8 select-none"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {/* USER SESSIONS CONTEXT INTERFACE */}
          {user ? (
            <div className="flex items-center gap-3 md:gap-4">
              {/* If user is admin, make their badge a clickable shortcut link to HQ panel */}
              {user.role === 'admin' ? (
                <Link 
                  to="/admin" 
                  className="text-[9px] md:text-[10px] font-bold text-brand-gold bg-brand-wine/20 border border-brand-wine/30 px-2.5 py-1 rounded-sm hover:bg-brand-wine/40 transition"
                  title="Go to Admin Panel"
                >
                  👤 <span className="hidden sm:inline">{user.name}</span><span className="inline sm:hidden">HQ</span>
                </Link>
              ) : (
                <span className="text-[9px] md:text-[10px] font-bold text-brand-gold bg-brand-wine/20 border border-brand-wine/30 px-2.5 py-1 rounded-sm">
                  👤 <span className="hidden sm:inline">{user.name}</span><span className="inline sm:hidden">Me</span>
                </span>
              )}
              <button onClick={logout} className="text-zinc-400 hover:text-brand-wine transition cursor-pointer text-xs">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-brand-wine transition text-zinc-300">Login</Link>
          )}

          {/* Interactive Toggle Button for Basket */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center bg-brand-wine/20 px-3 md:px-4 py-2 rounded-full border border-brand-wine/40 cursor-pointer hover:bg-brand-wine/40 hover:border-brand-gold/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300 group"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">🛒</span>
            <span className="font-bold text-brand-gold ml-2.5 text-xs">{totalItems}</span>
          </button>
        </div>
      </nav>

      {/* SLIDE-OUT CART DRAWER SLIDE SYSTEM */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Dark Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 animate-[slide-in-right_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="w-screen max-w-md bg-white dark:bg-zinc-950 text-brand-black dark:text-white flex flex-col shadow-2xl border-l border-zinc-100 dark:border-zinc-800">
              
              {/* Drawer Title Header */}
              <div className="px-6 py-6 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-sm font-black tracking-[0.2em] uppercase text-zinc-900 dark:text-zinc-100">Your Basket <span className="text-brand-wine">({totalItems})</span></h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-zinc-400 hover:text-brand-wine text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Dynamic Items Iteration Listing */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 space-y-3">
                    <span className="text-4xl">🛍️</span>
                    <p className="text-sm tracking-wide">Your shopping basket is completely empty.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-brand-black text-white text-xs tracking-widest uppercase font-bold px-4 py-2 hover:bg-brand-wine transition"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => {
                    const pricePerUnit = item.discountPrice || item.price;
                    return (
                      <div key={item._id} className="flex items-center gap-4 border-b border-zinc-100 pb-4">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-16 h-20 object-cover bg-zinc-100 rounded-sm"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium tracking-wide text-zinc-800 line-clamp-1">{item.name}</h4>
                          <span className="text-[11px] uppercase text-brand-wine font-bold block mb-1">{item.category}</span>
                          <p className="text-sm font-bold text-zinc-900">GHS {pricePerUnit * item.quantity}</p>
                          
                          {/* Counter Control Modifiers */}
                          <div className="flex items-center gap-2 mt-2">
                            <button 
                              onClick={() => updateQuantity(item._id, -1)}
                              className="w-6 h-6 border border-zinc-200 flex items-center justify-center text-xs hover:border-brand-wine rounded-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-semibold px-2 w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, 1)}
                              className="w-6 h-6 border border-zinc-200 flex items-center justify-center text-xs hover:border-brand-wine rounded-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Remove Button Icon */}
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-zinc-300 hover:text-brand-wine text-sm font-bold p-2 cursor-pointer transition"
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Checkout Pricing Summary Block */}
              {cart.length > 0 && (
                <div className="border-t border-zinc-100 px-6 py-6 bg-zinc-50 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Estimated Subtotal</span>
                    <span className="text-xl font-black text-brand-black">GHS {subtotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Shipping options and custom regional taxes applied at billing layout.</p>
                  
                  <div className="space-y-2 pt-2">
                    <Link 
                      to="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full bg-brand-wine text-white text-center block py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-brand-black transition duration-300 rounded shadow-xs"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}

// PREMIUM MULTI-COLUMN LUXURY BOUTIQUE FOOTER COMPONENT
function GlobalFooter() {
  return (
    <footer className="relative bg-[#0a0a0a] text-zinc-400 py-20 px-6 text-xs tracking-wide border-t border-zinc-800 font-sans overflow-hidden">
      {/* Decorative Radial Gradient Background for Premium Feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-wine/10 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-10">
        
        {/* Column 1: Core Logistics */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold tracking-widest uppercase">📍 Store Hub Location</h4>
          <p className="text-zinc-300 font-semibold text-sm">Awoshie - Onyinase</p>
          <p className="text-zinc-500 text-[11px] leading-relaxed">Accra, Ghana — Seamless processing point handling fast dispatch courier logistics locally.</p>
        </div>

        {/* Column 2: Direct Anchor Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold tracking-widest uppercase">🔗 Quick Links</h4>
          <ul className="space-y-2 font-medium">
            <li><Link to="/" className="hover:text-brand-wine transition">Home</Link></li>
            <li><Link to="/catalog" className="hover:text-brand-wine transition">Shop Collection</Link></li>
            <li><Link to="/contact" className="hover:text-brand-wine transition">Contact Support</Link></li>
            <li><Link to="/login" className="hover:text-brand-wine transition">Client Portal Login</Link></li>
          </ul>
        </div>

        {/* Column 3: Legal Policy Disclosures */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold tracking-widest uppercase">📋 Corporate Policies</h4>
          <ul className="space-y-2 font-medium">
            <li><a href="#returns" className="hover:text-brand-wine transition">7-Day Exchange Agreement</a></li>
            <li><a href="#delivery" className="hover:text-brand-wine transition">Awoshie Delivery Metrics</a></li>
            <li><a href="#privacy" className="hover:text-brand-wine transition">Data Privacy Protection</a></li>
            <li><a href="#terms" className="hover:text-brand-wine transition">Terms of Transaction Services</a></li>
          </ul>
        </div>

        {/* Column 4: Schedulers & Assets Links */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold tracking-widest uppercase">⏰ Operating Hours</h4>
          <p className="leading-relaxed">Monday - Friday: <span className="text-white font-semibold">7:30AM - 8:00PM</span></p>
          <p className="leading-relaxed">Saturday: <span className="text-white font-semibold">8:00AM - 5:30PM</span></p>
          <div className="pt-2 flex gap-3 text-[11px] font-black uppercase text-brand-gold">
            <a href="#instagram" className="hover:underline">IG</a> • <a href="#tiktok" className="hover:underline">TK</a> • <a href="#facebook" className="hover:underline">FB</a>
          </div>
        </div>

      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] uppercase font-bold tracking-widest text-zinc-500 text-center sm:text-left">
        <p>© 2026 J2G Apparel Luxury Hub. All Rights Reserved.</p>
        <p className="flex items-center gap-2">Premium Layer Built for <span className="text-brand-gold flex items-center gap-1">✨ Accra</span></p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} /> 
            <Route path="/contact" element={<Contact />} /> 
          </Routes>
          <GlobalFooter />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}