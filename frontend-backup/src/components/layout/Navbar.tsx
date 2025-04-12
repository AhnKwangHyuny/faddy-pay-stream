import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar: React.FC = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-gray-900">
              SHOP
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/orders" className="text-gray-600 hover:text-gray-900">
              주문내역
            </Link>
            
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
              장바구니
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;