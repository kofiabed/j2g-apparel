import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/products';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  // Sync Theme Layer State on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('j2g_theme');
    let isDark = false;
    
    // Auto-switch logic based on time of day if no manual override
    if (savedTheme !== null) {
      isDark = savedTheme === 'dark';
    } else {
      const currentHour = new Date().getHours();
      // Evening/Night is 6 PM (18:00) to 6 AM (06:00)
      isDark = currentHour >= 18 || currentHour < 6;
    }

    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    const savedWishlist = localStorage.getItem('j2g_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/products');
        if (res.ok) {
          const data = await res.json();
          // Map id to _id for frontend compatibility
          const mappedData = data.map(p => ({
            ...p,
            _id: p.id,
            category: p.category ? p.category.name : 'Unknown',
            discountPrice: p.discountedPrice || null,
            popularity: p.popularity || 0,
            dateAdded: new Date(p.createdAt).getTime(),
            isTrending: p.isFeatured || false,
            isNewArrival: p.isNewArrival || false,
            isBestSeller: p.isBestSeller || false,
            brand: p.brand || 'J2G Apparel',
            material: p.material || null,
            slug: p.slug || p.id,
            images: p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [],
            sizes: p.sizes ? (typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes) : [],
            colors: p.colors ? (typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors) : [],
            reviews: p.reviews || []
          }));
          setProducts(mappedData);
          localStorage.setItem('j2g_products', JSON.stringify(mappedData));
        } else {
          // Fallback to local storage if API fails
          const savedProducts = localStorage.getItem('j2g_products');
          if (savedProducts) setProducts(JSON.parse(savedProducts));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        const savedProducts = localStorage.getItem('j2g_products');
        if (savedProducts) setProducts(JSON.parse(savedProducts));
      }
    };
    
    fetchProducts();
  }, []);

  const toggleDarkMode = () => {
    const updatedTheme = !darkMode;
    setDarkMode(updatedTheme);
    localStorage.setItem('j2g_theme', updatedTheme ? 'dark' : 'light');
    if (updatedTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleWishlist = (product) => {
    let updatedWishlist;
    if (wishlist.some(item => item._id === product._id)) {
      updatedWishlist = wishlist.filter(item => item._id !== product._id);
      alert(`🤍 Removed "${product.name}" from your wishlist.`);
    } else {
      updatedWishlist = [...wishlist, product];
      alert(`❤️ Added "${product.name}" to your wishlist!`);
    }
    setWishlist(updatedWishlist);
    localStorage.setItem('j2g_wishlist', JSON.stringify(updatedWishlist));
  };

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('j2g_products', JSON.stringify(newProducts));
  };

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode, wishlist, toggleWishlist, products, updateProducts }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);