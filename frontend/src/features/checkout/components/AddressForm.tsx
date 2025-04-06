// features/checkout/components/AddressForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Address } from '../types/checkout.types';
import { Button } from '../../../shared/components/ui/Button';
import { useCheckout } from '../hooks/useCheckout';

interface AddressFormProps {
  address: Address;
  onAddressChange: (address: Address) => void;
}

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textDark};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddressActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const SavedAddressList = styled.div`
  margin-bottom: 24px;
`;

const SavedAddressItem = styled.div<{ isSelected: boolean }>`
  padding: 12px;
  border: 1px solid ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  margin-bottom: 8px;
  cursor: pointer;
  background-color: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primaryLight : 'white'};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddressName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const AddressDetail = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

export const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onAddressChange,
}) => {
  const { getSavedAddresses, saveAddress } = useCheckout();
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const savedAddresses = getSavedAddresses();
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onAddressChange({
      ...address,
      [name]: value,
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onAddressChange({
      ...address,
      [name]: checked,
    });
  };
  
  const handleSaveAddress = () => {
    if (
      !address.name ||
      !address.phoneNumber ||
      !address.zipCode ||
      !address.address1
    ) {
      alert('배송지 정보를 모두 입력해주세요.');
      return;
    }
    
    saveAddress(address);
    alert('배송지가 저장되었습니다.');
  };
  
  const handleSelectAddress = (selectedAddress: Address) => {
    onAddressChange(selectedAddress);
    setShowSavedAddresses(false);
  };
  
  // 우편번호 검색 
  const handleSearchAddress = () => {
    // 실제로는 다음 우편번호 API 또는 다른 서비스를 이용할 수 있음
    alert('현재 우편번호 검색 기능은 구현되지 않았습니다. 직접 입력해주세요.');
  };
  
  return (
    <div>
      <AddressActions>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowSavedAddresses(!showSavedAddresses)}
        >
          {showSavedAddresses ? '직접 입력하기' : '저장된 배송지'}
        </Button>
        
        {!showSavedAddresses && (
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAddress}
          >
            현재 배송지 저장
          </Button>
        )}
      </AddressActions>
      
      {showSavedAddresses && savedAddresses.length > 0 ? (
        <SavedAddressList>
          {savedAddresses.map((savedAddress, index) => (
            <SavedAddressItem
              key={index}
              isSelected={
                savedAddress.zipCode === address.zipCode &&
                savedAddress.address1 === address.address1
              }
              onClick={() => handleSelectAddress(savedAddress)}
            >
              <AddressName>
                {savedAddress.name} {savedAddress.isDefault && '(기본 배송지)'}
              </AddressName>
              <AddressDetail>
                {savedAddress.zipCode} {savedAddress.address1} {savedAddress.address2}
              </AddressDetail>
              <AddressDetail>{savedAddress.phoneNumber}</AddressDetail>
            </SavedAddressItem>
          ))}
        </SavedAddressList>
      ) : (
        <>
          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="name">수령인</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={address.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="phoneNumber">연락처</Label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={address.phoneNumber}
                onChange={handleInputChange}
                placeholder="010-0000-0000"
                required
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup style={{ flex: 0.4 }}>
              <Label htmlFor="zipCode">우편번호</Label>
              <Input
                type="text"
                id="zipCode"
                name="zipCode"
                value={address.zipCode}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup style={{ flex: 0.6, alignSelf: 'flex-end' }}>
              <Button
                type="button"
                variant="outline"
                onClick={handleSearchAddress}
              >
                우편번호 검색
              </Button>
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="address1">주소</Label>
            <Input
              type="text"
              id="address1"
              name="address1"
              value={address.address1}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="address2">상세주소</Label>
            <Input
              type="text"
              id="address2"
              name="address2"
              value={address.address2}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <CheckboxRow>
            <Checkbox
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={!!address.isDefault}
              onChange={handleCheckboxChange}
            />
            <Label htmlFor="isDefault" style={{ display: 'inline', marginBottom: 0 }}>
              기본 배송지로 저장
            </Label>
          </CheckboxRow>
        </>
      )}
    </div>
  );
};