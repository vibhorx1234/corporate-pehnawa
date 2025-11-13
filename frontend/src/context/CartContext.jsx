// // File: ./frontend/src/context/CartContext.jsx

// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     // Get cart from localStorage on initial load
//     const savedCart = localStorage.getItem('cart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   useEffect(() => {
//     // Save cart to localStorage whenever it changes
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (product, quantity = 1) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item._id === product._id);
      
//       if (existingItem) {
//         return prevCart.map(item =>
//           item._id === product._id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }
      
//       return [...prevCart, { ...product, quantity }];
//     });
//   };

//   const removeFromCart = (productId) => {
//     setCart(prevCart => prevCart.filter(item => item._id !== productId));
//   };

//   const updateQuantity = (productId, quantity) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
    
//     setCart(prevCart =>
//       prevCart.map(item =>
//         item._id === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => {
//       const price = item.discountedPrice || item.price;
//       return total + (price * item.quantity);
//     }, 0);
//   };

//   const getCartCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         getCartTotal,
//         getCartCount
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };




// File: ./frontend/src/context/CartContext.jsx

import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Default to empty array
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage after component mounts (client-side only)
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCart([]);
      }
    }
    setIsInitialized(true);
  }, []); // Run once on mount

  useEffect(() => {
    // Only save to localStorage after initial load to avoid overwriting with empty array
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};