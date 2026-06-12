import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const localCart = localStorage.getItem('shopez_cart');
    if (localCart) {
      try {
        setCartItems(JSON.parse(localCart));
      } catch (error) {
        console.error('Error parsing cart items from localStorage', error);
        localStorage.removeItem('shopez_cart');
      }
    }
  }, []);

  // Save cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopez_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product, quantity = 1, size = '') => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product === product._id && item.size === size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        // Resolve unified name and image for both legacy (title/mainImg) and new (name/images) schemas
        const resolvedName = product.name || product.title || 'Unknown Product';
        const resolvedImage = product.mainImg || (product.images && product.images[0]) || '';
        const resolvedStock = product.stock !== undefined ? product.stock : 100;

        return [
          ...prevItems,
          {
            product: product._id,
            // Both name fields for compatibility with Order schema and UI
            name: resolvedName,
            title: resolvedName,
            price: product.price,
            // Both image fields for compatibility
            image: resolvedImage,
            mainImg: resolvedImage,
            stock: resolvedStock,
            size,
            quantity,
            discount: product.discount || 0,
            category: product.category || '',
          },
        ];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (productId, size = '') => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.product === productId && item.size === size))
    );
  };

  // Update item quantity
  const updateQuantity = (productId, quantity, size = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId && item.size === size
          ? { ...item, quantity: Number(quantity) }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get items price (subtotal)
  const getItemsPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getTaxPrice = () => {
    return Number((getItemsPrice() * 0.18).toFixed(2)); // 18% GST
  };

  const getShippingPrice = () => {
    const itemsPrice = getItemsPrice();
    if (itemsPrice === 0) return 0;
    return itemsPrice > 1000 ? 0 : 100; // Free shipping over ₹1000
  };

  const getTotalPrice = () => {
    return Number((getItemsPrice() + getTaxPrice() + getShippingPrice()).toFixed(2));
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemsPrice,
        getTaxPrice,
        getShippingPrice,
        getTotalPrice,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
