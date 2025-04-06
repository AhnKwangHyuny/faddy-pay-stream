// shared/components/layout/Footer.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 40px 20px;
  background-color: ${({ theme }) => theme.colors.light};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 24px;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.textDark};
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 8px;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textLight};
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: 8px;
`;

const BottomBar = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <SectionTitle>쇼핑하기</SectionTitle>
          <LinkList>
            <LinkItem>
              <FooterLink to="/products?category=TOPS">상의</FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink to="/products?category=BOTTOMS">하의</FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink to="/products?category=DRESSES">원피스</FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink to="/products?category=OUTERWEAR">아우터</FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink to="/products?category=ACCESSORIES">액세서리</FooterLink>
            </LinkItem>
          </LinkList>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle>고객 서비스</SectionTitle>
          <LinkList>
            <LinkItem>
              <FooterLink to="/faq">자주 묻는 질문</FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink to="/shipping">배송 정보</FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink to="/returns">교환 및 반품</FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink to="/contact">문의하기</FooterLink>
            </LinkItem>
          </LinkList>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle>회사 정보</SectionTitle>
          <FooterText>FADDY 주식회사</FooterText>
          <FooterText>대표: 홍길동</FooterText>
          <FooterText>사업자등록번호: 123-45-67890</FooterText>
          <FooterText>주소: 서울특별시 강남구 테헤란로 123</FooterText>
          <FooterText>이메일: support@faddy.co.kr</FooterText>
          <FooterText>전화: 02-1234-5678</FooterText>
        </FooterSection>
      </FooterContent>
      
      <BottomBar>
        <Copyright>&copy; {currentYear} FADDY. All rights reserved.</Copyright>
        <div>
          <FooterLink to="/privacy" style={{ marginRight: '16px' }}>
            개인정보처리방침
          </FooterLink>
          <FooterLink to="/terms">이용약관</FooterLink>
        </div>
      </BottomBar>
    </FooterContainer>
  );
};