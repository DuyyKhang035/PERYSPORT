'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('pery_cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('pery_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [cartItems, mounted]);

  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    const variant = product.variants.find(
      (v) => v.color === selectedColor && String(v.size) === String(selectedSize)
    );

    if (!variant) {
      throw new Error('Biến thể sản phẩm không hợp lệ');
    }

    if (variant.stock < quantity) {
      throw new Error(`Sản phẩm chỉ còn ${variant.stock} trong kho`);
    }

    const sku = variant.sku;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.sku === sku);

      if (existingIndex > -1) {
        const existingItem = prev[existingIndex];
        const newQty = existingItem.quantity + quantity;

        if (newQty > variant.stock) {
          throw new Error(`Bạn đã có ${existingItem.quantity} sản phẩm trong giỏ. Tồn kho tối đa: ${variant.stock}`);
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQty,
        };
        return updated;
      } else {
        const unitPrice = product.finalPrice || variant.price || product.originalPrice;
        const newItem = {
          productId: product._id,
          productName: product.name,
          slug: product.slug,
          brandName: product.brand?.name || 'PERY SPORT',
          color: variant.color,
          size: String(variant.size),
          sku: variant.sku,
          price: unitPrice,
          originalPrice: variant.originalPrice || product.originalPrice,
          image: variant.image || product.images?.[0] || '',
          quantity,
          stock: variant.stock,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (sku, newQty) => {
    if (newQty <= 0) {
      removeFromCart(sku);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          if (newQty > item.stock) {
            alert(`Kho chỉ còn ${item.stock} sản phẩm.`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (sku) => {
    setCartItems((prev) => prev.filter((item) => item.sku !== sku));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Đổi biến thể (màu/size) của 1 cart item
  // productVariants: mảng variants đầy đủ của sản phẩm (lấy từ API hoặc truyền vào)
  const changeVariant = (oldSku, productVariants, newColor, newSize) => {
    const newVariant = productVariants.find(
      (v) => v.color === newColor && String(v.size) === String(newSize)
    );

    if (!newVariant) {
      throw new Error(`Biến thể ${newColor} / Size ${newSize} không tồn tại.`);
    }

    setCartItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.sku === oldSku);
      if (oldIndex === -1) throw new Error('Không tìm thấy sản phẩm trong giỏ');

      const oldItem = prev[oldIndex];
      const newSku = newVariant.sku;

      // Không thay đổi gì nếu chọn đúng variant cũ
      if (newSku === oldSku) return prev;

      const existingNewIndex = prev.findIndex((item) => item.sku === newSku);
      const mergedQty = oldItem.quantity + (existingNewIndex > -1 ? prev[existingNewIndex].quantity : 0);

      if (newVariant.stock <= 0) {
        throw new Error('Biến thể này đã hết hàng');
      }
      if (mergedQty > newVariant.stock) {
        throw new Error(`Tồn kho chỉ còn ${newVariant.stock} sản phẩm (bạn đang có ${existingNewIndex > -1 ? prev[existingNewIndex].quantity : 0} trong giỏ)`);
      }

      // Xây dựng item mới
      const updatedItem = {
        ...oldItem,
        color: newVariant.color,
        size: String(newVariant.size),
        sku: newVariant.sku,
        price: newVariant.price || oldItem.price,
        image: newVariant.image || oldItem.image,
        stock: newVariant.stock,
        quantity: mergedQty,
      };

      let updated = [...prev];

      if (existingNewIndex > -1) {
        // Gộp vào item đã có, xoá item cũ
        updated[existingNewIndex] = updatedItem;
        updated.splice(oldIndex === existingNewIndex ? existingNewIndex : oldIndex, 1);
      } else {
        // Thay thế trực tiếp
        updated[oldIndex] = updatedItem;
      }

      return updated;
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        changeVariant,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
