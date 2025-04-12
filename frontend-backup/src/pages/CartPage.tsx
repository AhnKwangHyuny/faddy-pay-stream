import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // Generate a unique ID for each cart item based on product ID and size
  const getItemKey = (productId: string, size: string) => `${productId}_${size}`;
  
  // Initialize selected items with all items if cart is not empty
  React.useEffect(() => {
    if (cart.items.length > 0) {
      const allKeys = new Set(
        cart.items.map(item => getItemKey(item.product.id, item.size))
      );
      setSelectedItems(allKeys);
    } else {
      setSelectedItems(new Set());
    }
  }, [cart.items.length]);
  
  const handleQuantityChange = (productId: string, size: string, newQuantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, size, quantity: newQuantity },
    });
  };
  
  const handleRemoveItem = (productId: string, size: string) => {
    // Also remove from selected items
    const itemKey = getItemKey(productId, size);
    const updatedSelectedItems = new Set(selectedItems);
    updatedSelectedItems.delete(itemKey);
    setSelectedItems(updatedSelectedItems);
    
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId, size },
    });
  };
  
  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Select all items
      const allKeys = new Set(
        cart.items.map(item => getItemKey(item.product.id, item.size))
      );
      setSelectedItems(allKeys);
    } else {
      // Deselect all items
      setSelectedItems(new Set());
    }
  };
  
  const handleItemSelectChange = (productId: string, size: string, checked: boolean) => {
    const itemKey = getItemKey(productId, size);
    const updatedSelectedItems = new Set(selectedItems);
    
    if (checked) {
      updatedSelectedItems.add(itemKey);
    } else {
      updatedSelectedItems.delete(itemKey);
    }
    
    setSelectedItems(updatedSelectedItems);
  };
  
  const calculateSelectedTotal = () => {
    return cart.items.reduce((total, item) => {
      const itemKey = getItemKey(item.product.id, item.size);
      if (selectedItems.has(itemKey)) {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  };
  
  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert('선택된 상품이 없습니다.');
      return;
    }
    
    // Continue to checkout
    navigate('/checkout');
  };
  
  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">장바구니가 비어있습니다</h1>
          <p className="text-gray-600 mb-8">상품을 담아보세요!</p>
          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">장바구니</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-gray-900 rounded border-gray-300"
                  checked={selectedItems.size === cart.items.length && cart.items.length > 0}
                  onChange={handleSelectAllChange}
                />
                <span className="ml-2 text-sm font-medium text-gray-700">전체선택</span>
              </div>
              <button
                className="ml-4 text-sm text-gray-500 hover:text-gray-700"
                onClick={() => {
                  if (window.confirm('장바구니를 비우시겠습니까?')) {
                    dispatch({ type: 'CLEAR_CART' });
                  }
                }}
              >
                전체삭제
              </button>
            </div>
            
            {/* Items */}
            <ul className="divide-y divide-gray-200">
              <AnimatePresence>
                {cart.items.map((item) => {
                  const itemKey = getItemKey(item.product.id, item.size);
                  
                  return (
                    <motion.li
                      key={itemKey}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 py-4 flex items-center"
                    >
                      <div className="flex items-center mr-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-gray-900 rounded border-gray-300"
                          checked={selectedItems.has(itemKey)}
                          onChange={(e) => handleItemSelectChange(
                            item.product.id, 
                            item.size, 
                            e.target.checked
                          )}
                        />
                      </div>
                      
                      <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-xs text-gray-400">이미지 없음</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              <Link to={`/products/${item.product.id}`}>
                                {item.product.name}
                              </Link>
                            </h3>
                            {item.size && (
                              <p className="mt-1 text-sm text-gray-500">사이즈: {item.size}</p>
                            )}
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {item.product.price.toLocaleString()}원
                            </p>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="flex border border-gray-300 rounded-md">
                              <button
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                onClick={() => handleQuantityChange(
                                  item.product.id, 
                                  item.size, 
                                  Math.max(1, item.quantity - 1)
                                )}
                              >
                                -
                              </button>
                              <div className="w-10 text-center py-1 text-gray-900">
                                {item.quantity}
                              </div>
                              <button
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                onClick={() => handleQuantityChange(
                                  item.product.id, 
                                  item.size, 
                                  item.quantity + 1
                                )}
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              className="ml-4 text-sm text-gray-500 hover:text-gray-700"
                              onClick={() => handleRemoveItem(item.product.id, item.size)}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-20">
            <h2 className="text-lg font-medium text-gray-900 mb-4">주문 요약</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">총 상품금액</span>
                <span className="font-medium">{calculateSelectedTotal().toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">선택 상품 수</span>
                <span className="font-medium">{selectedItems.size}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">배송비</span>
                <span className="font-medium">무료</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-medium text-gray-900">총 결제금액</span>
                <span className="text-lg font-bold text-gray-900">
                  {calculateSelectedTotal().toLocaleString()}원
                </span>
              </div>
            </div>
            
            <motion.button
              className="mt-6 w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800"
              onClick={handleCheckout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={selectedItems.size === 0}
            >
              선택상품 주문하기
            </motion.button>
            
            <Link
              to="/"
              className="mt-4 block text-center text-sm text-gray-600 hover:text-gray-900"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;