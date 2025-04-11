import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/PaymentFailPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        {/* 결제 성공/실패 리다이렉트 경로 추가 */}
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="payment-fail" element={<PaymentFailPage />} />
        
        {/* 토스페이먼츠 콜백용 경로도 동일한 컴포넌트로 렌더링 */}
        <Route path="success" element={<PaymentSuccessPage />} />
        <Route path="fail" element={<PaymentFailPage />} />
        
        {/* 백엔드 API 엔드포인트와 충돌하는 경로는 리다이렉트 처리 */}
        <Route path="confirm" element={<Navigate to="/" replace />} />
        
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;