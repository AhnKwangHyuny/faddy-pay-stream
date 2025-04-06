// features/products/pages/ProductDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../../../shared/components/layout/Layout';
import { ProductDetails } from '../components/ProductDetails';
import { useProductDetail } from '../hooks/useProductDetail';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Button } from '../../../shared/components/ui/Button';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 0;
`;

const BackButton = styled(Button)`
  margin-bottom: 20px;
`;

export const ProductDetailPage: React.FC = () => {
  const { productId = '' } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProductDetail(productId);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <Layout>
      <Container>
        <BackButton variant="text" onClick={handleGoBack}>
          ← 돌아가기
        </BackButton>
        
        {loading ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <h2>상품을 찾을 수 없습니다</h2>
            <p>{error.message}</p>
            <Button
              variant="primary"
              onClick={() => navigate('/products')}
              style={{ marginTop: '20px' }}
            >
              상품 목록으로
            </Button>
          </ErrorContainer>
        ) : product ? (
          <ProductDetails product={product} />
        ) : (
          <ErrorContainer>
            <h2>상품 정보를 불러올 수 없습니다</h2>
            <Button
              variant="primary"
              onClick={() => navigate('/products')}
              style={{ marginTop: '20px' }}
            >
              상품 목록으로
            </Button>
          </ErrorContainer>
        )}
      </Container>
    </Layout>
  );
};