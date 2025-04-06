// app/providers.tsx
import React, { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { ErrorBoundary } from '../shared/components/common/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        {children}
      </ReduxProvider>
    </ErrorBoundary>
  );
};