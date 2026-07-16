import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function Catalog() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, products, updateProducts } = useApp(); 

  // --- CORE STATE MATRICES ---
  const [searchQuery, setSearchQuery] = useState('');
  
  // MVP EXTRA FEATURES DRIVERS
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // ADVANCED CATALOG CONTROL LOGIC DRIVERS
  const { search } = useLocation();
  const queryParam = new URLSearchParams(search).get('category');
  const [categoryFilter, setCategoryFilter] = useState(queryParam || 'All');
  const [maxPriceFilter, setMaxPriceFilter] = useState(2000); 
  const [sortByFilter, setSortByFilter] = useState('popularity'); 
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (queryParam) setCategoryFilter(queryParam);
  }, [queryParam]);

  const handleClearFilters = () => {
    setCategoryFilter('All');
    setSearchQuery('');
    setMaxPriceFilter(2000);
    setSortByFilter('popularity');
  };

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    updateProducts(products.map(p => p._id === selectedProductForReview._id ? {
      ...p,
      reviews: [...(p.reviews || []), { reviewer: user ? user.name : "Guest Buyer", rating: reviewRating, comment: reviewText }]
    } : p));

    alert("✨ Customer feedback securely pushed into product meta schema layer.");
    setReviewText('');
    setSelectedProductForReview(null);
  };

  const filteredProducts = products
    .filter(product => {
      const activePrice = product.discountPrice || product.price;
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      const matchesPrice = activePrice <= maxPriceFilter;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sortByFilter === 'low-to-high') return priceA - priceB;
      if (sortByFilter === 'high-to-low') return priceB - priceA;
      if (sortByFilter === 'trending') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      if (sortByFilter === 'new-arrivals') return b.dateAdded - a.dateAdded; 
      return b.popularity - a.popularity;
    });

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 text-brand-black dark:text-zinc-100 min-h-screen font-sans transition-colors duration-300 antialiased pt-6">
      
      {/* CATALOG FILTERS MODULE AND DISPLAY GRID */}
      <section id="shop-catalog" className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase text-zinc-900 dark:text-white">
              Explore Our <span className="font-bold text-brand-wine">Collection</span>
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Showing {filteredProducts.length} Premium Luxury Masterpieces</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 flex items-center shadow-2xs">
              <input type="text" placeholder="Search catalog..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full text-xs bg-transparent outline-none pr-6 text-zinc-800 dark:text-zinc-200" />
              <span className="absolute right-3 text-xs opacity-40">🔍</span>
            </div>

            <select value={sortByFilter} onChange={(e) => setSortByFilter(e.target.value)} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 p-2.5 rounded text-xs font-bold uppercase tracking-wider outline-none cursor-pointer focus:border-brand-wine shadow-2xs flex-1 md:flex-none">
              <option value="popularity">🔥 Sort By: Popularity</option>
              <option value="low-to-high">💵 Price: Low to High</option>
              <option value="high-to-low">💎 Price: High to Low</option>
              <option value="trending">✨ Sort By: Trending</option>
              <option value="new-arrivals">✨ Sort By: New Arrivals</option>
            </select>
            
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden bg-[#111] dark:bg-zinc-800 text-white p-2.5 rounded text-xs font-bold uppercase tracking-wider shadow-md hover:bg-brand-wine transition flex-1"
            >
              ⚙️ Categories
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Mobile Overlay */}
          {mobileFiltersOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            ></div>
          )}

          {/* FILTER SIDEBAR (Sticky on Desktop, Drawer on Mobile) */}
          <aside className={`
            ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'} 
            fixed inset-y-0 left-0 z-50 w-4/5 max-w-xs h-screen overflow-y-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl transition-transform duration-300
            md:static md:translate-x-0 md:w-auto md:h-auto md:max-w-none md:overflow-visible md:bg-white md:dark:bg-zinc-900 md:backdrop-blur-none md:border md:rounded md:shadow-2xs md:sticky md:top-24 md:col-span-4 lg:col-span-3 space-y-6
          `}>
            
            {/* Mobile Close Button */}
            <div className="flex md:hidden justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
              <span className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Categories</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-zinc-500 hover:text-brand-wine text-xl">✕</button>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-3">Categories</h3>
              <div className="flex flex-col gap-2.5 text-xs tracking-wide">
                {['All', "Women's Fashion", "Men's Fashion", 'Shoes', 'Bags', 'Jewelry', 'Accessories'].map(cat => (
                  <button key={cat} onClick={() => setCategoryFilter(cat)} className={`text-left transition-all ${categoryFilter === cat ? 'text-brand-wine font-bold translate-x-1' : 'text-zinc-500 hover:text-brand-black dark:hover:text-white'}`}>{cat} {categoryFilter === cat && '•'}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">Max Budget</h3>
                <span className="text-xs font-black text-brand-wine">GHS {maxPriceFilter}</span>
              </div>
              <input type="range" min="200" max="2000" step="50" value={maxPriceFilter} onChange={(e) => setMaxPriceFilter(Number(e.target.value))} className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-wine" />
            </div>

            {/* INTEGRATED BADGE SWITCH QUICK LOCK CONTROLLERS */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200 mb-3">Collection Badges</h3>
              <div className="flex flex-col gap-3 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <input type="checkbox" checked={sortByFilter === 'trending'} onChange={() => setSortByFilter(sortByFilter === 'trending' ? 'popularity' : 'trending')} className="accent-brand-wine h-3.5 w-3.5 border border-zinc-300 dark:border-zinc-700 rounded-xs" />
                  <span className={`group-hover:text-brand-wine transition ${sortByFilter === 'trending' ? 'text-brand-wine font-bold' : ''}`}>🔥 Trending Products</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <input type="checkbox" checked={sortByFilter === 'new-arrivals'} onChange={() => setSortByFilter(sortByFilter === 'new-arrivals' ? 'popularity' : 'new-arrivals')} className="accent-brand-wine h-3.5 w-3.5 border border-zinc-300 dark:border-zinc-700 rounded-xs" />
                  <span className={`group-hover:text-brand-wine transition ${sortByFilter === 'new-arrivals' ? 'text-brand-wine font-bold' : ''}`}>✨ New Arrivals Stock</span>
                </label>
              </div>
            </div>

            <button onClick={handleClearFilters} className="w-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[10px] py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition rounded-xs cursor-pointer">Reset Console</button>
          </aside>

          {/* SHOWROOM GRID AREA (COMPUTED DYNAMIC MODE THEME TOKENS) */}
          <main className="grid col-span-1 md:col-span-8 lg:col-span-9 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-5">
              {filteredProducts.map(product => {
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
          </main>
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

    </div>
  );
}