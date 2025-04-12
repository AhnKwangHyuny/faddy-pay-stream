import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '../services/orderService';
import { getPaymentDetails } from '../services/paymentService';
import { cancelOrder } from '../services/orderCancelService';
import { Order, OrderStatus } from '../types/order.types';
import { toast } from '../utils/toast';

const OrderCancelPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [cancelReason, setCancelReason] = useState<string>('고객 요청에 의한 주문 취소');
  const [cancelAmount, setCancelAmount] = useState<number>(0);
  const [isFullCancel, setIsFullCancel] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 주문 정보 조회
  const { 
    data: order, 
    isLoading, 
    error,
    isError
  } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId || ''),
    enabled: !!orderId,
  });

  // 결제 정보 조회
  const { 
    data: payment,
    isLoading: isLoadingPayment 
  } = useQuery({
    queryKey: ['payment', order?.paymentId],
    queryFn: () => getPaymentDetails(order?.paymentId || ''),
    enabled: !!order?.paymentId,
  });

  // 선택된 상품의 총 금액 계산
  const calculateSelectedAmount = () => {
    if (!order || selectedItems.length === 0) return 0;
    
    return order.items
      .filter(item => selectedItems.includes(item.itemIdx))
      .reduce((total, item) => total + item.amount, 0);
  };

  // 선택된 항목 변경 시 취소 금액 업데이트
  useEffect(() => {
    if (isFullCancel && order) {
      setCancelAmount(order.totalPrice);
    } else {
      setCancelAmount(calculateSelectedAmount());
    }
  }, [isFullCancel, selectedItems, order]);

  // 취소 항목 선택 토글
  const toggleItemSelection = (itemIdx: number) => {
    setSelectedItems(prev => 
      prev.includes(itemIdx)
        ? prev.filter(idx => idx !== itemIdx)
        : [...prev, itemIdx]
    );
  };

  // 취소 처리 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order || !order.paymentId) {
      toast.error('주문 정보를 찾을 수 없습니다.');
      return;
    }
    
    if (!isFullCancel && selectedItems.length === 0) {
      toast.error('취소할 상품을 선택해주세요.');
      return;
    }
    
    if (cancelAmount <= 0) {
      toast.error('취소 금액이 올바르지 않습니다.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const result = await cancelOrder(
        order.orderId,
        order.paymentId,
        cancelReason,
        isFullCancel ? [] : selectedItems,
        cancelAmount
      );
      
      if (result) {
        toast.success('주문이 성공적으로 취소되었습니다.');
        navigate('/orders');
      } else {
        toast.error('주문 취소에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('주문 취소 실패:', error);
      toast.error(error.message || '주문 취소 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중
  if (isLoading || isLoadingPayment) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">주문 취소</h1>
        <div className="animate-pulse bg-gray-100 p-8 rounded-lg">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
          
          <div className="h-32 bg-gray-300 rounded mb-6"></div>
          
          <div className="h-12 bg-gray-300 rounded w-48"></div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (isError || !order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">주문 취소</h1>
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">
            주문 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        </div>
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => navigate('/orders')}
        >
          주문 내역으로 돌아가기
        </button>
      </div>
    );
  }

  // 취소 불가능한 상태
  const isCancellable = 
    order.status === OrderStatus.ORDER_COMPLETED || 
    order.status === OrderStatus.PAYMENT_FULLFILL;

  if (!isCancellable) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">주문 취소</h1>
        <div className="bg-yellow-50 p-4 rounded-md mb-6">
          <p className="text-yellow-700">
            해당 주문은 현재 취소가 불가능한 상태입니다.
          </p>
        </div>
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => navigate('/orders')}
        >
          주문 내역으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">주문 취소</h1>
      
      {/* 주문 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">주문 정보</h2>
        <p className="mb-2">주문 번호: {order.orderId}</p>
        <p className="mb-2">주문자: {order.name}</p>
        <p className="mb-2">주문 일시: {new Date(order.createdAt || '').toLocaleString()}</p>
        <p className="mb-4">주문 상태: {order.status}</p>
        
        <div className="border-t pt-4">
          <p className="font-medium">총 주문 금액: {order.totalPrice.toLocaleString()}원</p>
          {payment && payment.canceledAmount > 0 && (
            <p className="text-red-600">
              이미 취소된 금액: {payment.canceledAmount.toLocaleString()}원
            </p>
          )}
          {payment && (
            <p className="text-blue-600">
              취소 가능 금액: {payment.balanceAmount.toLocaleString()}원
            </p>
          )}
        </div>
      </div>
      
      {/* 취소 폼 */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">취소 정보</h2>
        
        {/* 취소 유형 선택 */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">취소 유형</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={isFullCancel}
                onChange={() => setIsFullCancel(true)}
                className="mr-2"
              />
              전체 취소
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!isFullCancel}
                onChange={() => setIsFullCancel(false)}
                className="mr-2"
              />
              부분 취소
            </label>
          </div>
        </div>
        
        {/* 부분 취소 시 상품 선택 */}
        {!isFullCancel && (
          <div className="mb-6">
            <label className="block mb-2 font-medium">취소할 상품 선택</label>
            <div className="border rounded-md divide-y">
              {order.items.map(item => (
                <div key={item.itemIdx} className="p-4 flex items-center">
                  <input
                    type="checkbox"
                    id={`item-${item.itemIdx}`}
                    checked={selectedItems.includes(item.itemIdx)}
                    onChange={() => toggleItemSelection(item.itemIdx)}
                    className="mr-3"
                  />
                  <label htmlFor={`item-${item.itemIdx}`} className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-600">
                      {item.size && `사이즈: ${item.size} / `}수량: {item.quantity}개
                    </div>
                  </label>
                  <div className="text-right">
                    <div>{item.amount.toLocaleString()}원</div>
                    <div className="text-xs text-gray-500">
                      {item.price.toLocaleString()}원 × {item.quantity}개
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 취소 사유 */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">취소 사유</label>
          <select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="고객 요청에 의한 주문 취소">고객 요청에 의한 주문 취소</option>
            <option value="상품 품절">상품 품절</option>
            <option value="배송 지연">배송 지연</option>
            <option value="상품 하자">상품 하자</option>
            <option value="기타 사유">기타 사유</option>
          </select>
        </div>
        
        {/* 취소 금액 */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">취소 금액</label>
          <input
            type="number"
            value={cancelAmount}
            onChange={(e) => setCancelAmount(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min="0"
            max={payment?.balanceAmount || order.totalPrice}
            disabled={isFullCancel}
          />
          <p className="text-sm text-gray-600 mt-1">
            {isFullCancel ? '전체 취소 시 전체 금액이 환불됩니다.' : '선택한 상품의 금액이 환불됩니다.'}
          </p>
        </div>
        
        {/* 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="px-4 py-2 border rounded"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '주문 취소 신청'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderCancelPage;