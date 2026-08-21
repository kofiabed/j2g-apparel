import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // addToCart now accepts options: { product, size, color, quantity }
  // or just a product for backwards compatibility
  const addToCart = (productOrOptions) => {
    let product, size, color, quantity;
    
    if (productOrOptions && productOrOptions.product) {
      // New format: { product, size, color, quantity }
      product = productOrOptions.product;
      size = productOrOptions.size || null;
      color = productOrOptions.color || null;
      quantity = productOrOptions.quantity || 1;
    } else {
      // Legacy format: just a product object
      product = productOrOptions;
      size = null;
      color = null;
      quantity = 1;
    }

    // Create unique key from product ID + size + color
    const cartKey = `${product._id}-${size || 'nosize'}-${color || 'nocolor'}`;

    setCart((prevCart) => {
      const exists = prevCart.find(item => item.cartKey === cartKey);
      if (exists) {
        return prevCart.map(item =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, cartKey, selectedSize: size, selectedColor: color, quantity }];
    });
  };

  const removeFromCart = (cartKey) => {
    setCart(cart.filter(item => (item.cartKey || item._id) !== cartKey));
  };

  const updateQuantity = (cartKey, amount) => {
    setCart(cart.map(item =>
      (item.cartKey || item._id) === cartKey ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);