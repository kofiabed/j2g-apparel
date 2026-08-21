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
import ProductDetails from './pages/ProductDetails';

function Navbar() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user, logout } = useAuth(); 
  const { darkMode, toggleDarkMode } = useApp(); // 2. Hooked up dark mode dynamic controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calculate shopping statistics on the fly
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => {
    const activePrice = item.discountPrice || item.price;
    return acc + (activePrice * item.quantity);
  }, 0);

  return (
    <>
      {/* NAVIGATION BAR */}
      <nav className="bg-background/90 backdrop-blur-lg text-foreground sticky top-0 z-40 px-4 md:px-6 py-4 flex justify-between items-center tracking-widest border-b border-border font-sans shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-500 relative">
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold tracking-widest hover:text-brand-wine transition group text-foreground">
          J2G <span className="text-brand-wine group-hover:text-brand-gold transition-colors duration-300">APPAREL</span>
        </Link>
        
        {/* MOBILE TOGGLES (Hamburger + Cart) */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center bg-brand-black dark:bg-brand-wine/20 px-3 py-1.5 rounded-full border border-brand-black dark:border-brand-wine/40 cursor-pointer"
          >
            <span className="text-sm">🛒</span>
            <span className="font-bold text-white dark:text-brand-gold ml-2 text-xs">{totalItems}</span>
          </button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 border border-border rounded-sm hover:bg-muted transition cursor-pointer relative z-50 bg-muted/50"
            title="Toggle Menu"
          >
            {/* Hamburger Icon Animation Matrix */}
            <div className="space-y-1.5 w-5">
              <div className={`w-full h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-full h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-full h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* DESKTOP LINKS CONTAINER */}
        <div className="hidden md:flex gap-6 text-[11px] uppercase font-bold items-center tracking-[0.15em]">
          <Link to="/" className="relative group hover:text-foreground text-muted-foreground transition-colors duration-300">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/catalog" className="relative group hover:text-foreground text-muted-foreground transition-colors duration-300">
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
          </Link> 
          <Link to="/contact" className="relative group hover:text-foreground text-muted-foreground transition-colors duration-300">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          <button 
            onClick={toggleDarkMode}
            className="p-1.5 rounded-full border border-border hover:border-zinc-600 transition cursor-pointer text-sm bg-background/40 flex items-center justify-center w-8 h-8 select-none"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'ADMIN' ? (
                <Link to="/admin" className="text-[10px] font-bold text-white bg-brand-wine border border-brand-wine px-2.5 py-1 rounded-sm hover:bg-brand-wine/80 transition">
                  👤 ADMIN USER
                </Link>
              ) : (
                <span className="text-[10px] font-bold text-white bg-brand-wine border border-brand-wine px-2.5 py-1 rounded-sm">
                  👤 {user.name}
                </span>
              )}
              <button onClick={logout} className="text-muted-foreground hover:text-brand-wine transition cursor-pointer text-xs font-bold">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-brand-wine transition text-muted-foreground">Login</Link>
          )}

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center bg-brand-black dark:bg-brand-wine/20 px-4 py-2 rounded-full border border-brand-black dark:border-brand-wine/40 cursor-pointer hover:bg-brand-wine hover:border-brand-wine dark:hover:bg-brand-wine/40 dark:hover:border-brand-gold/50 hover:shadow-[0_0_15px_rgba(122,21,39,0.2)] transition-all duration-300 group"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">🛒</span>
            <span className="font-bold text-white dark:text-brand-gold ml-2.5 text-xs">{totalItems}</span>
          </button>
        </div>

        {/* MOBILE SLIDE-DOWN DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-brand-black/95 backdrop-blur-xl border-b border-border md:hidden flex flex-col items-center py-8 gap-6 shadow-2xl shadow-black/10 dark:shadow-black origin-top transition-all duration-300 z-50">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xs uppercase font-black tracking-[0.2em] text-foreground hover:text-brand-wine transition">Home</Link>
            <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="text-xs uppercase font-black tracking-[0.2em] text-foreground hover:text-brand-wine transition">Shop Collection</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xs uppercase font-black tracking-[0.2em] text-foreground hover:text-brand-wine transition">Contact Support</Link>
            
            <div className="w-16 h-px bg-border my-2"></div>
            
            <button 
              onClick={() => { toggleDarkMode(); setIsMobileMenuOpen(false); }}
              className="text-xs uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2 hover:text-white transition cursor-pointer bg-muted/50 px-6 py-2.5 rounded-full border border-border"
            >
              {darkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
            </button>

            {user ? (
              <div className="flex flex-col items-center gap-4 mt-2">
                {user.role === 'ADMIN' ? (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold text-brand-gold bg-brand-wine/20 border border-brand-wine/30 px-6 py-3 rounded-sm shadow-sm hover:bg-brand-wine/40 transition">
                    👤 {user.name} (HQ Panel)
                  </Link>
                ) : (
                  <span className="text-[10px] font-bold text-brand-gold bg-brand-wine/20 border border-brand-wine/30 px-6 py-3 rounded-sm">
                    👤 {user.name}
                  </span>
                )}
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-muted-foreground hover:text-brand-wine transition text-[11px] font-bold uppercase tracking-widest cursor-pointer underline underline-offset-4 mt-2">
                  Secure Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xs uppercase font-bold tracking-widest text-muted-foreground hover:text-brand-wine bg-card/50 px-6 py-3 border border-white/10 rounded-sm">
                Login to Client Portal
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* SLIDE-OUT CART DRAWER SLIDE SYSTEM */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Dark Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-muted/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 animate-[slide-in-right_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="w-screen max-w-md bg-white dark:bg-background text-foreground flex flex-col shadow-2xl border-l border-zinc-100 dark:border-border">
              
              {/* Drawer Title Header */}
              <div className="px-6 py-6 bg-background dark:bg-muted/50 border-b border-zinc-100 dark:border-border flex items-center justify-between">
                <h2 className="text-sm font-black tracking-[0.2em] uppercase text-zinc-900 dark:text-zinc-100">Your Basket <span className="text-brand-wine">({totalItems})</span></h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-muted-foreground hover:text-brand-wine text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Dynamic Items Iteration Listing */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-3">
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
                    const key = item.cartKey || item._id;
                    return (
                      <div key={key} className="flex items-center gap-4 border-b border-border pb-4">
                        <img 
                          src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80'} 
                          alt={item.name} 
                          className="w-16 h-20 object-cover bg-muted rounded-sm shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium tracking-wide text-foreground line-clamp-1">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5 mb-1">
                            <span className="text-[10px] uppercase text-brand-wine font-bold">{item.category}</span>
                            {item.selectedSize && (
                              <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-2xs border border-border">
                                {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-2xs border border-border">
                                {item.selectedColor}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-foreground">GHS {pricePerUnit * item.quantity}</p>
                          
                          {/* Counter Control Modifiers */}
                          <div className="flex items-center gap-2 mt-2">
                            <button 
                              onClick={() => updateQuantity(key, -1)}
                              className="w-6 h-6 border border-border flex items-center justify-center text-xs hover:border-brand-wine rounded-xs cursor-pointer text-foreground"
                            >
                              -
                            </button>
                            <span className="text-xs font-semibold px-2 w-4 text-center text-foreground">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(key, 1)}
                              className="w-6 h-6 border border-border flex items-center justify-center text-xs hover:border-brand-wine rounded-xs cursor-pointer text-foreground"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Remove Button Icon */}
                        <button 
                          onClick={() => removeFromCart(key)}
                          className="text-muted-foreground hover:text-brand-wine text-sm font-bold p-2 cursor-pointer transition shrink-0"
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
                <div className="border-t border-zinc-100 px-6 py-6 bg-background space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Estimated Subtotal</span>
                    <span className="text-xl font-black text-brand-black">GHS {subtotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Shipping options and custom regional taxes applied at billing layout.</p>
                  
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
    <footer className="relative bg-[#0a0a0a] text-muted-foreground py-20 px-6 text-xs tracking-wide border-t border-border font-sans overflow-hidden">
      {/* Decorative Radial Gradient Background for Premium Feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-wine/10 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-10">
        
        {/* Column 1: Core Logistics */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold tracking-widest uppercase">📍 Store Hub Location</h4>
          <p className="text-muted-foreground font-semibold text-sm">Awoshie - Onyinase</p>
          <p className="text-muted-foreground text-[11px] leading-relaxed">Accra, Ghana — Seamless processing point handling fast dispatch courier logistics locally.</p>
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

      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] uppercase font-bold tracking-widest text-muted-foreground text-center sm:text-left">
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
            <Route path="/product/:id" element={<ProductDetails />} /> 
          </Routes>
          <GlobalFooter />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}