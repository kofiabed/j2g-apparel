import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { products, wishlist, toggleWishlist, updateProducts } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Load product from AppContext or fetch from Supabase
  useEffect(() => {
    window.scrollTo(0, 0);
    setValidationError('');
    setToastMessage('');
    setSelectedImage(0);

    const found = products.find(
      p => p._id === id || p.id === id || p.slug === id || p.sku === id
    );

    if (found) {
      setProduct(found);
      if (found.sizes && found.sizes.length === 1) setSelectedSize(found.sizes[0]);
      else setSelectedSize('');
      if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
      else setSelectedColor('');
      setLoading(false);
    } else {
      // Fetch directly from Supabase
      const fetchFromSupabase = async () => {
        try {
          const { data, error } = await supabase
            .from('Product')
            .select('*, category:Category(id, name, slug)')
            .or(`id.eq.${id},slug.eq.${id},sku.eq.${id}`)
            .maybeSingle();

          if (error || !data) throw new Error('Product not found');

          const safeParse = (val, fallback = []) => {
            if (!val) return fallback;
            if (Array.isArray(val)) return val;
            try { return JSON.parse(val); } catch { return fallback; }
          };

          const mapped = {
            ...data,
            _id: data.id,
            category: data.category ? data.category.name : 'Unknown',
            discountPrice: data.discountedPrice || null,
            popularity: data.popularity || 0,
            dateAdded: new Date(data.createdAt || Date.now()).getTime(),
            isTrending: data.isFeatured || false,
            isNewArrival: data.isNewArrival || false,
            isBestSeller: data.isBestSeller || false,
            brand: data.brand || 'J2G Apparel',
            material: data.material || null,
            slug: data.slug || data.id,
            images: safeParse(data.images, ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80']),
            sizes: safeParse(data.sizes, ['S', 'M', 'L']),
            colors: safeParse(data.colors, ['Black', 'White']),
            reviews: data.reviews || []
          };

          setProduct(mapped);
          if (mapped.sizes && mapped.sizes.length === 1) setSelectedSize(mapped.sizes[0]);
          if (mapped.colors && mapped.colors.length > 0) setSelectedColor(mapped.colors[0]);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchFromSupabase();
    }
  }, [id, products]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background text-foreground font-sans">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-brand-wine border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground">Loading Boutique Masterpiece...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-foreground font-sans px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-light uppercase tracking-widest mb-3">Masterpiece Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">The requested product could not be located in our showroom collection.</p>
        <Link to="/catalog" className="bg-brand-wine text-white text-xs uppercase tracking-widest font-black px-8 py-3.5 rounded-sm hover:bg-brand-black transition">
          Return to Showroom
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80'
  ];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const activePrice = product.discountPrice || product.price;
  const isWishlisted = wishlist.some(item => item._id === product._id);
  const reviews = product.reviews || [];
  const averageRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0';
  const discountPercent = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : null;
  const isShoeCategory = product.category.toLowerCase().includes('shoe');

  // Related products from same category or brand
  const relatedProducts = products
    .filter(p => p._id !== product._id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const validateSelections = () => {
    if (sizes.length > 0 && !selectedSize) {
      setValidationError('Please select a size before proceeding.');
      return false;
    }
    if (colors.length > 0 && !selectedColor) {
      setValidationError('Please select a color before proceeding.');
      return false;
    }
    if (product.stock <= 0) {
      setValidationError('This product is currently out of stock.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelections()) return;

    addToCart({
      product,
      size: selectedSize || (sizes[0] || 'Standard'),
      color: selectedColor || (colors[0] || 'Standard'),
      quantity
    });

    setToastMessage(`✨ Added ${quantity} × "${product.name}" (${selectedSize || 'Standard'}${selectedColor ? `, ${selectedColor}` : ''}) to your basket!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleBuyNow = () => {
    if (!validateSelections()) return;

    addToCart({
      product,
      size: selectedSize || (sizes[0] || 'Standard'),
      color: selectedColor || (colors[0] || 'Standard'),
      quantity
    });

    navigate('/checkout');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newReview = {
      reviewer: user ? user.name : 'Guest Client',
      user: { name: user ? user.name : 'Guest Client' },
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    const updatedProduct = { ...product, reviews: updatedReviews };

    setProduct(updatedProduct);
    updateProducts(products.map(p => p._id === product._id ? updatedProduct : p));

    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="bg-background text-foreground min-h-screen font-sans transition-colors duration-300 antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-brand-black dark:bg-card border border-brand-gold text-white dark:text-foreground px-6 py-4 rounded-sm shadow-2xl animate-fade-in-up flex items-center gap-3">
          <span className="text-brand-gold text-lg">🛍️</span>
          <span className="text-xs font-bold tracking-wider uppercase">{toastMessage}</span>
        </div>
      )}

      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-4">
        <ol className="flex items-center flex-wrap gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          <li>
            <Link to="/" className="hover:text-brand-wine transition-colors">Home</Link>
          </li>
          <li className="text-zinc-400">/</li>
          <li>
            <Link to="/catalog" className="hover:text-brand-wine transition-colors">Shop</Link>
          </li>
          <li className="text-zinc-400">/</li>
          <li>
            <Link to={`/catalog?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-wine transition-colors">
              {product.category}
            </Link>
          </li>
          <li className="text-zinc-400">/</li>
          <li className="text-foreground font-bold truncate max-w-[200px] md:max-w-none">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* MAIN PRODUCT SHOWCASE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT: IMAGE GALLERY MODULE */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Spotlight Image */}
            <div className="relative aspect-square md:aspect-[4/4.2] bg-[#f5f5f7] dark:bg-muted/40 rounded-sm overflow-hidden border border-border/60 group">
              
              {/* Product Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {discountPercent && (
                  <span className="bg-brand-wine text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-2xs shadow-md">
                    SALE -{discountPercent}%
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-2xs shadow-md">
                    NEW ARRIVAL
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-brand-black text-brand-gold border border-brand-gold/40 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-2xs shadow-md">
                    ★ BEST SELLER
                  </span>
                )}
              </div>

              {/* Wishlist floating toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer border ${
                  isWishlisted 
                    ? 'bg-brand-wine text-white border-brand-wine' 
                    : 'bg-background/80 text-foreground border-border hover:scale-110'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label="Toggle Wishlist"
              >
                <span className="text-sm">{isWishlisted ? '❤️' : '🤍'}</span>
              </button>

              {/* Spotlight Image with smooth Zoom preview */}
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-6 md:p-8 transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Thumbnail Carousel Bar */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#f5f5f7] dark:bg-muted/40 rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === idx 
                        ? 'border-brand-wine shadow-md scale-95' 
                        : 'border-border/60 hover:border-brand-wine/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT DETAILS & BUYING CONTROLS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header: Brand, Category, Title */}
            <div className="border-b border-border/80 pb-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black tracking-[0.25em] text-brand-wine">{product.brand || 'J2G Couture'}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground bg-muted px-2.5 py-1 rounded-sm border border-border">
                  {product.category}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-light tracking-wide text-foreground uppercase">
                {product.name}
              </h1>

              {/* Rating & Reviews overview */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex text-brand-gold text-sm tracking-tighter">
                  {'★'.repeat(Math.round(Number(averageRating)))}{'☆'.repeat(5 - Math.round(Number(averageRating)))}
                </div>
                <span className="text-xs font-bold text-foreground">{averageRating}</span>
                <span className="text-muted-foreground text-xs">•</span>
                <a href="#customer-reviews" className="text-xs text-muted-foreground hover:text-brand-wine transition underline underline-offset-4">
                  {reviews.length} {reviews.length === 1 ? 'Customer Review' : 'Customer Reviews'}
                </a>
              </div>
            </div>

            {/* Pricing Matrix */}
            <div className="flex items-baseline gap-4 py-1">
              <span className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                GHS {activePrice.toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-base text-muted-foreground line-through font-medium">
                  GHS {product.price.toLocaleString()}
                </span>
              )}
              {discountPercent && (
                <span className="text-xs font-black uppercase text-brand-wine bg-brand-wine/10 px-2.5 py-1 rounded-sm border border-brand-wine/20">
                  Save GHS {(product.price - product.discountPrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock & SKU indicators */}
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className={product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>
                  {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
                </span>
              </div>
              <span className="text-muted-foreground font-normal">|</span>
              <span className="text-muted-foreground font-mono text-[11px]">SKU: {product.sku || 'J2G-000'}</span>
            </div>

            {/* Short highlight excerpt */}
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Error Validation Alert */}
            {validationError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs p-3 rounded-sm font-bold uppercase tracking-wider animate-pulse flex items-center gap-2">
                <span>⚠️</span>
                <span>{validationError}</span>
              </div>
            )}

            {/* COLOR SELECTION */}
            {colors.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                    Color: <span className="text-brand-wine font-black">{selectedColor || 'Select Color'}</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedColor(col); setValidationError(''); }}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
                        selectedColor === col
                          ? 'bg-brand-black text-white dark:bg-zinc-100 dark:text-brand-black border-brand-black dark:border-zinc-100 shadow-sm scale-105'
                          : 'bg-card border-border text-foreground hover:border-brand-wine/60'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIZE SELECTION */}
            {sizes.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                    Size: <span className="text-brand-wine font-black">{selectedSize || 'Select Size'}</span>
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[11px] font-bold uppercase tracking-wider text-brand-wine hover:underline cursor-pointer flex items-center gap-1"
                  >
                    📏 Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {sizes.map((sz, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedSize(sz); setValidationError(''); }}
                      className={`py-3 text-xs font-bold uppercase tracking-widest rounded-sm border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-brand-wine text-white border-brand-wine shadow-md scale-95'
                          : 'bg-card border-border text-foreground hover:border-brand-wine/60'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY & ACTIONS */}
            <div className="space-y-4 pt-4 border-t border-border/80">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Quantity:</label>
                <div className="flex items-center border border-border rounded-sm bg-card">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-sm font-black hover:bg-muted transition disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    disabled={quantity >= (product.stock || 99)}
                    className="w-10 h-10 flex items-center justify-center text-sm font-black hover:bg-muted transition disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS (ADD TO CART + BUY NOW) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full bg-[#111] dark:bg-muted text-white py-4 text-xs font-black tracking-[0.25em] uppercase hover:bg-brand-wine transition-all duration-300 rounded-sm shadow-xl hover:shadow-[0_0_20px_rgba(122,21,39,0.4)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>🛒</span> Add To Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full bg-brand-wine text-white py-4 text-xs font-black tracking-[0.25em] uppercase hover:bg-brand-gold hover:text-brand-black transition-all duration-300 rounded-sm shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>⚡</span> Buy Now
                </button>
              </div>
            </div>

            {/* TRUST & SERVICE GUARANTEES */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border text-[11px] text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <span>Express Accra Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <span>100% Genuine Apparel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🔄</span>
                <span>7-Day Showroom Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🔒</span>
                <span>Verified Mobile Money & Card</span>
              </div>
            </div>

          </div>
        </div>

        {/* TABS SECTION: SPECIFICATIONS & CARE INSTRUCTIONS */}
        <section className="mt-16 md:mt-24 border-t border-border pt-12">
          <div className="flex border-b border-border text-xs uppercase font-black tracking-[0.2em] gap-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 border-b-2 transition-all cursor-pointer ${
                activeTab === 'description'
                  ? 'border-brand-wine text-brand-wine'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Detailed Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 border-b-2 transition-all cursor-pointer ${
                activeTab === 'shipping'
                  ? 'border-brand-wine text-brand-wine'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Delivery & Exchange Policies
            </button>
          </div>

          <div className="py-8 text-xs md:text-sm leading-relaxed text-muted-foreground max-w-4xl space-y-4">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <p className="text-foreground font-normal">{product.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/60">
                  <div className="flex justify-between border-b border-border/40 py-2">
                    <span className="font-bold text-foreground uppercase tracking-wider">Brand Name:</span>
                    <span>{product.brand || 'J2G Apparel Hub'}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 py-2">
                    <span className="font-bold text-foreground uppercase tracking-wider">Category:</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 py-2">
                    <span className="font-bold text-foreground uppercase tracking-wider">Material & Fabric:</span>
                    <span>{product.material || 'Premium Handcrafted Luxury Blend'}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 py-2">
                    <span className="font-bold text-foreground uppercase tracking-wider">SKU Identification:</span>
                    <span className="font-mono">{product.sku}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 py-2">
                    <span className="font-bold text-foreground uppercase tracking-wider">Origin:</span>
                    <span>Direct Atelier Dispatch</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 py-2">
                    <span className="font-bold text-foreground uppercase tracking-wider">Care Instructions:</span>
                    <span>{isShoeCategory ? 'Wipe with soft suede/leather brush' : 'Dry clean or gentle hand wash cold'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Awoshie - Onyinase Transit Logistics</h4>
                <p>
                  Orders dispatched directly from our showroom hub at Awoshie - Onyinase, Accra. Express same-day courier dispatch is available for orders confirmed before 2:00 PM GMT.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 pt-2">
                  <li><strong>Greater Accra:</strong> Standard 24h delivery (GHS 30) or same-day express.</li>
                  <li><strong>Regional Ghana (Kumasi, Takoradi, Tamale):</strong> 48h VIP bus express parcel service.</li>
                  <li><strong>Exchange Policy:</strong> Unworn items with showroom security tags intact may be exchanged within 7 business days.</li>
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* CUSTOMER REVIEWS SECTION */}
        <section id="customer-reviews" className="mt-16 md:mt-24 border-t border-border pt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase text-foreground">
                Customer <span className="font-bold text-brand-wine">Feedback</span>
              </h2>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">
                Verified impressions on fabric texture, silhouette accuracy, and craftsmanship
              </p>
            </div>
            <div className="flex items-center gap-3 bg-muted/60 px-5 py-3 rounded-sm border border-border">
              <span className="text-2xl font-black text-foreground">{averageRating}</span>
              <div>
                <div className="flex text-brand-gold text-xs">
                  {'★'.repeat(Math.round(Number(averageRating)))}{'☆'.repeat(5 - Math.round(Number(averageRating)))}
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase">{reviews.length} Verified Entries</span>
              </div>
            </div>
          </div>

          {/* Review Submission Form */}
          <div className="bg-card border border-border/80 p-6 md:p-8 rounded-sm shadow-sm mb-12 max-w-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-4">
              Write A Verified Review
            </h3>

            {reviewSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs p-4 rounded-sm mb-4 tracking-wide uppercase">
                ✨ Thank you! Your client feedback has been posted successfully.
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-bold uppercase tracking-wider mb-1.5">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full border border-border bg-background p-3 font-bold outline-none rounded-xs focus:border-brand-wine"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Exceptional Luxury</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars - Very Pleased</option>
                  <option value="3">⭐⭐⭐ 3 Stars - Average Fit</option>
                  <option value="2">⭐⭐ 2 Stars - Below Expectation</option>
                  <option value="1">⭐ 1 Star - Unsatisfactory</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-bold uppercase tracking-wider mb-1.5">Your Impressions</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Share details on garment fit, stitch quality, or color brilliance..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full border border-border p-3 rounded-xs bg-background text-foreground outline-none focus:border-brand-wine"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-brand-wine text-white px-8 py-3 text-[11px] font-black tracking-[0.2em] uppercase rounded-xs hover:bg-brand-black transition cursor-pointer"
              >
                Submit Feedback
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-4">No reviews recorded yet. Be the first to log client feedback for this piece!</p>
            ) : (
              reviews.map((rev, idx) => (
                <div key={idx} className="bg-card border border-border/60 p-5 rounded-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                      {rev.reviewer || (rev.user ? rev.user.name : 'Verified Buyer')}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <div className="text-brand-gold text-xs">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* RELATED PRODUCTS ("YOU MAY ALSO LIKE") */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-border pt-12">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase text-foreground">
                  You May Also <span className="font-bold text-brand-wine">Like</span>
                </h2>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">
                  Complementary fashion pieces curated for your aesthetic
                </p>
              </div>
              <Link to="/catalog" className="text-xs font-bold uppercase tracking-widest text-brand-wine hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(rel => {
                const relPrice = rel.discountPrice || rel.price;
                const relImg = rel.images && rel.images.length > 0 ? rel.images[0] : 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80';

                return (
                  <Link
                    key={rel._id}
                    to={`/product/${rel._id}`}
                    className="group flex flex-col border border-border/60 p-3 bg-card/80 backdrop-blur-lg hover:shadow-2xl hover:shadow-brand-wine/10 transition-all duration-500 hover:-translate-y-1.5 rounded-sm relative text-xs"
                  >
                    <div className="overflow-hidden aspect-square bg-[#f5f5f7] dark:bg-muted relative mb-3 rounded-2xs">
                      <img
                        src={relImg}
                        alt={rel.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {rel.discountPrice && (
                        <span className="absolute top-2 left-2 bg-brand-wine text-white text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 shadow-sm rounded-2xs">
                          SAVE
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] uppercase text-brand-wine font-bold tracking-widest block mb-0.5">{rel.category}</span>
                        <h3 className="font-semibold text-[11px] tracking-wide mb-1 text-foreground group-hover:text-brand-wine transition-colors line-clamp-1">
                          {rel.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-baseline gap-2 pt-2">
                        <span className="text-foreground font-black text-sm">GHS {relPrice}</span>
                        {rel.discountPrice && (
                          <span className="text-[10px] text-muted-foreground line-through">GHS {rel.price}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </main>

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-muted/60 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)}></div>
          
          <div className="bg-card border border-border text-foreground p-6 md:p-8 max-w-xl w-full rounded shadow-2xl relative z-10 space-y-6 text-xs font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-wine">
                  {isShoeCategory ? 'Shoe Size Conversion Guide' : 'Apparel Measurements Chart'}
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">J2G Luxury Standard Metrics</p>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-muted-foreground hover:text-brand-wine text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isShoeCategory ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">Standard European and UK/US footwear fitting matrix.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-border text-xs">
                    <thead>
                      <tr className="bg-muted text-foreground uppercase tracking-wider font-bold">
                        <th className="border border-border p-2.5">EU Size</th>
                        <th className="border border-border p-2.5">UK Size</th>
                        <th className="border border-border p-2.5">US Men</th>
                        <th className="border border-border p-2.5">US Women</th>
                        <th className="border border-border p-2.5">Foot Length (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-border p-2.5">38</td><td className="border border-border p-2.5">5</td><td className="border border-border p-2.5">5.5</td><td className="border border-border p-2.5">7.5</td><td className="border border-border p-2.5">24.0 cm</td></tr>
                      <tr className="bg-muted/30"><td className="border border-border p-2.5">39</td><td className="border border-border p-2.5">6</td><td className="border border-border p-2.5">6.5</td><td className="border border-border p-2.5">8.5</td><td className="border border-border p-2.5">24.5 cm</td></tr>
                      <tr><td className="border border-border p-2.5">40</td><td className="border border-border p-2.5">6.5</td><td className="border border-border p-2.5">7.0</td><td className="border border-border p-2.5">9.0</td><td className="border border-border p-2.5">25.0 cm</td></tr>
                      <tr className="bg-muted/30"><td className="border border-border p-2.5">41</td><td className="border border-border p-2.5">7</td><td className="border border-border p-2.5">8.0</td><td className="border border-border p-2.5">9.5</td><td className="border border-border p-2.5">26.0 cm</td></tr>
                      <tr><td className="border border-border p-2.5">42</td><td className="border border-border p-2.5">8</td><td className="border border-border p-2.5">8.5</td><td className="border border-border p-2.5">10.0</td><td className="border border-border p-2.5">26.5 cm</td></tr>
                      <tr className="bg-muted/30"><td className="border border-border p-2.5">43</td><td className="border border-border p-2.5">9</td><td className="border border-border p-2.5">9.5</td><td className="border border-border p-2.5">11.0</td><td className="border border-border p-2.5">27.5 cm</td></tr>
                      <tr><td className="border border-border p-2.5">44</td><td className="border border-border p-2.5">9.5</td><td className="border border-border p-2.5">10.0</td><td className="border border-border p-2.5">11.5</td><td className="border border-border p-2.5">28.0 cm</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">Standard garment measurements for dresses, tops, suits, and skirts.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-border text-xs">
                    <thead>
                      <tr className="bg-muted text-foreground uppercase tracking-wider font-bold">
                        <th className="border border-border p-2.5">Size Tag</th>
                        <th className="border border-border p-2.5">Bust/Chest (in)</th>
                        <th className="border border-border p-2.5">Waist (in)</th>
                        <th className="border border-border p-2.5">Hips (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-border p-2.5 font-bold">XS (0-2)</td><td className="border border-border p-2.5">31" - 33"</td><td className="border border-border p-2.5">24" - 26"</td><td className="border border-border p-2.5">34" - 36"</td></tr>
                      <tr className="bg-muted/30"><td className="border border-border p-2.5 font-bold">S (4-6)</td><td className="border border-border p-2.5">34" - 36"</td><td className="border border-border p-2.5">27" - 29"</td><td className="border border-border p-2.5">37" - 39"</td></tr>
                      <tr><td className="border border-border p-2.5 font-bold">M (8-10)</td><td className="border border-border p-2.5">37" - 39"</td><td className="border border-border p-2.5">30" - 32"</td><td className="border border-border p-2.5">40" - 42"</td></tr>
                      <tr className="bg-muted/30"><td className="border border-border p-2.5 font-bold">L (12-14)</td><td className="border border-border p-2.5">40" - 42"</td><td className="border border-border p-2.5">33" - 35"</td><td className="border border-border p-2.5">43" - 45"</td></tr>
                      <tr><td className="border border-border p-2.5 font-bold">XL (16-18)</td><td className="border border-border p-2.5">43" - 46"</td><td className="border border-border p-2.5">36" - 39"</td><td className="border border-border p-2.5">46" - 49"</td></tr>
                      <tr className="bg-muted/30"><td className="border border-border p-2.5 font-bold">XXL (20)</td><td className="border border-border p-2.5">47" - 50"</td><td className="border border-border p-2.5">40" - 43"</td><td className="border border-border p-2.5">50" - 53"</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setShowSizeGuide(false)}
                className="bg-brand-black text-white px-6 py-2.5 rounded-sm font-bold uppercase tracking-wider text-[11px]"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
