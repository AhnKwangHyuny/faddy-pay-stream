import React, { useState } from 'react';
import styled from 'styled-components';
import { Layout } from '../../../shared/components/layout/Layout';
import { LoginForm } from '../components/LoginForm';
import { SocialLogin } from '../components/SocialLogin';
import { PageTitle } from '../../../shared/components/common/PageTitle';

const LoginContainer = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
`;

const Divider = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const DividerText = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  padding: 0 16px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const LoginPage: React.FC = () => {
  return (
    <Layout>
      <LoginContainer>
        <PageTitle>로그인</PageTitle>
        <LoginForm />
        
        <DividerContainer>
          <Divider />
          <DividerText>또는</DividerText>
          <Divider />
        </DividerContainer>
        
        <SocialLogin />
      </LoginContainer>
    </Layout>
  );
};

export default LoginPage; 