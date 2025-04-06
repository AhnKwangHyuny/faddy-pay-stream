// features/checkout/hooks/useCheckout.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/hooks/useCart';
import { Address, CheckoutFormData } from '../types/checkout.types';
import { createOrder } from '../services/checkoutApi';
import { usePayment } from './usePayment';
import { toast } from 'react-toastify';

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { cart, emptyCart } = useCart();
  const { initiatePayment } = usePayment();
  const navigate = useNavigate();
  
  // 주문 및 결제 프로세스 시작
  const processCheckout = async (formData: CheckoutFormData): Promise<void> => {
    if (cart.items.length === 0) {
      toast.error('장바구니가 비어 있습니다.');
      return;
    }
    
    if (!formData.agreeToTerms) {
      toast.error('이용약관에 동의해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 1. 주문 생성
      const { orderId, amount, orderName } = await createOrder(
        cart,
        formData.shippingAddress
      );
      
      // 2. 결제 시작
      await initiatePayment({
        orderId,
        orderName,
        amount,
        customerName: formData.shippingAddress.name,
        paymentMethod: formData.paymentMethod,
        onSuccess: () => {
          // 결제 성공 시 장바구니 비우기
          emptyCart();
          // 결제 완료 페이지로 이동
          navigate(`/payment/complete?orderId=${orderId}`);
        },
        onFailure: (error) => {
          setError(error);
          toast.error(`결제 실패: ${error.message}`);
          navigate('/checkout');
        }
      });
      
    } catch (err) {
      setError(err as Error);
      toast.error(`주문 처리 중 오류가 발생했습니다: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 배송지 정보 저장 (로컬 스토리지)
  const saveAddress = (address: Address): void => {
    try {
      // 이전 저장된 주소 가져오기
      const savedAddresses = JSON.parse(
        localStorage.getItem('savedAddresses') || '[]'
      ) as Address[];
      
      // 기본 배송지로 설정된 경우, 다른 주소들의 기본 설정 해제
      if (address.isDefault) {
        savedAddresses.forEach((addr) => {
          addr.isDefault = false;
        });
      }
      
      // 동일한 주소가 있는지 확인
      const existingIndex = savedAddresses.findIndex(
        (addr) => addr.zipCode === address.zipCode && addr.address1 === address.address1
      );
      
      if (existingIndex >= 0) {
        // 기존 주소 업데이트
        savedAddresses[existingIndex] = address;
      } else {
        // 새 주소 추가
        savedAddresses.push(address);
      }
      
      // 저장
      localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
    } catch (error) {
      console.error('주소 저장 오류:', error);
    }
  };
  
  // 저장된 배송지 목록 가져오기
  const getSavedAddresses = (): Address[] => {
    try {
      return JSON.parse(localStorage.getItem('savedAddresses') || '[]') as Address[];
    } catch (error) {
      console.error('저장된 주소 불러오기 오류:', error);
      return [];
    }
  };
  
  // 기본 배송지 가져오기
  const getDefaultAddress = (): Address | null => {
    const addresses = getSavedAddresses();
    return addresses.find((addr) => addr.isDefault) || null;
  };
  
  return {
    loading,
    error,
    cart,
    processCheckout,
    saveAddress,
    getSavedAddresses,
    getDefaultAddress,
  };
};