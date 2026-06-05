// File: ./frontend/src/context/CartContext.jsx  (MODIFIED)
// Changes from original:
//   1. When user is logged in, cart state is synced with backend via cartService
//   2. When guest, original localStorage behaviour is preserved exactly
//   3. On login (user prop changes null→object), guest cart items are merged into backend cart
//   4. addToCart now accepts sizeType/standardSize/customMeasurements for the new flow
//   5. All original method signatures kept so existing components don't break

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, accessToken } = useContext(AuthContext);

  // Local cart for guests (original localStorage approach)
  const [localCart, setLocalCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Server cart for logged-in users
  const [serverCart, setServerCart] = useState(null); // null = not yet loaded
  const [cartLoading, setCartLoading] = useState(false);

  // Persist local cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(localCart));
  }, [localCart]);

  // When user logs in — fetch server cart and merge any local items
  useEffect(() => {
    if (!user || !accessToken) {
      setServerCart(null);
      return;
    }
    const fetchAndMerge = async () => {
      setCartLoading(true);
      try {
        const res = await cartService.getCart(accessToken);
        let cart = res.data;

        // Merge local guest items into server cart
        if (localCart.length > 0) {
          for (const item of localCart) {
            try {
              await cartService.addItem(accessToken, {
                productId: item._id,
                quantity: item.quantity,
                sizeType: item.sizeType || 'standard',
                standardSize: item.standardSize,
                customMeasurements: item.customMeasurements
              });
            } catch { /* skip items that fail (out of stock, etc.) */ }
          }
          // Re-fetch after merge
          const merged = await cartService.getCart(accessToken);
          cart = merged.data;
          setLocalCart([]); // Clear local cart after merge
        }

        setServerCart(cart);
      } catch (err) {
        console.error('Failed to load cart:', err);
      } finally {
        setCartLoading(false);
      }
    };
    fetchAndMerge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, accessToken]);

  // ── Derived state ─────────────────────────────────────────────────────────
  // Expose a unified `cart` array regardless of auth state
  const cart = user
    ? (serverCart?.items || []).map(item => ({
        // Normalise server cart item to match original shape expected by components
        _id: item.product?._id || item.product,
        name: item.productName,
        images: item.product?.images || [],
        price: item.price,
        discountedPrice: item.product?.discountedPrice,
        quantity: item.quantity,
        sizeType: item.sizeType,
        standardSize: item.standardSize,
        customMeasurements: item.customMeasurements,
        _cartItemId: item._id  // keep server-side item id for update/remove
      }))
    : localCart;

  // ── Actions ───────────────────────────────────────────────────────────────

  const addToCart = useCallback(async (product, quantity = 1, sizeOptions = {}) => {
    const { sizeType = 'standard', standardSize, customMeasurements } = sizeOptions;

    if (user && accessToken) {
      try {
        const res = await cartService.addItem(accessToken, {
          productId: product._id,
          quantity,
          sizeType,
          standardSize,
          customMeasurements
        });
        setServerCart(res.data);
      } catch (err) {
        console.error('Failed to add to cart:', err);
        throw err;
      }
    } else {
      // Guest — original localStorage logic
      setLocalCart(prev => {
        const existing = prev.find(i => i._id === product._id && i.standardSize === standardSize);
        if (existing) {
          return prev.map(i =>
            i._id === product._id && i.standardSize === standardSize
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...product, quantity, sizeType, standardSize, customMeasurements }];
      });
    }
  }, [user, accessToken]);

  const removeFromCart = useCallback(async (productId, cartItemId) => {
    if (user && accessToken && cartItemId) {
      try {
        const res = await cartService.removeItem(accessToken, cartItemId);
        setServerCart(res.data);
      } catch (err) { console.error('Failed to remove item:', err); }
    } else {
      setLocalCart(prev => prev.filter(i => i._id !== productId));
    }
  }, [user, accessToken]);

  const updateQuantity = useCallback(async (productId, quantity, cartItemId) => {
    if (quantity <= 0) { removeFromCart(productId, cartItemId); return; }

    if (user && accessToken && cartItemId) {
      try {
        const res = await cartService.updateItem(accessToken, cartItemId, quantity);
        setServerCart(res.data);
      } catch (err) { console.error('Failed to update quantity:', err); }
    } else {
      setLocalCart(prev =>
        prev.map(i => i._id === productId ? { ...i, quantity } : i)
      );
    }
  }, [user, accessToken, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (user && accessToken) {
      try {
        const res = await cartService.clearCart(accessToken);
        setServerCart(res.data);
      } catch (err) { console.error('Failed to clear cart:', err); }
    } else {
      setLocalCart([]);
    }
  }, [user, accessToken]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      serverCart,
      cartLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};