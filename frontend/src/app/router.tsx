// 19. 라우터 설정
// app/router.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from '../shared/components/ui/Spinner';
import { NotFound } from '../shared/components/common/NotFound';

// 페이지 컴포넌트 지연 로딩
const ProductListPage = lazy(() => import('../features/products/pages/ProductListPage').then(module => ({ default: module.ProductListPage })));
const ProductDetailPage = lazy(() => import('../features/products/pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));
const CheckoutPage = lazy(() => import('../features/checkout/pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const PaymentCompletePage = lazy(() => import('../features/checkout/pages/PaymentCompletePage').then(module => ({ default: module.PaymentCompletePage })));
const OrdersListPage = lazy(() => import('../features/orders/pages/OrdersListPage').then(module => ({ default: module.OrdersListPage })));
const OrderDetailPage = lazy(() => import('../features/orders/pages/OrderDetailPage').then(module => ({ default: module.OrderDetailPage })));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));

// 로딩 중 표시할 컴포넌트
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spinner size="large" />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 리다이렉트 */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        
        {/* 상품 관련 */}
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        
        {/* 결제 관련 */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/complete" element={<PaymentCompletePage />} />
        
        {/* 주문 관련 */}
        <Route path="/orders" element={<OrdersListPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        
        {/* 인증 관련 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};