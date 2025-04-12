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
import OrderCancelPage from './pages/OrderCancelPage';

const AppRoutes: React.FC = () => {
  // 현재 실행 중인 URL 확인
  const baseUrl = window.location.origin;
  console.log("Application running at:", baseUrl);

  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />

          {/* 결제 관련 경로들 */}
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="payment-fail" element={<PaymentFailPage />} />

          {/* 토스페이먼츠 콜백용 경로도 명시적으로 정의 */}
          <Route path="success" element={<PaymentSuccessPage />} />
          <Route path="fail" element={<PaymentFailPage />} />

          {/* 백엔드 API 엔드포인트와 충돌하는 경로는 리다이렉트 처리 */}
          <Route path="confirm" element={<Navigate to="/" replace />} />

          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="orders/cancel/:orderId" element={<OrderCancelPage />} />

          {/* 모든 undefined 경로는 홈으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
  );
};

export default AppRoutes;