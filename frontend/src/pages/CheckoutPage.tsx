import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { Order, OrderStatus } from '../types/order.types';
import PaymentWidget from '../components/payment/PaymentWidget';

interface CustomerInfo {
  name: string;
  phoneNumber: string;
}

const CheckoutPage: React.FC = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phoneNumber: '',
  });
  
  const [order, setOrder] = useState<Order | null>(null);
  
  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      setOrder(data);

    },
    onError: (error) => {
      console.error('Failed to create order:', error);
      alert('주문 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      alert('장바구니가 비어있습니다.');
      navigate('/cart');
      return;
    }
    
    if (!customerInfo.name.trim() || !customerInfo.phoneNumber.trim()) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }
    
    // Phone number validation
    const phonePattern = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!phonePattern.test(customerInfo.phoneNumber)) {
      alert('유효한 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
      return;
    }
    
    // 백엔드 요청에 맞는 주문 객체 생성
    const newOrder: Partial<Order> = {
      name: customerInfo.name,
      phoneNumber: customerInfo.phoneNumber,
      // email 필드 제거 (백엔드 Orderer 클래스에 없음)
      totalPrice: cart.totalPrice,
      status: OrderStatus.ORDER_COMPLETED,
      items: cart.items.map((item, index) => ({
        id: 0, // Backend will assign
        itemIdx: index + 1, // 1부터 시작 (백엔드 @Min(1) 제약조건 충족)
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        size: item.size || 'FREE', // 기본값 FREE 제공
        amount: item.product.price * item.quantity, // 단일 아이템의 총 금액
        quantity: item.quantity,
        state: OrderStatus.ORDER_COMPLETED,
      })),
    };

    console.log('주문 생성 요청:', newOrder);

    // 주문 생성 요청
    createOrderMutation.mutate(newOrder);
  };
  
  const handlePaymentSuccess = (paymentKey: string, orderId: string, amount: number) => {
    // This will be handled in PaymentSuccessPage
    console.log('Payment success:', { paymentKey, orderId, amount });
  };
  
  const handlePaymentFail = (code: string, message: string) => {
    console.error('Payment failed:', { code, message });
    alert(`결제 실패: ${message}`);
  };
  
  // If no items in cart, redirect to cart page
  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">장바구니가 비어있습니다</h2>
          <p className="text-gray-600 mb-6">결제를 진행하기 위해 상품을 장바구니에 담아주세요.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">결제하기</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">주문 상품</h2>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item, index) => (
                <li key={index} className="px-6 py-4 flex">
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
                        <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                        {item.size && (
                          <p className="mt-1 text-sm text-gray-500">사이즈: {item.size}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">수량: {item.quantity}개</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {(item.product.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">상품 금액</span>
                <span className="font-medium">{cart.totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">배송비</span>
                <span className="font-medium">무료</span>
              </div>
              <div className="flex justify-between font-medium mt-4 pt-4 border-t border-gray-200">
                <span className="text-gray-900">총 결제금액</span>
                <span className="text-gray-900">{cart.totalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </div>
          
          {!order ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">주문자 정보</h2>
              </div>
              
              <form onSubmit={handleCreateOrder} className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      이름 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      연락처 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={customerInfo.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="010-1234-5678"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? '주문 생성 중...' : '주문 생성하기'}
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>
        
        {/* Right Column - Payment Widget or Order Summary */}
        <div className="lg:col-span-1">
          {order ? (
            <PaymentWidget
              order={order}
              clientKey={process.env.REACT_APP_TOSS_PAYMENTS_CLIENT_KEY || 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFail={handlePaymentFail}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-lg font-medium text-gray-900 mb-4">결제 안내</h2>
              <p className="text-sm text-gray-600 mb-4">
                주문자 정보를 입력하고 '주문 생성하기' 버튼을 클릭하면 결제를 진행할 수 있습니다.
              </p>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">총 결제금액</span>
                  <span className="text-gray-900">{cart.totalPrice.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;