import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { confirmPayment, getPaymentSuccess } from '../services/paymentService';
import { getOrderById } from '../services/orderService';
import { Order, OrderStatus } from '../types/order.types';
import { PaymentApproved } from '../types/payment.types';
import { useCart } from '../context/CartContext';

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processedPaymentKey, setProcessedPaymentKey] = useState<string | null>(null);
  
  // 결제 승인 요청 뮤테이션
  const confirmPaymentMutation = useMutation({
    mutationFn: (params: PaymentApproved) => 
      confirmPayment(params.paymentKey, params.orderId, params.amount),
    onSuccess: async (result, variables) => {
      try {
        console.log("결제 승인 성공:", result);
        
        // 결제 성공 처리
        await getPaymentSuccess(variables.paymentKey, variables.orderId, variables.amount);
        
        try {
          // 주문 정보 조회
          const orderData = await getOrderById(variables.orderId);
          setOrder(orderData);
          
          // 장바구니 비우기
          dispatch({ type: 'CLEAR_CART' });
        } catch (orderErr: any) {
          console.error('주문 정보 조회 실패:', orderErr);
          // 주문 정보 조회 실패 시에도 결제 성공 화면을 보여줌
          // 더미 주문 데이터 생성
          setOrder({
            orderId: variables.orderId,
            name: '고객',
            email: 'customer@example.com',
            phoneNumber: '',
            totalPrice: variables.amount,
            items: [{ 
              id: 0,
              itemIdx: 1, // 최소값 1 (백엔드 @Min(1) 제약조건 충족)
              productId: uuidv4(), // 유효한 UUID 생성
              productName: '결제 상품', 
              price: variables.amount,
              quantity: 1,
              amount: variables.amount,
              size: '',
              state: OrderStatus.PAYMENT_FULLFILL
            }],
            status: OrderStatus.PAYMENT_FULLFILL
          });
        }
      } catch (err: any) {
        console.error('결제 성공 처리 실패:', err);
        setError('결제는 승인되었으나 추가 처리 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error: any) => {
      console.error('결제 승인 실패:', error);
      setError(error.message || '결제 승인 중 오류가 발생했습니다.');
      setIsLoading(false);
      
      // 실패 페이지로 리다이렉트
      navigate(`/fail?message=${encodeURIComponent(error.message || '결제 승인 실패')}&code=${error.code || 'UNKNOWN'}`);
    },
  });
  
  useEffect(() => {
    const processPayment = async () => {
      try {
        // URL 파라미터 추출
        const urlParams = new URLSearchParams(location.search);
        const paymentKey = urlParams.get('paymentKey');
        const orderId = urlParams.get('orderId');
        const amount = urlParams.get('amount');
        
        if (!paymentKey || !orderId || !amount) {
          throw new Error('필수 결제 정보가 누락되었습니다.');
        }
        
        // 이미 처리된 결제인지 확인
        if (processedPaymentKey === paymentKey) {
          console.log('이미 처리된 결제입니다:', paymentKey);
          return;
        }
        
        // 처리할 결제 키 저장
        setProcessedPaymentKey(paymentKey);
        
        // 백엔드에 결제 승인 요청
        confirmPaymentMutation.mutate({
          paymentKey,
          orderId,
          amount: parseInt(amount, 10),
        });
      } catch (err: any) {
        console.error('Error processing payment:', err);
        setError(err.message || '결제 처리 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };
    
    processPayment();
  }, [location.search, navigate, processedPaymentKey]); // confirmPaymentMutation 의존성 제거
  
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8 text-center">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-8 w-1/2 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="mt-12">
          <svg className="animate-spin h-10 w-10 text-gray-400 mx-auto" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">결제 정보를 처리 중입니다...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8 text-center">
        <div className="rounded-full h-24 w-24 bg-red-100 flex items-center justify-center mx-auto">
          <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">결제 처리 중 오류가 발생했습니다</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <div className="mt-8">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
          >
            장바구니로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">주문 정보를 찾을 수 없습니다</h2>
        <p className="mt-2 text-gray-600">주문 정보를 불러오는데 문제가 발생했습니다.</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="max-w-2xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <div className="rounded-full h-24 w-24 bg-green-100 flex items-center justify-center mx-auto">
          <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">결제 완료</h2>
        <p className="mt-2 text-gray-600">주문이 성공적으로 완료되었습니다.</p>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">주문 정보</h3>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">주문번호</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.orderId}</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">주문일시</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {order.createdAt 
                  ? new Date(order.createdAt).toLocaleString() 
                  : new Date().toLocaleString()}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">주문자</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.name}</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">연락처</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.phoneNumber}</dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">결제금액</dt>
              <dd className="mt-1 text-sm text-gray-900 font-bold">
                {order.totalPrice.toLocaleString()}원
              </dd>
            </div>
          </dl>
        </div>
        
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">주문 상품</h3>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <li key={item.itemIdx} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                  <div className="mt-1 flex text-sm text-gray-500">
                    {item.size && <p>사이즈: {item.size}</p>}
                    <p className="ml-4">수량: {item.quantity}개</p>
                  </div>
                </div>
                <div className="ml-4 text-sm font-medium text-gray-900">
                  {item.amount.toLocaleString()}원
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          쇼핑 계속하기
        </button>
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
        >
          주문 내역 보기
        </button>
      </div>
    </motion.div>
  );
};

export default PaymentSuccessPage;