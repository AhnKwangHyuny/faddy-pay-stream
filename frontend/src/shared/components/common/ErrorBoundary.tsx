// 21. 에러 경계 컴포넌트
// shared/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from '../ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 400px;
`;

const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  margin-bottom: 24px;
  max-width: 500px;
`;

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 에러 로깅 서비스에 에러 보고
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorTitle>예상치 못한 오류가 발생했습니다</ErrorTitle>
          <ErrorMessage>
            {this.state.error?.message || '애플리케이션에 오류가 발생했습니다. 다시 시도해 주세요.'}
          </ErrorMessage>
          <Button onClick={this.handleReset} variant="primary">
            다시 시도하기
          </Button>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}