import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, products, updateProducts } = useApp(); 

  // --- CORE STATE MATRICES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedStatus, setSubscribedStatus] = useState(false);
  
  // MVP EXTRA FEATURES DRIVERS
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Initial State Hydration

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribedStatus(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribedStatus(false), 5000);
    }
  };

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    updateProducts(products.map(p => p._id === selectedProductForReview._id ? {
      ...p,
      reviews: [...p.reviews, { reviewer: user ? user.name : "Guest Buyer", rating: reviewRating, comment: reviewText }]
    } : p));

    alert("✨ Customer feedback securely pushed into product meta schema layer.");
    setReviewText('');
    setSelectedProductForReview(null);
  };

  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 text-brand-black dark:text-zinc-100 min-h-screen font-sans transition-colors duration-300 antialiased">
      
      {/* PROMOTIONS INFOBAR */}
      <div className="bg-brand-wine text-white text-center py-2 text-[11px] font-bold tracking-widest uppercase px-4">
        ⚡ PROMOTION: FREE DELIVERY WITHIN AWOSHIE FOR ORDERS OVER GHS 500! ⚡
      </div>

      {/* HERO SECTION */}
      <section className="relative h-[75vh] md:h-[90vh] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Animated Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom" 
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(17,17,17,0.4), rgba(17,17,17,0.8)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80')` }}
        ></div>
        
        <div className="relative z-10 max-w-3xl space-y-8 animate-fade-in-up">
          <div className="inline-block border border-white/20 p-4 md:p-6 mb-1 bg-black/30 backdrop-blur-md shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-shadow duration-500 rounded-sm">
            <h1 className="text-5xl md:text-8xl text-white font-light tracking-tighter">
              J2<span className="font-black text-brand-wine drop-shadow-[0_0_15px_rgba(122,21,39,0.5)]">G</span>
            </h1>
            <div className="bg-white/90 text-brand-black text-[10px] md:text-[11px] font-black tracking-[0.5em] uppercase py-1.5 px-6 mt-3 shadow-lg">APPAREL</div>
          </div>
          <p className="text-xs md:text-lg text-zinc-200 tracking-[0.3em] uppercase font-medium drop-shadow-md">BRAND BUT AFFORDABLE</p>

          {!user ? (
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 max-w-md mx-auto p-6 space-y-5 rounded shadow-2xl">
              <p className="text-[10px] md:text-xs text-zinc-300 tracking-[0.15em] font-semibold uppercase">Join the circle for customized elite tracking</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => navigate('/login')} className="bg-brand-wine hover:bg-white hover:text-brand-black text-white text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3 transition-all duration-300 rounded-sm shadow-[0_0_15px_rgba(122,21,39,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:-translate-y-1 cursor-pointer">Sign In</button>
                <button onClick={() => navigate('/login')} className="bg-transparent hover:bg-white/10 text-white border border-white/50 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3 transition-all duration-300 rounded-sm hover:-translate-y-1 cursor-pointer">Create Account</button>
              </div>
            </div>
          ) : (
            <div className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-wine/30 backdrop-blur-md border border-brand-gold/30 py-3 px-8 rounded inline-block shadow-lg animate-pulse-glow">
              ✨ Welcome back to your dashboard, {user.name}
            </div>
          )}
        </div>
      </section>

      {/* TRENDING PREVIEW GRID */}
      <section id="trending-catalog" className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase text-zinc-900 dark:text-white">
              Trending <span className="font-bold text-brand-wine">Masterpieces</span>
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Discover what everyone is talking about</p>
          </div>
          <button onClick={() => navigate('/catalog')} className="bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-brand-wine dark:text-brand-gold border border-brand-wine dark:border-brand-gold text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 transition-all duration-300 rounded-sm shadow-sm cursor-pointer whitespace-nowrap">
            View Full Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-5 w-full">
          {trendingProducts.map(product => {
            const isWishlisted = wishlist.some(item => item._id === product._id);
            const averageRating = product.reviews?.length ? Math.round(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length) : 5;

            return (
              <div key={product._id} className="group flex flex-col border border-zinc-200/60 dark:border-white/5 p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg hover:shadow-2xl hover:shadow-brand-wine/10 dark:hover:shadow-brand-wine/20 transition-all duration-500 hover:-translate-y-1.5 rounded-sm relative text-xs">
                {/* WISHLIST TRIGGER ACCENT BUTTON */}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 z-20 bg-zinc-100/90 dark:bg-zinc-800/90 p-1.5 rounded-full shadow-2xs hover:scale-110 transition cursor-pointer text-[10px] border border-zinc-200/40 dark:border-zinc-700/40"
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>

                <div className="overflow-hidden aspect-square bg-zinc-100 dark:bg-zinc-800 relative mb-3 rounded-2xs">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.discountPrice && <span className="bg-brand-wine text-white text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 shadow-sm rounded-2xs">SAVE</span>}
                    {product.isTrending && <span className="bg-brand-black text-white text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 shadow-sm rounded-2xs">TRENDING</span>}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-[8px] uppercase text-brand-wine font-bold tracking-widest">{product.category}</span>
                      <span className="text-[9px] font-bold text-brand-gold">{'★'.repeat(averageRating)}{'☆'.repeat(5 - averageRating)}</span>
                    </div>
                    <h3 className="font-semibold text-[11px] tracking-wide mb-1 text-zinc-900 dark:text-zinc-100 group-hover:text-brand-wine transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 italic mb-2 line-clamp-1 leading-relaxed hidden sm:block">
                      {product.reviews?.length ? `"${product.reviews[0].comment}"` : "No reviews yet."}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-zinc-900 dark:text-zinc-100 font-black text-sm">GHS {product.discountPrice || product.price}</span>
                      {product.discountPrice && <span className="text-[10px] text-zinc-400 line-through">GHS {product.price}</span>}
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button onClick={() => addToCart(product)} className="col-span-3 bg-[#111] dark:bg-zinc-800 text-white py-2 text-[9px] tracking-[0.2em] uppercase font-black hover:bg-brand-wine transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_10px_rgba(122,21,39,0.3)] rounded-sm">Add To Cart</button>
                      <button onClick={() => setSelectedProductForReview(product)} className="col-span-1 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-[10px] hover:border-brand-gold hover:text-brand-gold transition-colors duration-300 rounded-sm cursor-pointer text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800" title="Write a review entry">📝</button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* REVIEWS FORM ENTRY PIPELINE MODAL */}
      {selectedProductForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedProductForReview(null)}></div>
          <form onSubmit={handleAddReviewSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-brand-black dark:text-white p-6 max-w-md w-full rounded shadow-2xl relative z-10 space-y-4 text-xs font-sans">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-brand-wine">Log Store Feedback</h3>
              <p className="text-[11px] text-zinc-400 font-bold uppercase mt-0.5 tracking-wider">{selectedProductForReview.name}</p>
            </div>
            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1">Select Rating Star Weights</label>
              <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-white p-2.5 font-bold outline-none rounded-xs">
                <option value="5">⭐⭐⭐⭐⭐ Premium (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ Fine (4 Stars)</option>
                <option value="3">⭐⭐⭐ Balanced (3 Stars)</option>
                <option value="2">⭐⭐ Fair (2 Stars)</option>
                <option value="1">⭐ Poor (1 Star)</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1">Your Detailed Experience</label>
              <textarea rows="3" required placeholder="State size fits, color profiles, or tailored metrics accuracy..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full border border-zinc-200 dark:border-zinc-800 p-3 rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-white outline-none focus:border-brand-wine"></textarea>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-brand-wine text-white py-2.5 font-bold uppercase tracking-widest rounded-xs hover:bg-brand-black transition cursor-pointer">Submit Review</button>
              <button type="button" onClick={() => setSelectedProductForReview(null)} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-4 py-2.5 font-bold uppercase tracking-wider rounded-xs cursor-pointer">Close</button>
            </div>
          </form>
        </div>
      )}

      {/* MARKETING PROMO ROW */}
      <section className="bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs text-brand-wine uppercase tracking-widest font-bold">Limited Seasonal Promo</span>
            <h3 className="text-2xl md:text-3xl font-light tracking-wide uppercase text-zinc-900 dark:text-white">Upgrade Your Signature <br/><span className="font-bold">Oud & Luxury Style</span></h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Discover our exclusive collection direct from global designers. Crafted for elegance, priced for accessibility.</p>
            <div><span className="inline-block bg-brand-black text-white px-6 py-2.5 text-[11px] font-bold tracking-widest uppercase">Up to 20% OFF Select Items</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80" alt="Perfume" className="w-full h-40 md:h-48 object-cover rounded shadow-md border border-zinc-100 dark:border-zinc-800" />
            <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80" alt="Bag" className="w-full h-40 md:h-48 object-cover rounded shadow-md mt-6 border border-zinc-100 dark:border-zinc-800" />
          </div>
        </div>
      </section>

      {/* NEWSLETTER LAYER */}
      <section className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-900 via-[#111] to-[#0a0a0a] text-white py-24 px-6 text-center border-b border-zinc-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-wine/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <h3 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase">Join the J2G Elite Circle</h3>
          <p className="text-xs text-zinc-400 uppercase tracking-wider leading-relaxed">Subscribe to receive immediate notifications regarding drops and coupon codes entry routes.</p>
          <form onSubmit={handleNewsletterSubmit} className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" required placeholder="Enter email address" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="bg-black/50 backdrop-blur-sm border border-zinc-700 focus:border-brand-gold text-white px-5 py-3.5 text-xs outline-none flex-1 rounded-sm transition-colors duration-300 shadow-inner" />
            <button type="submit" className="bg-brand-wine text-white text-[11px] font-black tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-brand-gold hover:text-brand-black transition-all duration-300 rounded-sm cursor-pointer shadow-[0_0_15px_rgba(122,21,39,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">Subscribe</button>
          </form>
          {subscribedStatus && <p className="text-brand-gold text-xs font-bold tracking-widest animate-pulse-glow mt-4 bg-brand-gold/10 inline-block px-4 py-2 rounded-full">✨ Welcome to J2G luxury updates channel.</p>}
        </div>
      </section>

    </div>
  );
}