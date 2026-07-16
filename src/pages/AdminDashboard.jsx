import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { products, updateProducts } = useApp();
  const navigate = useNavigate();

  // Redirect instantly if unauthorized access is caught
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert("Access Denied: Administrative privileges required.");
      navigate('/login');
    }
  }, [user, navigate]);

  // --- CORE STATE DRIVERS ---
  const [activeTab, setActiveTab] = useState('inventory');

  const [orders, setOrders] = useState([
    { id: 'ORD-8821', customer: 'Kofi Mensah', date: '2026-05-24', total: 760, status: 'Processing', address: 'Awoshie, Near Onyinase Station' },
    { id: 'ORD-8794', customer: 'Abena Osei', date: '2026-05-23', total: 290, status: 'Shipped', address: 'East Legon, Accra' },
    { id: 'ORD-8611', customer: 'Derrick Kwakye', date: '2026-05-20', total: 1350, status: 'Delivered', address: 'Awoshie - Onyinase Hub' }
  ]);

  // --- ADVANCED METRICS RUN-TIME LOGIC ---
  const totalRevenue = orders.reduce((acc, ord) => acc + ord.total, 0);
  const lowStockItems = products.filter(p => p.stock <= 5).length;
  const pendingOrders = orders.filter(ord => ord.status !== 'Delivered').length;

  // --- FORM STATE LOGIC ---
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formProduct, setFormProduct] = useState({
    name: '', price: '', discountPrice: '', category: "Women's Fashion", stock: '', image: ''
  });

  const categories = ["Women's Fashion", "Men's Fashion", "Shoes", "Bags", "Jewelry", "Accessories"];

  // --- LOGIC: LOCAL IMAGE FILE PROCESSING LINE ---
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file format size boundaries for browser state storage limits
      if (file.size > 1.5 * 1024 * 1024) {
        alert("⚠️ File size limit restriction exceeded: Choose an image under 1.5MB for local processing compilation.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String); // Render dynamic layout thumbnail preview instantly
        setFormProduct(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file); // Convert browser buffer stream to standard data URI
    }
  };

  const handleInputChange = (e) => {
    setFormProduct({ ...formProduct, [e.target.name]: e.target.value });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const fallbackImage = 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80';
    
    if (isEditing) {
      updateProducts(products.map(p => p._id === currentProductId ? {
        ...p,
        name: formProduct.name,
        price: Number(formProduct.price),
        discountPrice: formProduct.discountPrice ? Number(formProduct.discountPrice) : null,
        category: formProduct.category,
        stock: Number(formProduct.stock),
        images: [formProduct.image || fallbackImage]
      } : p));
      setIsEditing(false);
      setCurrentProductId(null);
      alert("✨ Product specs updated successfully.");
    } else {
      const newProduct = {
        _id: `PROD-${new Date().getTime().toString().slice(-4)}`,
        name: formProduct.name,
        price: Number(formProduct.price),
        discountPrice: formProduct.discountPrice ? Number(formProduct.discountPrice) : null,
        category: formProduct.category,
        stock: Number(formProduct.stock),
        images: [formProduct.image || fallbackImage],
        reviews: [],
        popularity: 0,
        isTrending: false,
        dateAdded: new Date().getTime()
      };
      updateProducts([newProduct, ...products]);
      alert("🎉 Product file successfully added to showroom repository.");
    }
    
    // Clear Form and Metadata Toggles
    setFormProduct({ name: '', price: '', discountPrice: '', category: "Women's Fashion", stock: '', image: '' });
    setImagePreview('');
    e.target.reset(); // Flash native upload file inputs elements clears out
  };

  const handleEditInit = (product) => {
    setIsEditing(true);
    setCurrentProductId(product._id);
    setImagePreview(product.images?.[0] || '');
    setFormProduct({
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category,
      stock: product.stock || 10,
      image: product.images?.[0] || ''
    });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this structural inventory item?")) {
      updateProducts(products.filter(p => p._id !== id));
    }
  };

  const handleToggleOrderStatus = (orderId) => {
    setOrders(orders.map(ord => ord.id === orderId ? {
      ...ord,
      status: ord.status === 'Processing' ? 'Shipped' : 'Delivered'
    } : ord));
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans text-brand-black dark:text-zinc-100 antialiased transition-colors duration-500">
      
      {/* 1. HQ MANAGEMENT TITLE BANNER */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800 py-6 px-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-wine/10 border border-brand-wine/20 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white flex items-center gap-2">
              J2G <span className="text-brand-wine drop-shadow-sm">HQ CONTROL</span>
            </h1>
            <p className="text-[10px] md:text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-1">Authorized Officer: <span className="text-brand-gold font-bold">{user.name}</span> • Master Management Level</p>
          </div>
        </div>
        
        <div className="flex bg-zinc-100/50 dark:bg-zinc-950/50 p-1.5 rounded-sm border border-zinc-200/50 dark:border-zinc-800 gap-1 text-[11px] font-bold uppercase tracking-wider w-full md:w-auto shadow-inner">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 md:flex-none text-center px-6 py-3 rounded-xs transition-all duration-300 cursor-pointer ${activeTab === 'inventory' ? 'bg-[#111] dark:bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
          >
            Showroom Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 md:flex-none text-center px-6 py-3 rounded-xs transition-all duration-300 cursor-pointer ${activeTab === 'orders' ? 'bg-[#111] dark:bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
          >
            Carrier Run Registry <span className="ml-1 bg-brand-wine text-white px-2 py-0.5 rounded-full text-[9px] font-black">{pendingOrders}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* 2. ENTERPRISE LEVEL METRICS DOCK CARDS OVERVIEW */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-sm shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 flex justify-between items-center group">
            <div>
              <span className="text-[10px] font-black tracking-widest text-zinc-500 dark:text-zinc-400 uppercase block mb-1">Gross Earnings Volume</span>
              <span className="text-2xl font-light tracking-tight text-zinc-900 dark:text-white block group-hover:text-brand-gold transition-colors">
                <span className="text-sm font-bold align-top mr-1">GHS</span>{totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">🇬🇭</div>
          </div>

          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-sm shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300 flex justify-between items-center group">
            <div>
              <span className="text-[10px] font-black tracking-widest text-zinc-500 dark:text-zinc-400 uppercase block mb-1">Low Supply Threshold Warning</span>
              <span className="text-2xl font-light tracking-tight text-amber-600 dark:text-amber-500 block group-hover:scale-105 transition-transform origin-left">
                {lowStockItems} <span className="text-sm font-bold">Items</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">⚠️</div>
          </div>

          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-sm shadow-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 flex justify-between items-center group">
            <div>
              <span className="text-[10px] font-black tracking-widest text-zinc-500 dark:text-zinc-400 uppercase block mb-1">Active Dispatch Registry</span>
              <span className="text-2xl font-light tracking-tight text-emerald-600 dark:text-emerald-500 block group-hover:scale-105 transition-transform origin-left">
                {pendingOrders} <span className="text-sm font-bold">Runs</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">📦</div>
          </div>
        </section>

        {/* 3. DYNAMIC CONTENT SPLIT AREA WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {activeTab === 'inventory' ? (
            <>
              {/* COMPONENT: ADVANCED ADD / RECONCILE MODIFIER ENTRY COMPONENT FORM */}
              <div className="lg:col-span-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 border border-zinc-200/50 dark:border-zinc-800 rounded-sm shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-wine/5 rounded-full blur-[40px] pointer-events-none"></div>
                <div className="border-b border-zinc-200/50 dark:border-zinc-800 pb-4 flex justify-between items-center relative z-10">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">
                    {isEditing ? 'Modify Specs' : 'Upload New Design Entry'}
                  </h2>
                  {isEditing && <span className="text-[9px] bg-brand-wine text-white font-bold uppercase px-3 py-1 rounded-full animate-pulse shadow-sm">Edit Mode</span>}
                </div>
                
                <form onSubmit={handleSaveProduct} className="space-y-5 text-xs relative z-10">
                  <div>
                    <label className="block text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Product Designation Title</label>
                    <input type="text" name="name" required placeholder="e.g. Italian Silk Evening Gown" value={formProduct.name} onChange={handleInputChange} className="w-full border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine text-zinc-800 dark:text-zinc-200 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Base Cost (GHS)</label>
                      <input type="number" name="price" required placeholder="450" value={formProduct.price} onChange={handleInputChange} className="w-full border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine text-zinc-800 dark:text-zinc-200 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)]" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Promo Sale Cost</label>
                      <input type="number" name="discountPrice" placeholder="380" value={formProduct.discountPrice} onChange={handleInputChange} className="w-full border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine text-zinc-800 dark:text-zinc-200 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Category Target</label>
                      <select name="category" value={formProduct.category} onChange={handleInputChange} className="w-full border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine text-zinc-800 dark:text-zinc-200 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm cursor-pointer">
                        {categories.map(cat => <option key={cat} value={cat} className="bg-white dark:bg-zinc-900">{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Inventory Units</label>
                      <input type="number" name="stock" required placeholder="15" value={formProduct.stock} onChange={handleInputChange} className="w-full border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-sm outline-none focus:border-brand-wine dark:focus:border-brand-wine text-zinc-800 dark:text-zinc-200 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm transition-all focus:shadow-[0_0_15px_rgba(122,21,39,0.1)]" />
                    </div>
                  </div>

                  {/* HIGH-END FEATURE UPDATER: FILE LOCAL UPLOAD COMPILING CHANNELS */}
                  <div>
                    <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1">Product Media Asset</label>
                    <div className="border border-dashed border-zinc-300 rounded p-3 bg-zinc-50 text-center space-y-3 hover:border-brand-wine transition duration-300">
                      
                      {imagePreview ? (
                        <div className="relative inline-block border rounded bg-white p-1">
                          <img src={imagePreview} alt="Upload Grid Preview" className="w-24 h-32 object-cover rounded-xs" />
                          <button 
                            type="button" 
                            onClick={() => { setImagePreview(''); setFormProduct(p => ({ ...p, image: '' })); }}
                            className="absolute -top-1.5 -right-1.5 bg-brand-wine text-white rounded-full w-4 h-4 flex items-center justify-center font-bold text-[9px] cursor-pointer shadow shadow-black"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="py-2 text-zinc-400 space-y-1">
                          <span className="text-xl block">📷</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider block">Upload local product photography asset file</span>
                        </div>
                      )}

                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="w-full text-[10px] text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xs file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-wider file:bg-brand-black file:text-white hover:file:bg-brand-wine file:cursor-pointer" 
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 bg-brand-wine text-white p-3 font-bold uppercase tracking-widest hover:bg-brand-black transition duration-300 shadow-sm rounded-xs cursor-pointer">
                      {isEditing ? 'Commit Product Reconcile' : 'Authorize Catalogue Entry'}
                    </button>
                    {isEditing && (
                      <button 
                        type="button" 
                        onClick={() => { setIsEditing(false); setFormProduct({ name: '', price: '', discountPrice: '', category: "Women's Fashion", stock: '', image: '' }); setImagePreview(''); }}
                        className="bg-zinc-200 text-zinc-600 px-4 py-3 font-bold uppercase tracking-wider hover:bg-zinc-300 transition rounded-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* COMPONENT: INTERACTIVE DATA TABLE REGISTRY SHOWROOM VIEW */}
              <div className="lg:col-span-8 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800 rounded-sm shadow-xl overflow-hidden relative">
                <div className="px-6 py-5 border-b border-zinc-200/50 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/50 flex justify-between items-center backdrop-blur-md relative z-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">Live Showroom Catalog Stack <span className="ml-2 bg-[#111] dark:bg-zinc-100 text-white dark:text-[#111] px-2 py-0.5 rounded-full">{products.length}</span></h3>
                </div>

                <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800 overflow-x-auto relative z-10 custom-scrollbar max-h-[600px]">
                  {products.map(product => (
                    <div key={product._id} className="p-5 flex items-center justify-between min-w-[700px] gap-6 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors duration-300 group">
                      <div className="flex items-center gap-5 flex-1">
                        <div className="relative overflow-hidden rounded-xs border border-zinc-200 dark:border-zinc-700 shadow-md">
                          <img src={product.images?.[0]} alt={product.name} className="w-14 h-20 object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <span className="text-[10px] bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 font-mono font-bold text-zinc-500 dark:text-zinc-400 rounded-sm inline-block mb-1 shadow-inner">{product._id}</span>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-wide group-hover:text-brand-wine transition-colors">{product.name}</h4>
                          <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block mt-1">{product.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-12">
                        {/* Live inventory thresholds checks */}
                        <div className="w-28 text-center">
                          <span className={`text-[10px] font-black px-3 py-1.5 rounded-xs border tracking-widest uppercase shadow-inner ${
                            product.stock === 0 
                              ? 'bg-rose-50/80 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900' 
                              : product.stock <= 5 
                              ? 'bg-amber-50/80 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900' 
                              : 'bg-emerald-50/80 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
                          }`}>
                            {product.stock === 0 ? 'Sold Out' : `${product.stock} Units`}
                          </span>
                        </div>

                        {/* Price columns */}
                        <div className="w-24 text-right">
                          <p className="text-sm font-black text-zinc-900 dark:text-white">GHS {product.discountPrice || product.price}</p>
                          {product.discountPrice && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 line-through">GHS {product.price}</p>}
                        </div>

                        {/* Actions Modifiers Buttons */}
                        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                          <button onClick={() => handleEditInit(product)} className="border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-brand-black dark:hover:border-white hover:text-brand-black dark:hover:text-white px-4 py-2 rounded-sm bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm transition-all duration-300 cursor-pointer shadow-sm hover:-translate-y-0.5">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="border border-brand-wine/50 text-brand-wine hover:bg-brand-wine hover:text-white px-4 py-2 rounded-sm transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(122,21,39,0.3)] hover:-translate-y-0.5 bg-white/50 dark:bg-zinc-900/50">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* COMPONENT: COMPREHENSIVE CARRIER ROUTING ORDER DICTIONARY VIEW */
            <div className="lg:col-span-12 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800 rounded-sm shadow-xl overflow-hidden relative animate-fade-in-up">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-wine/5 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="px-6 py-5 border-b border-zinc-200/50 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/50 flex justify-between items-center backdrop-blur-md relative z-10">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">Incoming Dispatch Activity Logs <span className="ml-2 bg-[#111] dark:bg-zinc-100 text-white dark:text-[#111] px-2 py-0.5 rounded-full">{orders.length}</span></h3>
              </div>

              <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800 overflow-x-auto relative z-10 custom-scrollbar max-h-[600px]">
                {orders.map(order => (
                  <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-[850px] hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors duration-300 text-xs group">
                    <div className="grid grid-cols-4 flex-1 items-center gap-6">
                      <div>
                        <span className="font-mono text-zinc-500 dark:text-zinc-400 block tracking-widest text-[10px] mb-1">{order.date}</span>
                        <span className="font-black text-zinc-900 dark:text-zinc-100 tracking-wide text-sm group-hover:text-brand-wine transition-colors">{order.id}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block text-[9px] uppercase font-black tracking-widest mb-1">Consignee Name</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{order.customer}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block text-[9px] uppercase font-black tracking-widest mb-1">Route Target Milestones</span>
                        <span className="text-zinc-700 dark:text-zinc-300 truncate block max-w-xs font-medium">{order.address}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block text-[9px] uppercase font-black tracking-widest mb-1">Settlement Volume</span>
                        <span className="font-black text-brand-wine text-sm">GHS {order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 justify-end min-w-[240px]">
                      <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm border shadow-inner ${
                        order.status === 'Processing' 
                          ? 'bg-amber-50/80 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900' 
                          : order.status === 'Shipped' 
                          ? 'bg-blue-50/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900' 
                          : 'bg-emerald-50/80 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
                      }`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${order.status === 'Processing' ? 'bg-amber-500 animate-pulse' : order.status === 'Shipped' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                        {order.status}
                      </span>
                      {order.status !== 'Delivered' && (
                        <button 
                          onClick={() => handleToggleOrderStatus(order.id)} 
                          className="bg-[#111] dark:bg-zinc-100 text-white dark:text-[#111] font-black uppercase tracking-widest text-[10px] px-4 py-2.5 rounded-sm hover:bg-brand-wine dark:hover:bg-brand-wine dark:hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(122,21,39,0.3)] hover:-translate-y-0.5"
                        >
                          {order.status === 'Processing' ? 'Dispatch Courier Run' : 'Confirm Delivery Drop'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}