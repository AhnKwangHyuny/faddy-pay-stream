import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { handlePaymentFailure } from '../services/paymentService';

interface PaymentError {
  code: string;
  message: string;
}

const PaymentFailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<PaymentError>({ code: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(true);
  
  useEffect(() => {
    const processFailure = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code') || 'UNKNOWN';
        const message = urlParams.get('message') || '알 수 없는 오류가 발생했습니다.';
        
        setError({ code, message });
        
        // 백엔드에 실패 정보 전송
        await handlePaymentFailure(message);
      } catch (err) {
        console.error('Error processing payment failure:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    
    processFailure();
  }, [location.search]);
  
  // Get a user-friendly error message based on the error code
  const getErrorDescription = (code: string): string => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제 프로세스가 사용자에 의해 취소되었습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제 프로세스가 중단되었습니다.';
      case 'INVALID_CARD_COMPANY':
        return '유효하지 않은 카드 회사입니다.';
      case 'INVALID_CARD_NUMBER':
        return '유효하지 않은 카드 번호입니다.';
      case 'INVALID_CARD_EXPIRY':
        return '유효하지 않은 카드 만료일입니다.';
      case 'INVALID_CARD_PASSWORD':
        return '유효하지 않은 카드 비밀번호입니다.';
      case 'INVALID_CARD_INSTALL_PLAN':
        return '유효하지 않은 할부 계획입니다.';
      case 'CARD_PAYMENT_DECLINED':
        return '카드 결제가 거부되었습니다.';
      case 'CARD_PAYMENT_PROCESSING_ERROR':
        return '카드 결제 처리 중 오류가 발생했습니다.';
      case 'INSUFFICIENT_BALANCE':
        return '잔액이 부족합니다.';
      default:
        return '결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
  };
  
  return (
    <motion.div 
      className="max-w-2xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-full h-24 w-24 bg-red-100 flex items-center justify-center mx-auto">
        <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      
      <h2 className="mt-6 text-3xl font-bold text-gray-900">결제 실패</h2>
      <p className="mt-2 text-gray-600">결제 처리 중 문제가 발생했습니다.</p>
      
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">오류 정보</h3>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {getErrorDescription(error.code)}
                </p>
              </div>
            </div>
          </div>
          
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">오류 코드</dt>
              <dd className="mt-1 text-sm text-gray-900">{error.code}</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">오류 메시지</dt>
              <dd className="mt-1 text-sm text-gray-900">{error.message}</dd>
            </div>
          </dl>
          
          <div className="mt-8 text-sm">
            <p className="text-gray-600">
              결제 실패 시 다음과 같은 사항을 확인해 보세요:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 text-left">
              <li>카드 정보가 올바르게 입력되었는지 확인</li>
              <li>카드의 결제 한도를 확인</li>
              <li>해당 카드사의 서비스 상태 확인</li>
              <li>네트워크 연결 상태 확인</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => navigate('/checkout')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
        >
          결제 다시 시도
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          장바구니로 돌아가기
        </button>
      </div>
    </motion.div>
  );
};

export default PaymentFailPage;