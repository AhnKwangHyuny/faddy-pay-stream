import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getOrderHistory } from '../services/orderService';
import { getPaymentDetails } from '../services/paymentService';
import { Order, OrderStatus } from '../types/order.types';
import { PaymentLedger } from '../types/payment.types';

// Skeleton loader component
const OrderHistorySkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    {[1, 2, 3].map((index) => (
      <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-5 bg-gray-200 rounded w-40"></div>
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-60"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="space-y-2">
            {[1, 2].map((itemIndex) => (
              <div key={itemIndex} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="flex justify-between">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Record<string, PaymentLedger>>({});
  
  // Fetch order history
  const { 
    data: orders, 
    isLoading, 
    error 
  } = useQuery<Order[]>({
    queryKey: ['orderHistory'],
    queryFn: getOrderHistory,
  });
  
  // Fetch payment details for orders
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (orders && orders.length > 0) {
        const paymentDetails: Record<string, PaymentLedger> = {};
        
        for (const order of orders) {
          if (order.paymentId) {
            try {
              const payment = await getPaymentDetails(order.paymentId);
              paymentDetails[order.paymentId] = payment;
            } catch (err) {
              console.error(`결제 정보 조회 실패: ${order.paymentId}`, err);
            }
          }
        }
        
        setPayments(paymentDetails);
      }
    };
    
    fetchPaymentDetails();
  }, [orders]);
  
  // Function to convert order status to human-readable text
  const getOrderStatusText = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.ORDER_COMPLETED:
        return '주문 완료';
      case OrderStatus.ORDER_CANCELLED:
        return '주문 취소';
      case OrderStatus.PAYMENT_FULLFILL:
        return '결제 완료';
      case OrderStatus.SHIPPING_PREPARE:
        return '배송 준비중';
      case OrderStatus.SHIPPING:
        return '배송중';
      case OrderStatus.SHIPPING_COMPLETED:
        return '배송 완료';
      case OrderStatus.PURCHASE_DECISION:
        return '구매 결정';
      default:
        return '알 수 없음';
    }
  };
  
  // Function to get order status badge color
  const getOrderStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.ORDER_COMPLETED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.ORDER_CANCELLED:
        return 'bg-red-100 text-red-800';
      case OrderStatus.PAYMENT_FULLFILL:
        return 'bg-green-100 text-green-800';
      case OrderStatus.SHIPPING_PREPARE:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.SHIPPING:
        return 'bg-indigo-100 text-indigo-800';
      case OrderStatus.SHIPPING_COMPLETED:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.PURCHASE_DECISION:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">주문 내역</h1>
        <OrderHistorySkeleton />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">주문 내역</h1>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                주문 내역을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">주문 내역</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">주문 내역이 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">아직 주문하신 상품이 없습니다.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
            >
              쇼핑하러 가기
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">주문 내역</h1>
      
      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order.orderId}
            className="bg-white rounded-lg shadow overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    주문번호: {order.orderId}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    주문일시: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusText(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">주문 상품</h3>
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.itemIdx} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                          <div className="mt-1 flex text-xs text-gray-500 space-x-4">
                            {item.size && <p>사이즈: {item.size}</p>}
                            <p>수량: {item.quantity}개</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-sm font-medium text-gray-900">
                            {item.amount.toLocaleString()}원
                          </p>
                          <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(item.state)}`}>
                            {getOrderStatusText(item.state)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-gray-900">결제 정보</h3>
                  <p className="text-lg font-bold text-gray-900">
                    총 {order.totalPrice.toLocaleString()}원
                  </p>
                </div>
                
                {order.paymentId && payments[order.paymentId] && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>결제 방법: {payments[order.paymentId].method}</p>
                    <p>결제 상태: {payments[order.paymentId].paymentStatus}</p>
                    {payments[order.paymentId].canceledAmount > 0 && (
                      <p className="text-red-600">
                        취소 금액: {payments[order.paymentId].canceledAmount.toLocaleString()}원
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Order Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                {(order.status === OrderStatus.ORDER_COMPLETED || 
                  order.status === OrderStatus.PAYMENT_FULLFILL) && (
                  <button
                    className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50"
                    onClick={() => {
                      if (window.confirm('주문을 취소하시겠습니까?')) {
                        // handleCancelOrder(order.orderId)
                        alert('주문 취소 기능은 아직 구현되지 않았습니다.');
                      }
                    }}
                  >
                    주문 취소
                  </button>
                )}
                
                {order.status === OrderStatus.SHIPPING_COMPLETED && (
                  <button
                    className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded text-green-700 bg-white hover:bg-green-50"
                    onClick={() => {
                      // handleConfirmDelivery(order.orderId)
                      alert('구매 확정 기능은 아직 구현되지 않았습니다.');
                    }}
                  >
                    구매 확정
                  </button>
                )}
                
                <button
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => {
                    // Handle view order details
                    alert('주문 상세 페이지는 아직 구현되지 않았습니다.');
                  }}
                >
                  상세 보기
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;