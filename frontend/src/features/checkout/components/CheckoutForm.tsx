// features/checkout/components/CheckoutForm.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CheckoutFormData } from '../types/checkout.types';
import { AddressForm } from './AddressForm';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { OrderSummary } from './OrderSummary';
import { Button } from '../../../shared/components/ui/Button';
import { useCheckout } from '../hooks/useCheckout';
import { Cart } from '../../cart/types/cart.types';

interface CheckoutFormProps {
  cart: Cart;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.section`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: 20px;
`;

const TermsContainer = styled.div`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TermsRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const TermsLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
`;

const TermsLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  margin-left: 4px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ButtonContainer = styled.div`
  margin-top: 24px;
`;

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ cart }) => {
  const { loading, processCheckout, getDefaultAddress } = useCheckout();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      name: '',
      phoneNumber: '',
      zipCode: '',
      address1: '',
      address2: '',
    },
    paymentMethod: 'CARD',
    agreeToTerms: false,
  });
  
  // 기본 배송지 로드
  useEffect(() => {
    const defaultAddress = getDefaultAddress();
    if (defaultAddress) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: defaultAddress,
      }));
    }
  }, [getDefaultAddress]);
  
  const handleAddressChange = (address: typeof formData.shippingAddress) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: address,
    }));
  };
  
  const handlePaymentMethodChange = (method: typeof formData.paymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };
  
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: e.target.checked,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processCheckout(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FormContainer>
        <Section>
          <SectionTitle>배송 정보</SectionTitle>
          <AddressForm
            address={formData.shippingAddress}
            onAddressChange={handleAddressChange}
          />
        </Section>
        
        <Section>
          <SectionTitle>결제 정보</SectionTitle>
          <PaymentMethodSelector
            selectedMethod={formData.paymentMethod}
            onMethodChange={handlePaymentMethodChange}
          />
          
          <OrderSummary cart={cart} />
          
          <TermsContainer>
            <TermsRow>
              <Checkbox
                type="checkbox"
                id="agree-terms"
                checked={formData.agreeToTerms}
                onChange={handleTermsChange}
              />
              <TermsLabel htmlFor="agree-terms">
                주문 내용을 확인하였으며, 결제에 동의합니다.
                <TermsLink href="/terms" target="_blank" rel="noopener noreferrer">
                  (이용약관)
                </TermsLink>
              </TermsLabel>
            </TermsRow>
          </TermsContainer>
          
          <ButtonContainer>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              disabled={
                loading ||
                !formData.shippingAddress.name ||
                !formData.shippingAddress.phoneNumber ||
                !formData.shippingAddress.zipCode ||
                !formData.shippingAddress.address1 ||
                !formData.agreeToTerms
              }
            >
              {formData.paymentMethod === 'CARD' ? '카드로 결제하기' : '결제하기'}
            </Button>
          </ButtonContainer>
        </Section>
      </FormContainer>
    </form>
  );
};