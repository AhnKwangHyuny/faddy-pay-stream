// features/products/components/ProductFilter.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ProductCategory, ProductFilter as FilterType, Size } from '../types/product.types';
import { Button } from '../../../shared/components/ui/Button';

interface ProductFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  margin-bottom: 12px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const PriceRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PriceInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const SizeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const SizeButton = styled.button<{ isSelected: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primaryLight : 'white'};
  color: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary : theme.colors.textDark};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SortSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background-color: white;
`;

const FilterActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
`;

// 카테고리 옵션
const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: 'TOPS', label: '상의' },
  { value: 'BOTTOMS', label: '하의' },
  { value: 'DRESSES', label: '원피스' },
  { value: 'OUTERWEAR', label: '아우터' },
  { value: 'ACCESSORIES', label: '액세서리' },
];

// 정렬 옵션
const sortOptions = [
  { value: 'newest', label: '신상품순' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'popular', label: '인기순' },
];

// 사이즈 옵션
const sizeOptions: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const ProductFilter: React.FC<ProductFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const [filter, setFilter] = useState<FilterType>(currentFilter);
  
  // 필터 변경시 상태 업데이트
  useEffect(() => {
    setFilter(currentFilter);
  }, [currentFilter]);
  
  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: ProductCategory) => {
    setFilter((prev) => {
      if (prev.category === category) {
        // 이미 선택된 카테고리면 제거
        const { category: _, ...rest } = prev;
        return rest;
      }
      // 새 카테고리 선택
      return { ...prev, category };
    });
  };
  
  // 가격 범위 변경 핸들러
  const handlePriceChange = (
    type: 'minPrice' | 'maxPrice',
    value: string
  ) => {
    const numValue = value === '' ? undefined : Number(value);
    setFilter((prev) => ({ ...prev, [type]: numValue }));
  };
  
  // 사이즈 변경 핸들러
  const handleSizeChange = (size: Size) => {
    setFilter((prev) => {
      const currentSizes = prev.sizes || [];
      if (currentSizes.includes(size)) {
        // 이미 선택된 사이즈면 제거
        return {
          ...prev,
          sizes: currentSizes.filter((s) => s !== size),
        };
      }
      // 새 사이즈 추가
      return {
        ...prev,
        sizes: [...currentSizes, size],
      };
    });
  };
  
  // 정렬 방식 변경 핸들러
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value as FilterType['sort'];
    setFilter((prev) => ({ ...prev, sort: sortValue }));
  };
  
  // 필터 적용 핸들러
  const handleApplyFilter = () => {
    onFilterChange(filter);
  };
  
  // 필터 초기화 핸들러
  const handleResetFilter = () => {
    setFilter({});
    onFilterChange({});
  };
  
  return (
    <div>
      <FilterSection>
        <SectionTitle>카테고리</SectionTitle>
        <CheckboxGroup>
          {categoryOptions.map((option) => (
            <CheckboxLabel key={option.value}>
              <Checkbox
                type="checkbox"
                checked={filter.category === option.value}
                onChange={() => handleCategoryChange(option.value)}
              />
              {option.label}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </FilterSection>
      
      <FilterSection>
        <SectionTitle>가격 범위</SectionTitle>
        <PriceRangeContainer>
          <PriceInputGroup>
            <PriceInput
              type="number"
              placeholder="최소 가격"
              value={filter.minPrice || ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            />
            <span>~</span>
            <PriceInput
              type="number"
              placeholder="최대 가격"
              value={filter.maxPrice || ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            />
          </PriceInputGroup>
          <ButtonGroup>
            <Button
              size="small"
              variant="outline"
              onClick={() => {
                setFilter((prev) => ({ ...prev, minPrice: 0, maxPrice: 30000 }));
              }}
            >
              3만원 이하
            </Button>
            <Button
              size="small"
              variant="outline"
              onClick={() => {
                setFilter((prev) => ({ ...prev, minPrice: 30000, maxPrice: 50000 }));
              }}
            >
              3~5만원
            </Button>
          </ButtonGroup>
        </PriceRangeContainer>
      </FilterSection>
      
      <FilterSection>
        <SectionTitle>사이즈</SectionTitle>
        <SizeGroup>
          {sizeOptions.map((size) => (
            <SizeButton
              key={size}
              isSelected={filter.sizes?.includes(size) || false}
              onClick={() => handleSizeChange(size)}
            >
              {size}
            </SizeButton>
          ))}
        </SizeGroup>
      </FilterSection>
      
      <FilterSection>
        <SectionTitle>정렬</SectionTitle>
        <SortSelect
          value={filter.sort || 'newest'}
          onChange={handleSortChange}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SortSelect>
      </FilterSection>
      
      <FilterActions>
        <Button
          variant="primary"
          fullWidth
          onClick={handleApplyFilter}
        >
          필터 적용
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={handleResetFilter}
        >
          필터 초기화
        </Button>
      </FilterActions>
    </div>
  );
};