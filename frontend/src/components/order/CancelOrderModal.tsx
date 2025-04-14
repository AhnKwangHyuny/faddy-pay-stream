import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  orderAmount: number;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderAmount,
}) => {
  const [reason, setReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  // 취소 사유 선택 핸들러
  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReason(e.target.value);
    setError('');
  };

  // 직접 입력 사유 변경 핸들러
  const handleCustomReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomReason(e.target.value);
    setError('');
  };

  // 취소 확인 핸들러
  const handleConfirm = () => {
    if (reason === '') {
      setError('취소 사유를 선택해주세요.');
      return;
    }

    if (reason === 'CUSTOM' && customReason.trim() === '') {
      setError('취소 사유를 입력해주세요.');
      return;
    }

    const finalReason = reason === 'CUSTOM' ? customReason : reason;
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">주문 취소</h3>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              주문을 취소하시겠습니까? 취소 후에는 되돌릴 수 없습니다.
            </p>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">취소 금액</p>
              <p className="text-lg font-bold text-gray-900">{orderAmount.toLocaleString()}원</p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-1">
                취소 사유
              </label>
              <select
                id="cancel-reason"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={reason}
                onChange={handleReasonChange}
              >
                <option value="">취소 사유 선택</option>
                <option value="단순 변심">단순 변심</option>
                <option value="상품 정보 상이">상품 정보와 실제 상품 상이</option>
                <option value="배송 지연">배송 지연</option>
                <option value="품절/재고 부족">품절/재고 부족</option>
                <option value="CUSTOM">직접 입력</option>
              </select>
            </div>
            
            {reason === 'CUSTOM' && (
              <div className="mb-4">
                <label htmlFor="custom-reason" className="block text-sm font-medium text-gray-700 mb-1">
                  직접 입력
                </label>
                <textarea
                  id="custom-reason"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={3}
                  value={customReason}
                  onChange={handleCustomReasonChange}
                  placeholder="취소 사유를 입력해주세요"
                />
              </div>
            )}
            
            {error && (
              <div className="mb-4 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              onClick={handleConfirm}
            >
              확인
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CancelOrderModal;
