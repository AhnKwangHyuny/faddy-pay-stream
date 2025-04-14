import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '../services/orderService';
import { getPaymentDetails } from '../services/paymentService';
import { cancelPayment } from '../services/orderCancelService';
import { Order } from '../types/order.types';
import CancelOrderModal from '../components/order/CancelOrderModal';

const OrderCancelPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [paymentKey, setPaymentKey] = useState<string>('');
  
  // console.log 추가
  console.log('OrderCancelPage - orderId:', orderId);
  
  // 주문 정보 조회
  const { 
    data: order,
    isLoading: orderLoading,
    error: orderError
  } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      console.log('Fetching order with ID:', orderId);
      const result = await getOrderById(orderId || '');
      console.log('Order fetch result:', result);
      return result;
    },
    enabled: !!orderId,
  });
  
  // 주문 ID가 없는 경우 홈으로 리다이렉트
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);
  
  // 결제 정보 조회
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (order?.paymentId) {
        console.log('Fetching payment details for paymentId:', order.paymentId);
        try {
          const payment = await getPaymentDetails(order.paymentId);
          console.log('Payment details:', payment);
          if (payment) {
            setPaymentKey(payment.paymentKey || '');
            console.log('Set paymentKey:', payment.paymentKey);
          } else {
            console.warn('No payment details returned');
            setError('결제 정보를 불러올 수 없습니다.');
          }
        } catch (err) {
          console.error('결제 정보 조회 실패:', err);
          setError('결제 정보를 불러오는데 실패했습니다.');
        }
      } else {
        console.warn('No paymentId in order:', order);
        if (order) {
          setError('주문에 결제 정보가 없습니다.');
        }
      }
    };
    
    fetchPaymentDetails();
  }, [order]);
  
  // 취소 처리 함수
  const handleCancelOrder = async (reason: string) => {
    console.log('취소 요청 시작 - 주문:', order);
    console.log('취소 요청 시작 - 결제키:', paymentKey);
    
    // 테스트용 임시 paymentKey (실제 환경에서는 제거)
    const tempPaymentKey = paymentKey || "임시_결제키_" + orderId;
    
    if (!order) {
      console.error('주문 정보가 없음');
      setError('주문 정보가 유효하지 않습니다.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 취소 데이터 구성
      const cancelData = {
        orderId: order.orderId,
        cancellationReason: reason,
        cancellationItems: '전체',
        paymentKey: tempPaymentKey,
        cancellationAmount: order.totalPrice
      };
      
      console.log('취소 요청 데이터:', cancelData);
      
      const result = await cancelPayment(cancelData);
      console.log('취소 요청 결과:', result);
      
      if (result.cancelled) {
        console.log('취소 성공');
        setSuccess(true);
        setShowModal(false);
        
        // 3초 후 주문 내역으로 이동
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        console.error('취소 실패 응답:', result);
        setError('주문 취소에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('주문 취소 오류:', err);
      // 오류 상세 정보 출력
      if (err.response) {
        console.error('오류 응답:', err.response);
      }
      setError(err.message || '주문 취소 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (orderLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="mt-8 h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }
  
  if (orderError || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">주문 취소</h1>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                주문 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
              </p>
              <button
                className="mt-3 text-sm font-medium text-red-700 hover:text-red-600"
                onClick={() => navigate('/orders')}
              >
                주문 내역으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">주문 취소</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success ? (
        <motion.div
          className="bg-green-50 border-l-4 border-green-400 p-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">주문이 성공적으로 취소되었습니다. 잠시 후 주문 내역 페이지로 이동합니다.</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">주문 정보</h2>
              <p className="text-sm text-gray-600">주문번호: {order.orderId}</p>
              <p className="text-sm text-gray-600">주문자: {order.name}</p>
              <p className="text-sm text-gray-600">연락처: {order.phoneNumber}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">주문 상품</h2>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.itemIdx} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">
                          {item.size && `사이즈: ${item.size}`} | 수량: {item.quantity}개
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.amount.toLocaleString()}원
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">총 금액</h3>
                <p className="text-xl font-bold text-gray-900">{order.totalPrice.toLocaleString()}원</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => navigate('/orders')}
              >
                돌아가기
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                onClick={() => setShowModal(true)}
                disabled={isLoading || success}
              >
                {isLoading ? '처리 중...' : '주문 취소'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 취소 확인 모달 */}
      <CancelOrderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleCancelOrder}
        orderAmount={order.totalPrice}
      />
    </div>
  );
};

export default OrderCancelPage;