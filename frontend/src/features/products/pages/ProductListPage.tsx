// 16. 상품 목록 페이지
// features/products/pages/ProductListPage.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout } from '../../../shared/components/layout/Layout';
import { ProductGrid } from '../components/ProductGrid';
import { ProductFilter } from '../components/ProductFilter';
import { useProducts } from '../hooks/useProducts';
import { ProductFilter as ProductFilterType } from '../types/product.types';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Button } from '../../../shared/components/ui/Button';
import { PageTitle } from '../../../shared/components/common/PageTitle';
import { useResponsive } from '../../../shared/hooks/useResponsive';

const Container = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const FilterContainer = styled.div<{ isMobile: boolean; isOpen: boolean }>`
  flex: 0 0 250px;
  background-color: white;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: ${({ isMobile }) => (isMobile ? 'fixed' : 'static')};
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: ${({ theme }) => theme.zIndices.modal};
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s ease;
    overflow-y: auto;
  }
`;

const ProductsContainer = styled.div`
  flex: 1;
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const FilterToggleButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: ${({ theme }) => theme.zIndices.sticky};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-radius: 50%;
  width: 56px;
  height: 56px;
`;

export const ProductListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<ProductFilterType>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isMobile } = useResponsive();
  
  const { 
    products, 
    loading, 
    error, 
    hasMore,
    refetch
  } = useProducts(page, 12, filter);
  
  useEffect(() => {
    setPage(1);
    refetch();
  }, [filter, refetch]);
  
  const handleFilterChange = (newFilter: ProductFilterType) => {
    setFilter(newFilter);
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };
  
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  
  return (
    <Layout>
      <PageTitle>상품 목록</PageTitle>
      
      <Container>
        <FilterContainer isMobile={isMobile} isOpen={isFilterOpen}>
          <ProductFilter currentFilter={filter} onFilterChange={handleFilterChange} />
        </FilterContainer>
        
        <ProductsContainer>
          {loading && page === 1 ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Spinner size="large" />
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>상품을 불러오는 중 오류가 발생했습니다.</p>
              <Button onClick={refetch} variant="primary" style={{ marginTop: '16px' }}>
                재시도
              </Button>
            </div>
          ) : (
            <>
              <ProductGrid products={products} />
              
              {loading && page > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <Spinner />
                </div>
              )}
              
              {!loading && hasMore && (
                <LoadMoreContainer>
                  <Button onClick={handleLoadMore} variant="outline">
                    더 보기
                  </Button>
                </LoadMoreContainer>
              )}
              
              {!loading && products.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>상품이 없습니다.</p>
                </div>
              )}
            </>
          )}
        </ProductsContainer>
      </Container>
      
      {isMobile && (
        <FilterToggleButton 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          variant="primary"
          aria-label="필터 열기/닫기"
        >
          <span>필터</span>
        </FilterToggleButton>
      )}
    </Layout>
  );
};