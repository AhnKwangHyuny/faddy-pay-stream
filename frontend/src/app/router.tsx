// 19. 라우터 설정
// app/router.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from '../shared/components/ui/Spinner';
import { NotFound } from '../shared/components/common/NotFound';
import { createBrowserRouter } from 'react-router-dom';

// 페이지 컴포넌트 지연 로딩
const ProductListPage = lazy(() => import('../features/products/pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('../features/products/pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('../features/checkout/pages/CheckoutPage'));
const TossPaymentPage = lazy(() => import('../features/payment/pages/TossPaymentPage'));
const PaymentCompletePage = lazy(() => import('../features/payment/pages/PaymentCompletePage'));
const PaymentFailPage = lazy(() => import('../features/payment/pages/PaymentFailPage'));
const OrderListPage = lazy(() => import('../features/orders/pages/OrderListPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('../shared/pages/NotFoundPage'));

// 로딩 중 표시할 컴포넌트
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spinner size="large" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProductListPage />,
  },
  {
    path: '/products/:productId',
    element: <ProductDetailPage />,
  },
  {
    path: '/checkout',
    element: <CheckoutPage />,
  },
  {
    path: '/payment/checkout',
    element: <TossPaymentPage />,
  },
  {
    path: '/payment/complete',
    element: <PaymentCompletePage />,
  },
  {
    path: '/payment/fail',
    element: <PaymentFailPage />,
  },
  {
    path: '/orders',
    element: <OrderListPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

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
        <Route path="/payment/checkout" element={<TossPaymentPage />} />
        <Route path="/payment/complete" element={<PaymentCompletePage />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />
        
        {/* 주문 관련 */}
        <Route path="/orders" element={<OrderListPage />} />
        
        {/* 인증 관련 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};